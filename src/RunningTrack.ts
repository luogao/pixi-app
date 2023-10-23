import { Container, Sprite } from 'pixi.js'
import icon_road from './images/icon_road.png'
import { Manager } from './scenes/Manager'

export default function (container: Container) {
  const runningTrack = Sprite.from(icon_road) // 加载跑道图片资源
  runningTrack.anchor.set(0, 1.35)
  runningTrack.position.y = Manager.height
  runningTrack.position.x = -100
  runningTrack.alpha = 0.8

  runningTrack.scale = {
    x: 0.6,
    y: 0.2,
  }

  container.addChild(runningTrack)

  const update = () => {
    // 每一帧向左偏移 5
    runningTrack.position.x -= 5
    if (runningTrack.position.x < -2100) {
      runningTrack.position.x = -100
    }
  }

  return { sprite: runningTrack, update }
}
