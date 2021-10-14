import Sprite from "./Sprite.js"

export default class Cinematic extends Sprite {
  constructor(props = {}) {
    super(props)

    this.cooldown = props.cooldown ?? 0
    this.timer = 0
  }

  update(delta) {
    super.update()
    // loadJSON("json/atlas.json").then((atlas) => {
    //   while (this.x != atlas.waypoints[2].x) {
    //     this.x += atlas.board.size
    //   }
    // })

    this.timer += delta

    if (this.timer >= this.cooldown) {
      // console.log("fire")
      this.timer = 0
      this.x = 96
      this.y = 96
    }
  }

  draw(ctx) {
    super.draw(ctx)
  }
}
