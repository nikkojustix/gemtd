export function loadImage(src) {
  return new Promise((res, rej) => {
    const image = new Image()
    image.src = src
    image.onload = () => res(image)
    image.onerror = () => rej(e)
  })
}

export function loadJSON(src) {
  return fetch(src).then((x) => x.json())
}

export default {
  loadImage,
  loadJSON,
}
