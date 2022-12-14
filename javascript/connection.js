class Connection {
    constructor(chess) {
        this.chess = chess

        // requests
        this.requests = {}

        // create websocket connection
        this.socket = new WebSocket(this.chess.config.chessWSServerAddr);

        // start websocket events
        this.webSocketEvents()
    }

    // websocket events
    webSocketEvents() {
        const conn = this

        // websocket connection are close
        this.socket.onclose = function () {
            alert("Connection to server lost")
        }

        // came message
        this.socket.onmessage = function (answer) {
            const data = JSON.parse(answer.data);
            console.log(data)
            if (typeof data.body == "undefined" || typeof data.body.request_id == "undefined") {
                // event
                conn.onEvent(data)
            } else {
                // response to request
                conn.onResponse(data)
            }
        }
    }

    // send request to server and
    // save unique id and time of create to chess.requests
    // to process the server response
    sendRequest(request) {
        let type
        if (typeof request.post !== "undefined") {
            type = request.post
        } else {
            console.log("ERROR: Bad request")
            console.log(request)
            return false
        }
        do {
            request.id = Math.floor(Math.random() * 1000000)
        } while (typeof this.requests[request.id] !== "undefined")
        this.requests[request.id] = {dt_create: Math.floor(Date.now() / 1000), type: type}
        console.log(request)
        this.socket.send(JSON.stringify(request))
        return true
    }

    onEvent(data) {
        if (typeof data.post !== "undefined") {
            switch (data.post) {
                case "your":
                    this.chess.game.setTeamName(data.body.team_name)
                    this.chess.game.setEnemyName()
                    this.chess.scoreboard.showTeamName()
                    break
                case "board":
                    this.chess.board.setBoardFigures(data.body)
                    break
                case "game_play":
                    this.chess.game.setPlay(data.body)
                    if (!this.chess.game.over) {
                        this.chess.scoreboard.showPlay()
                    }
                    break
                case "game_over":
                    this.chess.game.setOver(data.body)
                    if (this.chess.game.over) {
                        this.chess.game.execOver()
                        this.chess.scoreboard.showOver()
                        this.chess.actions.showOver()
                    } else {
                        this.chess.game.setStart()
                        this.chess.scoreboard.showPlay()
                        this.chess.actions.showPlay()
                    }
                    break
                case "turn":
                    this.chess.game.setTurn(data.body)
                    this.chess.scoreboard.showTurn()
                    this.chess.scoreboard.changeTurnBacklight()
                    break
                case "step_time":
                    this.chess.game.setTime(data.body.left, data.body.team_name)
                    this.chess.scoreboard.showStepTimeLeft()
                    this.chess.scoreboard.timeLeftChangeBacklight()
                    break
                case "reserve_time":
                    this.chess.game.setTime(data.body.left, data.body.team_name)
                    this.chess.scoreboard.showReserveTimeLeft()
                    this.chess.scoreboard.reserveTimeLeftChangeTimers()
                    break
                case "move":
                    this.chess.board.setMove(data.body)
                    this.chess.board.execMove()
                    break
                case "opponent_offer_a_draw":
                    this.chess.actions.showOfferDrawDecisions()
                    break
                case "draw_confirm_time":
                    this.chess.actions.changeOfferDrawTimer(data.body.left)
                    break
                case "attempts_to_offer_a_draw":
                    this.chess.actions.setAttemptsLeftToOfferADraw(data.body.left)
                    this.chess.actions.changeAttemptsLeftToOfferADrawButton()
                    break
            }
        }
    }

    // move response processing
    moveResponseProcessing(data) {
        if (!data.body.valid) {
            // move not valid stay back taking figure
            this.chess.board.stayBackTakingFigure()
            this.chess.cause.showCause(data.body.cause)
        }
    }

    offerDrawResponse(data) {
        this.chess.actions.offerDrawWaitDecision = false
        this.chess.actions.offerDraw.disabled = false
        this.chess.actions.changeAttemptsLeftToOfferADrawButton()
        if (!data.body.valid) {
            this.chess.cause.showCause(data.body.cause)
        }
    }

    // server response to request
    onResponse(data) {
        switch (this.requests[data.body.request_id].type) {
            case "move":
                this.moveResponseProcessing(data)
                break
            case "offer_a_draw":
                this.offerDrawResponse(data)
                break
        }
    }

}
