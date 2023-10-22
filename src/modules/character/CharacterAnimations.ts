import { AnimatedSprite, Assets } from 'pixi.js'

type CharacterAnimationsOptions = {
  animationConfig: string
  animationName: string
  initPosition: {
    x: number
    y: number
  }
  initVisible?: boolean
  speed: number
}

class CharacterAnimations {
  constructor(options: CharacterAnimationsOptions) {
    this.animation = this.init(options)
  }

  animation: AnimatedSprite

  private init = (options: CharacterAnimationsOptions) => {
    const { animationConfig, animationName, initPosition, initVisible, speed } =
      options
    if (Assets.cache.has(animationConfig)) {
      const animations = Assets.cache.get(animationConfig).data.animations
      const character = AnimatedSprite.fromFrames(animations[animationName])
      character.name = animationName
      character.position = initPosition
      character.visible = !!initVisible
      character.animationSpeed = speed
      character.play()
      character.anchor.set(0.5, 1)
      character.scale.set(1.2)

      return character
    } else {
      throw new Error('没找到动画对应的配置文件')
    }
  }
}

export default CharacterAnimations
