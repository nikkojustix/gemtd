import DisplayObject from "./DisplayObject.js";
import { loadImage } from "./Loader.js";

export default class Sprite extends DisplayObject {
  constructor(props = {}) {
    super(props);

    this.image = props.image ?? null;
    this.frame = props.frame ?? null;
    this.selected = props.selected ?? false;
    this.gemType = props.gemType ?? null;
    this.gemRank = props.gemRank ?? null;
    this.range = props.range ?? 0;
    this.damage = props.damage ?? 0;
    this.attackSpeed = props.attackSpeed ?? 0;
    this.ability = props.ability ?? null;
    this.new = props.new ?? false;
    this.speedX = props.speedX ?? 0;
    this.speedY = props.speedY ?? 0;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frame.x,
      this.frame.y,
      this.frame.width,
      this.frame.height,
      this.x,
      this.y,
      this.width,
      this.height
    );

    if (this.selected) {
      ctx.beginPath();
      ctx.arc(
        (2 * this.x + this.width) / 2,
        (2 * this.y + this.height) / 2,
        this.range,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }

    if (this.new) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = "green";
      ctx.stroke();
    }
  }

  set(obj) {
    this.frame.x = obj.x;
    this.frame.y = obj.y;

    this.range = obj.range * this.width ?? 0;
    this.damage = obj.damage ?? 0;
    this.attackSpeed = obj.attackSpeed ?? 0;
    this.ability = obj.ability ?? null;
    this.selected = obj.selected ?? false;
    this.new = obj.new ?? false;
  }
}
