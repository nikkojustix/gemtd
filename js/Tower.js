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

  inRadius(ctx, enemy) {
    ctx.beginPath()
    ctx.arc(
      (2 * this.x + this.width) / 2,
      (2 * this.y + this.height) / 2,
      this.range,
      0,
      2 * Math.PI
    )

    if (
      ctx.isPointInPath(enemy.x, enemy.y) ||
      ctx.isPointInPath(enemy.x, enemy.y + enemy.height) ||
      ctx.isPointInPath(enemy.x + enemy.width, enemy.y) ||
      ctx.isPointInPath(
        enemy.x + enemy.width,
        enemy.y + enemy.height
      )
    ) {
      return true
    }
    else {
      return false
    }
  }

  draw(ctx) {
    super.draw(ctx)
  }

  get fireStatus() {
    return this.fire
  }
}
