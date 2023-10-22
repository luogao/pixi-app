import EventEmitter from 'eventemitter3'
import { DisplayObject, Sprite } from 'pixi.js'
import checkCollision from '../../utils/checkCollision'
import { Manager } from '../../scenes/Manager'
import { GameObjectOptions } from '../../types'

class GameObject extends EventEmitter {
  constructor({
    source,
    checkCollisionTarget,
    initPosition,
    initScale,
  }: GameObjectOptions) {
    super()
    this.sprite = Sprite.from(source)
    this.sprite.anchor.set(0.5, 0.5)
    this.sprite.scale.set(initScale.x, initScale.y)
    this.sprite.position.set(initPosition.x, initPosition.y)
    this.checkCollisionTarget = checkCollisionTarget
  }

  hitState = false
  speed = 9
  sprite: Sprite
  checkCollisionTarget: DisplayObject

  private checkHit = () => {
    const isHit = checkCollision(this.sprite, this.checkCollisionTarget)
    if (this.hitState !== isHit) {
      if (isHit) {
        this.emit('onHit', this.sprite.position)
      }
      this.hitState = isHit
    }
  }

  move = () => {
    this.sprite.position.x -= this.speed

    if (this.sprite.position.x < 0 && Math.random() < Math.random() * 0.8) {
      this.sprite.position.x = Manager.width + 2000 * Math.random()
    }
  }

  update = (frame: number) => {
    this.checkHit()
    this.move()
  }
}

export default GameObject
