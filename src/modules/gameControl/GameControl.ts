import { Container, Graphics, Sprite } from 'pixi.js'
import { GameState } from '../../types'
import { Manager } from '../../scenes/Manager'

class GameControl {
  constructor() {
    this.init()
  }

  private gameState: GameState = GameState.Init
  private startButton: Container = new Container()
  private init = () => {
    Manager.addContainer(this.createControllerView().startButton)
  }

  createControllerView = () => {
    const mask = new Graphics()
    mask.width = Manager.width
    mask.height = Manager.height
    mask.beginFill('#000000', 0.6)
    mask.drawRect(0, 0, Manager.width, Manager.height)
    mask.zIndex = 9998
    mask.endFill()

    const startButtonSprite = Sprite.from('/assets/start_button.png')
    startButtonSprite.scale.set(1)
    startButtonSprite.anchor.set(0.5)
    startButtonSprite.zIndex = 9999
    startButtonSprite.position = {
      x: Manager.width * 0.5,
      y: Manager.height * 0.5,
    }

    startButtonSprite.cursor = 'pointer'
    startButtonSprite.eventMode = 'static'

    startButtonSprite.on('click', () => {
      this.start()
    })

    this.startButton.name = 'StartButton'
    this.startButton.zIndex = 99999
    this.startButton.addChild(mask)
    this.startButton.addChild(startButtonSprite)
    this.startButton.sortChildren()

    return {
      startButton: this.startButton,
    }
  }

  getState = () => this.gameState

  start = () => {
    this.gameState = GameState.running
    this.startButton.destroy()
  }

  pause = () => {
    this.gameState = GameState.paused
  }

  GG = () => {
    this.gameState = GameState.end
  }
}

export default GameControl
