import Sprite from "./Sprite.js"

export default class Tower extends Sprite {
  constructor(props = {}) {
    super(props)

    this.type = props.type ?? null
    this.rank = props.rank ?? null
    this.range = props.range ?? 0
    this.damage = props.damage ?? 0
    this.attackSpeed = (170 / props.attackSpeed) * 1000 ?? 0
    this.ability = props.ability ?? null
    this.new = props.new ?? false
    this.combination = props.combination ?? null
    this.timer = 0
    this.fire = false
  }

  update(delta) {
    this.timer += delta
    if (!this.new) {
      if (this.timer >= this.attackSpeed) {
        this.fire = true
        this.timer = 0
      } else {
        this.fire = false
      }
    }
  }

  attack() { }

  inRadius() { }

  draw(ctx) {
    super.draw(ctx)
  }

  get fireStatus() {
    return this.fire
  }
}
