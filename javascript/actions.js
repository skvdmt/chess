class Actions {
    constructor(chess) {
        this.chess = chess

        // making actions
        this.container = document.createElement("div")
        this.surrender = document.createElement("button")
        this.newGame = document.createElement("button")
        this.offerDraw = document.createElement("button")
        this.offerDrawDecisions = document.createElement("div")
        this.offerDrawHeader = document.createElement("div")
        this.offerDrawQuestion = document.createElement("div")
        this.offerDrawButtons = document.createElement("div")
        this.offerDrawAccept = document.createElement("button")
        this.offerDrawReject = document.createElement("button")
        this.offerDrawTimer = document.createElement("div")

        this.container.appendChild(this.surrender)
        this.container.appendChild(this.newGame)
        this.container.appendChild(this.offerDraw)
        this.container.appendChild(this.offerDrawDecisions)
        this.offerDrawDecisions.appendChild(this.offerDrawHeader)
        this.offerDrawDecisions.appendChild(this.offerDrawQuestion)
        this.offerDrawDecisions.appendChild(this.offerDrawButtons)
        this.offerDrawButtons.appendChild(this.offerDrawAccept)
        this.offerDrawButtons.appendChild(this.offerDrawReject)
        this.offerDrawButtons.appendChild(this.offerDrawTimer)

        this.onClick()

        this.attemptsLeftToOfferADraw = 0
        this.offerDrawWaitDecision = false

        this.setupActionsElements()
    }

    setupActionsElements() {
        this.container.classList.add("actions")
        this.surrender.classList.add("surrender")
        this.newGame.classList.add("new-game")
        this.offerDraw.classList.add("offer-draw")
        this.offerDrawDecisions.classList.add("offer-draw-decisions")
        this.offerDrawDecisions.classList.add("hide")
        this.offerDrawHeader.classList.add("header")
        this.offerDrawQuestion.classList.add("question")
        this.offerDrawButtons.classList.add("buttons")
        this.offerDrawAccept.classList.add("accept")
        this.offerDrawAccept.innerHTML = "Accept"
        this.offerDrawReject.classList.add("reject")
        this.offerDrawTimer.classList.add("timer")

        this.surrender.innerHTML = "give up"
        this.newGame.innerHTML = "new game"
        this.offerDraw.innerHTML = "offer a draw"
        this.offerDrawHeader.innerHTML = "opponent offered a draw"
        this.offerDrawQuestion.innerHTML = "your decision?"
        this.offerDrawReject.innerHTML = "Reject"
    }

    hideActions() {
        this.container.classList.add("hide")
    }

    changeOfferDrawTimer(time) {
        if (time === 0) {
            this.offerDrawDecisions.classList.add("hide")
            this.offerDrawTimer.innerHTML = ""
        } else {
            this.offerDrawTimer.innerHTML = time
        }
    }

    showOfferDrawDecisions() {
        this.offerDrawTimer.innerHTML = ""
        this.offerDrawDecisions.classList.remove("hide")
    }

    sendRequest(post) {
        this.chess.connection.sendRequest({
            post: post,
            body: {}
        })
    }

    onClick() {
        const actions = this
        this.surrender.addEventListener("click", function () {
            if (confirm("are you sure you want to give up?")) {
                actions.sendRequest("surrender")
            }
        })
        this.newGame.addEventListener("click", function () {
            if (confirm("do you want to start new game?")) {
                actions.sendRequest("new")
            }
        })
        this.offerDraw.addEventListener("click", function () {
            actions.changeOfferDrawButtonToWaiting()
            actions.sendRequest("offer_a_draw")
        })
        this.offerDrawAccept.addEventListener("click", function () {
            actions.offerDrawDecisions.classList.add("hide")
            actions.sendRequest("draw_offer_accepted")
        })
        this.offerDrawReject.addEventListener("click", function () {
            actions.offerDrawDecisions.classList.add("hide")
            actions.sendRequest("draw_offer_rejected")
        })
    }

    showOver() {
        this.newGame.classList.remove("hide")
        this.surrender.classList.add("hide")
    }

    showPlay() {
        this.surrender.classList.remove("hide")
        this.newGame.classList.add("hide")
    }

    setAttemptsLeftToOfferADraw(left) {
        this.attemptsLeftToOfferADraw = left
    }

    changeAttemptsLeftToOfferADrawButton() {
        if (this.attemptsLeftToOfferADraw === 0) {
            this.offerDraw.disabled = true
        }
        if (!this.offerDrawWaitDecision) {
            this.offerDraw.disabled = false
            this.offerDraw.innerHTML = "offer a draw " + this.attemptsLeftToOfferADraw + " times left"
        }
    }

    changeOfferDrawButtonToWaiting() {
        this.offerDraw.disabled = true
        this.offerDraw.innerHTML = "waiting decision"
        this.offerDrawWaitDecision = true
    }
}
