import { Container } from 'pixi.js'
import CharacterAnimations from './CharacterAnimations'
import { IScene } from '../../scenes/Manager'

type CharacterOptions = {
  movements: { jsonConfig: string; name: string; initVisible: boolean }[]
}

class Character extends Container implements IScene {
  constructor(options: CharacterOptions) {
    super()
    this.init(options)
  }

  init = (options: CharacterOptions) => {
    const { movements } = options

    movements.forEach((movement, index) => {
      const characterAnimation = new CharacterAnimations({
        animationConfig: movement.jsonConfig,
        animationName: movement.name,
        initPosition: {
          x: 200,
          y: 650,
        },
        speed: 1 / 4.5,
        initVisible: movement.initVisible,
      })

      this.addChild(characterAnimation.animation)
    })
  }

  update = () => {}
}

export default Character
