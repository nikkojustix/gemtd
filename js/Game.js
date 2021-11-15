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
    this.ctx.drawImage(this.background, 0, 0)
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

    this.stage.draw(this.ctx)
  }
}
