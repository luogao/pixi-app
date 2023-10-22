import { Container, Sprite } from 'pixi.js'
import icon_road from './images/icon_road.png'

export default function (container: Container) {
  const runningTrack = Sprite.from(icon_road)
  runningTrack.anchor.set(0, 0.5)
  runningTrack.position.y = 650

  runningTrack.position.x = -100
  runningTrack.alpha = 0.8

  runningTrack.scale = {
    x: 0.6,
    y: 0.2,
  }

  container.addChild(runningTrack)

  const update = () => {
    runningTrack.position.x -= 5
    if (runningTrack.position.x < -2100) {
      runningTrack.position.x = -100
    }
  }

  return { sprite: runningTrack, update }
}
