import { Container, Sprite, Ticker } from 'pixi.js'
import { Group, Tween } from 'tweedle.js'
import icon_mouse_tracker from './images/icon_mouse_tracker.png'

export default function (container: Container) {
  const myTracker = Sprite.from(icon_mouse_tracker)
  myTracker.anchor.set(0.5)
  container.addChild(myTracker)

  const animatedObj = { alpha: 1 }

  container.on('pointerleave', () => {
    new Tween(animatedObj)
      .to({ alpha: 0 }, 300)
      .onUpdate(() => {
        myTracker.alpha = animatedObj.alpha
      })
      .start()
  })

  Ticker.shared.add(() => {
    Group.shared.update()
  })

  container.on('pointerenter', () => {
    myTracker.alpha = 1
  })

  container.addListener('pointermove', (e) => {
    myTracker.position.copyFrom(e.global)
  })

  return myTracker
}
