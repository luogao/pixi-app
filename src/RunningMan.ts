import { Container, ObservablePoint, Sprite } from 'pixi.js'
import { Tween } from 'tweedle.js'
import icon_running_man from './images/icon_running.png'

export default function (container: Container) {
  const running = Sprite.from(icon_running_man)

  const initPosition = {
    x: 200,
    y: 600,
  }

  running.width = 100
  running.height = 100
  running.anchor.set(0.5)
  running.position = initPosition
  let tween: Tween<ObservablePoint<any>> = new Tween(running.position).to(
    {
      x: running.position.x,
      y: [initPosition.y, initPosition.y - 300],
    },
    300
  )

  function onKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space') {
      // if ()
      tween.start()
    }
  }

  document.addEventListener('keydown', onKeyDown)

  container.addChild(running)

  const falling = () => {
    if (tween && !tween.isPlaying() && running.position.y <= initPosition.y) {
      running.position.y += 10
    }
  }

  return { sprite: running, falling }
}
