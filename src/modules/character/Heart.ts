import { GameObjectOptions } from '../../types'
import Obstacle from './GameObject'
import { Manager } from '../../scenes/Manager'

class Heart extends Obstacle {
  constructor(options: GameObjectOptions) {
    super(options)
    this.speed = 12
  }

  move = () => {
    this.sprite.position.x -= this.speed

    if (this.sprite.position.x < 0 && Math.random() < Math.random() * 0.8) {
      this.sprite.position.x = Manager.width + 7000 * Math.random()
      this.sprite.visible = true
    }
  }
}

export default Heart
