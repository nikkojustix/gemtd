import Sprite from "./Sprite.js";

export default class Tower extends Sprite {
  constructor(props = {}) {
    super(props);

    this.type = props.type ?? null;
    this.rank = props.rank ?? null;
    this.range = props.range ?? 0;
    this.damage = props.damage ?? 0;
    this.attackSpeed = (170 / props.attackSpeed) * 1000 ?? 0;
    this.ability = props.ability ?? null;
    this.new = props.new ?? false;
    this.combination = props.combination ?? null;
  }

  update() {}

  draw(ctx) {
    super.draw(ctx);
  }
}
