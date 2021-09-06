import Sprite from "./Sprite.js";

export default class Enemy extends Sprite {
  constructor(props = {}) {
    super(props);

    this.hp = props.hp ?? 0;
    this.moveSpeed = props.moveSpeed ?? 0;
    this.armor = props.armor ?? 0;
    this.flying = props.flying ?? false;
  }

  draw(ctx) {
    super.draw(ctx);
  }
}
