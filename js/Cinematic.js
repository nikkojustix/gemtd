import Sprite from "./Sprite.js";
import { loadJSON } from "./Loader.js";

export default class Cinematic extends Sprite {
  constructor(props = {}) {
    super(props);

    this.cooldown = 0;
    this.timer = 0;
  }

  update(delta) {
    super.update(delta);
    // loadJSON("json/atlas.json").then((atlas) => {
    //   while (this.x != atlas.waypoints[2].x) {
    //     this.x += atlas.board.size;
    //   }
    // });

    this.timer += delta;

    if (this.timer >= this.cooldown) {
    }
  }

  draw(ctx) {
    super.draw(ctx);
  }
}
