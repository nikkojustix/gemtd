import Sprite from "./Sprite.js"

export default class Enemy extends Sprite {
  constructor(props = {}) {
    super(props)

    this.hp = props.hp ?? 0
    this.moveSpeed = props.moveSpeed ?? 0
    this.armor = props.armor ?? 0
    this.flying = props.flying ?? false
    this.delay = props.delay ?? 0
    this.timer = 0
    this.next = false
  }

  update(delta) {
    super.update()
    this.timer += delta
    if (this.timer >= this.delay) {
      this.next = true
      this.visible = true
      this.timer = 0
    } else {
      this.next = false
    }
  }

  draw(ctx) {
    if (this.visible) {
      super.draw(ctx)
    }
  }
  get isNext() {
    return this.next
  }
}
