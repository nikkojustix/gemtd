import Group from "./Group.js"

export default class Game {
  constructor(props = {}) {
    this.canvas = document.createElement("canvas")
    this.ctx = this.canvas.getContext("2d")
    this.stage = new Group()

    this.rows = props.rows
    this.cols = props.cols
    this.squareSize = props.squareSize
    this.canvas.width = this.rows * this.squareSize
    this.canvas.height = this.cols * this.squareSize
    this.background = props.background

    this.pTimestamp = 0

    requestAnimationFrame((x) => this.render(x))
  }

  update() { }

  hit() { }

  clearCanvas() {
    this.canvas.width = this.canvas.width
  }

  drawBackground() {
    this.ctx.beginPath()
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = this.background
    this.ctx.fill()
  }

  drawBoard() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.ctx.beginPath()
        this.ctx.rect(
          this.squareSize * i,
          this.squareSize * j,
          this.squareSize,
          this.squareSize
        )
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = "hsl(0, 0%, 40%, 1)"
        this.ctx.stroke()
        this.ctx.closePath()
      }
    }
  }

  render(timestamp) {
    requestAnimationFrame((x) => this.render(x))
    const delta = timestamp - this.pTimestamp
    this.pTimestamp = timestamp

    this.update(delta)
    this.hit()
    this.stage.update(delta)

    // this.stage.inRadius()
    // this.stage.attack()

    this.clearCanvas()
    this.drawBackground()
    this.drawBoard()

    this.stage.draw(this.ctx)
  }
}
