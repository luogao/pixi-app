import { AnimatedSprite, Container } from 'pixi.js'
import CharacterAnimations from './CharacterAnimations'
import { IScene, Manager } from '../../scenes/Manager'
import GameControl from '../gameControl/GameControl'
import { GameState } from '../../types'

import createInterpolation, {
  ExtrapolateType,
} from '../../utils/createInterpolation'

type CharacterMovements = {
  jsonConfig: string
  name: string
  speed?: number
  loop: boolean
}[]

const characterMovements: CharacterMovements = [
  {
    jsonConfig: 'playerJumpJson',
    name: 'player_jump',
    loop: false,
    speed: 1 / 5,
  },
  {
    jsonConfig: 'playerRunJson',
    name: 'player_run',
    loop: true,
  },
  {
    jsonConfig: 'playerStandJson',
    name: 'player_stand',
    loop: true,
  },
  {
    jsonConfig: 'playerGGJson',
    name: 'player_gg',
    loop: false,
  },
]

const initY = 450

const characterInterpolation = createInterpolation({
  inputRange: [0, 1, 6, 12],
  outputRange: [initY, initY, 320, initY],
  extrapolate: ExtrapolateType.clamp,
})

class Character extends Container implements IScene {
  constructor({ gameControl }: { gameControl: GameControl }) {
    super()
    this.gameControl = gameControl
    this.gameControl.on('onGameStateChange', this.handleGameStateChange)
    this.position.x = 120
    this.position.y = initY
    this.init()
  }

  gameControl: GameControl

  currentMovement = 'player_stand'

  private handleMovementEnd = (name: string) => {
    if (name === 'player_jump') {
      this.changeMovement('player_run')
    }
  }

  handleGameStateChange = ({ gameState }: { gameState: GameState }) => {
    if (gameState === GameState.running && this.currentMovement !== 'player_jump') {
      this.run()
    }

    if (gameState === GameState.end) {
      this.gg()
    }
  }

  run = () => {
    this.changeMovement('player_run')
  }

  jump = () => {
    this.changeMovement('player_jump')
  }

  gg = () => {
    this.changeMovement('player_gg')
  }

  onKeyDown = (e: any) => {
    if (this.gameControl.getState() === GameState.running) {
      if (e.code === 'Space' && this.currentMovement !== 'player_jump') {
        this.jump()
      }
    }
  }

  handleMovementFrameChange = ({
    name,
    currentFrame,
  }: {
    name: string
    currentFrame: number
  }) => {
    if (name === 'player_jump') {
      const y = characterInterpolation(currentFrame) as number
      this.position.y = y
    }
  }

  init = () => {
    // 初始化角色的动作
    characterMovements.forEach((movement) => {
      const characterAnimation = new CharacterAnimations({
        animationConfig: movement.jsonConfig,
        animationName: movement.name,
        initPosition: {
          x: 0,
          y: 0,
        },
        speed: movement.speed || 1 / 4.5,
        initVisible: this.currentMovement === movement.name, // 如果是初始动作，则 visible 设置成 true
        onAnimationEnd: this.handleMovementEnd,
        loop: movement.loop,
        onFrameChange: this.handleMovementFrameChange,
      })

      this.addChild(characterAnimation.animation)
    })

    document.addEventListener('keydown', this.onKeyDown)
  }

  changeMovement = (movement: string) => {
    const nextMovement = this.getChildByName(movement) as AnimatedSprite
    const currentMovement = this.getChildByName(
      this.currentMovement
    ) as AnimatedSprite
    if (nextMovement) {
      // 当前动作
      currentMovement!.visible = false
      currentMovement.gotoAndStop(0)

      // 下一个动作
      nextMovement.visible = true
      nextMovement.gotoAndPlay(0)
      this.currentMovement = movement
    }
  }

  update = () => {}
}

export default Character
