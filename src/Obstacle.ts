import { Container, Sprite } from 'pixi.js'
import icon_obstacle from './images/icon_obstacle.png'

export default function (container: Container) {
  const obstacle = Sprite.from(icon_obstacle)
  obstacle.width = 50
  obstacle.height = 50
  obstacle.anchor.set(0.5)

  obstacle.position.y = 600

  obstacle.position.x = container.width

  obstacle.scale = {
    x: 0.18,
    y: 0.18,
  }

  container.addChild(obstacle)

  return obstacle
}
