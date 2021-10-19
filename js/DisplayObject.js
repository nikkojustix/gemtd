export default class DisplayObject {
  constructor(props = {}) {
    this.visible = props.visible ?? true

    this.x = props.x ?? 0
    this.y = props.y ?? 0

    this.width = props.width ?? 24
    this.height = props.height ?? 24

    this.fillStyle = props.fillStyle ?? null
  }

  update() { }

  draw(ctx) {
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.fillStyle = this.fillStyle
    ctx.fill()
  }
}
