import { AnimatedSprite, Assets } from 'pixi.js'

type CharacterAnimationsOptions = {
  animationConfig: string
  animationName: string
  initPosition: {
    x: number
    y: number
  }
  initVisible?: boolean
  loop: boolean
  speed: number
  onAnimationEnd: (name: string) => void
  onFrameChange: (data: { name: string; currentFrame: number }) => void
}

class CharacterAnimations {
  constructor(options: CharacterAnimationsOptions) {
    this.animation = this.init(options)
  }

  animation: AnimatedSprite

  private init = (options: CharacterAnimationsOptions) => {
    const {
      animationConfig,
      animationName,
      initPosition,
      initVisible,
      speed,
      onAnimationEnd,
      onFrameChange,
      loop,
    } = options
    if (Assets.cache.has(animationConfig)) {
      const animations = Assets.cache.get(animationConfig).data.animations
      const character = AnimatedSprite.fromFrames(animations[animationName])
      character.name = animationName
      character.position = initPosition
      character.visible = !!initVisible
      character.animationSpeed = speed
      initVisible && character.play()
      character.anchor.set(0.5, 1)
      character.scale.set(1.2)
      character.loop = loop
      character.onComplete = () => onAnimationEnd(animationName)
      character.onFrameChange = (currentFrame: number) =>
        onFrameChange({ name: animationName, currentFrame })

      return character
    } else {
      throw new Error('没找到动画对应的配置文件')
    }
  }
}

export default CharacterAnimations
