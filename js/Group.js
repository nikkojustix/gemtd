import DisplayObject from "./DisplayObject.js"

export default class Group extends DisplayObject {
  constructor(props = {}) {
    super(props)

    this.container = new Set()
  }

  get items() {
    return Array.from(this.container)
  }

  add(...dos) {
    for (const displayObject of dos) {
      this.container.add(displayObject)
    }
  }

  delete(...dos) {
    for (const displayObject of dos) {
      this.container.delete(displayObject)
    }
  }

  update(delta) {
    this.items.forEach(x => x.update(delta))
  }

  draw(ctx) {
    this.items.forEach(x => x.draw(ctx))
  }
}
