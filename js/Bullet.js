import Sprite from "./Sprite.js"

export default class Bullet extends Sprite {
  constructor(props = {}) {
    super(props)

    this.tower = props.tower ?? null
    this.hit = props.hit ?? false
  }

  update() {
    super.update()
  }

  draw(ctx) {
    super.draw(ctx)
  }
}
