import Sprite from "./Sprite.js";

export default class Tower extends Sprite {
  constructor(props = {}) {
    super(props);

    this.gemType = props.gemType ?? null;
    this.gemRank = props.gemRank ?? null;
    this.range = props.range ?? 0;
    this.damage = props.damage ?? 0;
    this.attackSpeed = props.attackSpeed ?? 0;
    this.ability = props.ability ?? null;
    this.new = props.new ?? false;
  }
}
