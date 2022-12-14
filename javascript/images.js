class Images {
    constructor() {
        this.white = {
            pawn: new Image(),
            rook: new Image(),
            knight: new Image(),
            bishop: new Image(),
            king: new Image(),
            queen: new Image(),
        }
        this.black = {
            pawn: new Image(),
            rook: new Image(),
            knight: new Image(),
            bishop: new Image(),
            king: new Image(),
            queen: new Image(),
        }
        this.white.pawn.src = 'images/white/pawn.png'
        this.white.rook.src = 'images/white/rook.png'
        this.white.knight.src = 'images/white/knight.png'
        this.white.bishop.src = 'images/white/bishop.png'
        this.white.king.src = 'images/white/king.png'
        this.white.queen.src = 'images/white/queen.png'

        this.black.pawn.src = 'images/black/pawn.png'
        this.black.rook.src = 'images/black/rook.png'
        this.black.knight.src = 'images/black/knight.png'
        this.black.bishop.src = 'images/black/bishop.png'
        this.black.king.src = 'images/black/king.png'
        this.black.queen.src = 'images/black/queen.png'

        this.allImagesLoaded = false
        const promisesImagesLoaded = []
        for (const image of Object.values(this.white)) {
            promisesImagesLoaded.push(new Promise(resolve => {
                image.onload = () => resolve()
                image.onerror = () => resolve()
            }))
        }
        for (const image of Object.values(this.black)) {
            promisesImagesLoaded.push(new Promise(resolve => {
                image.onload = () => resolve()
                image.onerror = () => resolve()
            }))
        }
        Promise.all(promisesImagesLoaded).then(() => {
            this.allImagesLoaded = true
        })
    }
}
