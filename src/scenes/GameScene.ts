import { Container, Text } from 'pixi.js'
import { IScene, Manager } from './Manager'
import dayjs from 'dayjs'
import RunningTrack from '../RunningTrack'
import { Group, Tween } from 'tweedle.js'
import Character from '../modules/character/Character'
import GameControl from '../modules/gameControl/GameControl'
import { GameState } from '../types'
import { commonTextStyle } from '../constants'
import HPBar from '../modules/gameControl/HPBar'
import icon_sheep from '../images/icon_sheep.png'
import icon_obstacle from '../images/icon_obstacle.png'
import GameObject from '../modules/character/GameObject'
import Heart from '../modules/character/Heart'

let distance = 0

export default class GameScene extends Container implements IScene {
  private textStyle = commonTextStyle
  private timerText: Text = new Text('', this.textStyle)
  private distanceText = new Text(`You run ${distance}km`, this.textStyle)

  private track: ReturnType<typeof RunningTrack>
  private obstacle: GameObject
  private sheep: GameObject
  private character: Character
  private heart: Heart
  private gameControl: GameControl
  private HPBar: HPBar
  private onHitTip = new Text('', {
    fontSize: 20,
    fontWeight: 'bold',
    fill: '#eee',
  })

  constructor() {
    super()
    this.gameControl = new GameControl()
    this.HPBar = new HPBar()
    this.track = RunningTrack(this)
    this.character = new Character({ gameControl: this.gameControl })
    this.obstacle = new GameObject({
      source: icon_obstacle,
      checkCollisionTarget: this.character,
      initPosition: {
        x: Manager.width * 2 * Math.random() + Manager.width + 100,
        y: 600,
      },
      initScale: {
        x: 0.18,
        y: 0.18,
      },
    })
    this.sheep = new GameObject({
      source: icon_sheep,
      checkCollisionTarget: this.character,
      initPosition: {
        x: Manager.width * 2 * Math.random() + Manager.width + 100,
        y: 600,
      },
      initScale: {
        x: 0.18,
        y: 0.18,
      },
    })
    this.heart = new Heart({
      source: '/assets/icon_heart.png',
      checkCollisionTarget: this.character,
      initPosition: {
        x: Manager.width * 2 * Math.random() + Manager.width + 10000,
        y: 300,
      },
      initScale: {
        x: 1,
        y: 1,
      },
    })

    this.heart.on('onHit', this.onHeartHit)
    this.obstacle.on('onHit', this.onHit)
    this.sheep.on('onHit', this.onHit)

    this.gameControl.on('onGameStateChange', this.handleGameStateChange)

    this.init()
  }

  private init() {
    this.timerText.anchor.set(1, 0)
    this.timerText.position.x = Manager.width - 10
    this.timerText.position.y = 10

    this.distanceText.anchor.set(0, 1)
    this.distanceText.position.x = 16
    this.distanceText.position.y = this.distanceText.height + 10
    this.onHitTip.visible = false
    this.onHitTip.zIndex = 99
    this.onHitTip.anchor.set(0.5, 0.5)

    this.addChild(this.onHitTip)
    this.addChild(this.sheep.sprite)
    this.addChild(this.obstacle.sprite)
    this.addChild(this.heart.sprite)
    this.addChild(this.timerText)
    this.addChild(this.distanceText)
    this.addChild(this.HPBar)
    this.addChild(this.character) // 添加角色到画布上
    this.sortChildren() // 给 Sprite 排序
  }

  handleHP = (HP: number) => {
    this.HPBar.updateBarWidthByPercent(HP / GameControl.DefaultHP)
  }

  handleGameStateChange = ({
    gameState,
    HP,
  }: {
    gameState: GameState
    HP: number
  }) => {
    switch (gameState) {
      case GameState.paused:
        break
      case GameState.running:
        break
      case GameState.end:
        break
    }

    this.handleHP(HP)
  }

  private onHit = () => {
    this.gameControl.updateHP((oldHP: number) => {
      return oldHP - GameControl.ON_HIT_HP
    })
    this.showHitTip(`-${GameControl.ON_HIT_HP}HP`)
  }

  showHitTip = (tip: string, color?: string) => {
    this.onHitTip.visible = true
    this.onHitTip.text = tip
    this.onHitTip.position = this.character.position
    this.onHitTip.style.fill = color ? color : '#eee'

    new Tween(this.onHitTip.position)
      .to({
        x: this.onHitTip.position.x + 80,
        y: this.onHitTip.position.y - 180,
      })
      .duration(620)
      .start()
      .onComplete(() => {
        this.onHitTip.visible = false
      })
  }

  private onHeartHit = () => {
    this.gameControl.updateHP((oldHP: number) => {
      return oldHP + GameControl.ON_HIT_HEART
    })
    this.heart.sprite.visible = false
    this.showHitTip(`+${GameControl.ON_HIT_HEART}HP`, '#ff0eea')
  }

  update(framesPassed: number): void {
    Group.shared.update()

    if (this.gameControl.getState() === GameState.running) {
      this.sheep.update(framesPassed)
      this.obstacle.update(framesPassed)
      this.heart.update(framesPassed)
      this.track.update()
      this.character.update()
      distance += 0.16
      this.distanceText.text = `You run ${distance.toFixed(2)} km`
    }

    this.timerText.text = dayjs().format('@ YYYY-MM-DD HH:mm:ss ')
  }
}
