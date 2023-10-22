import { Container, Sprite } from 'pixi.js'
import icon_sheep from './images/icon_sheep.png'

export default function (container: Container) {
  const sheep = Sprite.from(icon_sheep)
  sheep.anchor.set(0.5)

  sheep.position.y = 600

  sheep.position.x = container.width + 2000

  sheep.scale = {
    x: 0.5,
    y: 0.5,
  }

  container.addChild(sheep)

  return sheep
}
