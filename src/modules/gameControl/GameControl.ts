import { Container, Graphics, Sprite, Text } from 'pixi.js'
import { GameState } from '../../types'
import { Manager } from '../../scenes/Manager'
import EventEmitter from 'eventemitter3'

class GameControl extends EventEmitter {
  constructor() {
    super()
    this.init()
  }
  static DefaultHP = 10
  static ON_HIT_HEART = 1
  static ON_HIT_HP = 1
  private HP = GameControl.DefaultHP

  private gameState: GameState = GameState.Init
  private startView: Container = new Container()
  private gameOverContainer = new Container()

  private init = () => {
    Manager.addContainer(this.createControllerView())
    Manager.addContainer(this.renderGameOver())
  }

  updateHP = (actionCall: (HP: number) => number) => {
    this.HP = actionCall(this.HP)
    this.emitStateChange()
    if (this.HP <= 0) {
      this.GG()
    }
  }

  createMask = () => {
    const mask = new Graphics()
    mask.width = Manager.width
    mask.height = Manager.height
    mask.beginFill('#000000', 0.6)
    mask.drawRect(0, 0, Manager.width, Manager.height)
    mask.zIndex = 9998
    mask.endFill()
    return mask
  }

  createStartButton = () => {
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
    return startButtonSprite
  }

  renderStartView = () => {
    const mask = this.createMask()
    const startButtonSprite = this.createStartButton()

    this.startView.name = 'StartButton'
    this.startView.zIndex = 99999
    this.startView.addChild(mask)
    this.startView.addChild(startButtonSprite)
    this.startView.sortChildren()
  }

  renderGameOver = () => {
    this.gameOverContainer.visible = false
    this.gameOverContainer.zIndex = 999
    const mask = this.createMask()

    const text = new Text('GAME OVER', {
      fontFamily: '',
      fontWeight: '700',
      fill: '#99B080',
      fontSize: 100,
    })
    text.anchor.set(0.5)
    text.zIndex = 9999
    text.position = {
      x: Manager.width * 0.5,
      y: Manager.height * 0.5 - 50,
    }

    const startButtonSprite = this.createStartButton()
    startButtonSprite.scale.set(0.7)
    startButtonSprite.position.y = startButtonSprite.position.y + 100
    this.gameOverContainer.addChild(mask)
    this.gameOverContainer.addChild(text)
    this.gameOverContainer.addChild(startButtonSprite)
    this.gameOverContainer.sortChildren()

    return this.gameOverContainer
  }

  createControllerView = () => {
    this.renderStartView()

    return this.startView
  }

  getState = () => this.gameState

  private emitStateChange = () => {
    this.emit('onGameStateChange', { gameState: this.gameState, HP: this.HP })
  }

  private changeState = (state: GameState) => {
    this.gameState = state
    this.emitStateChange()
  }

  start = () => {
    this.updateHP(() => {
      return GameControl.DefaultHP
    })
    this.changeState(GameState.running)
    this.startView.visible = false
    this.gameOverContainer.visible = false
  }

  pause = () => {
    this.changeState(GameState.paused)
  }

  GG = () => {
    this.changeState(GameState.end)
    this.gameOverContainer.visible = true
  }
}

export default GameControl
