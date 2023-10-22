import { Container, Sprite, Text, TextStyle } from 'pixi.js'
import { IScene, Manager } from './Manager'
import projectState from '../pixi sun and moon.theatre-project-state.json'
import { getProject, types } from '@theatre/core'
import tree from '../images/tree.png'
import sun_icon from '../images/sun.png'
import moon_icon from '../images/moon.png'
import cloud_icon1 from '../images/cloud1.png'
import cloud_icon2 from '../images/cloud2.png'
import dayjs from 'dayjs'
import RunningTrack from '../RunningTrack'
import checkCollision from '../utils/checkCollision'
import Obstacle from '../Obstacle'
import Sheep from '../Sheep'
import { Group } from 'tweedle.js'
import Character from '../modules/character/Character'
import GameControl from '../modules/gameControl/GameControl'
import { GameState } from '../types'

const speed = 15
let fucked = 0
let oldState = false
let distance = 0
let sheepSpeed = 8
let oldSheepHitState = false
let sheepHitCount = 0

export default class GameScene extends Container implements IScene {
  // private theatreProject = getProject('pixi sun and moon')
  private theatreProject = getProject('pixi sun and moon', {
    state: projectState,
  })
  private theatreSheet = this.theatreProject.sheet('Animated scene')

  private textStyle = new TextStyle({
    fontFamily: 'Zen Dots',
    fontSize: 24,
    fontWeight: 'bold',
    fill: ['#F56EB3', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#7F167F',
    dropShadowBlur: 8,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 10,
    wordWrap: true,
    wordWrapWidth: Manager.width,
    lineJoin: 'round',
  })
  private richText: Text = new Text('', this.textStyle)
  private sheepText: Text = new Text(`🐑 ${sheepHitCount} 次`, this.textStyle)
  private distanceText = new Text(`You run ${distance}km`, this.textStyle)
  private fuckText = new Text(
    `You have been fucked ${fucked}  `,
    this.textStyle
  )

  private track: ReturnType<typeof RunningTrack>
  private obstacle: ReturnType<typeof Obstacle>
  private sheep: ReturnType<typeof Sheep>
  private character: Character
  private gameControl: GameControl

  constructor() {
    super()
    this.gameControl = new GameControl()

    this.eventMode = 'dynamic'

    this.theatreProject.ready.then(() => {
      this.theatreSheet.sequence.play({
        iterationCount: Infinity,
        direction: 'alternate',
      })
    })
    this.track = RunningTrack(this)
    // this.runningMan = RunningMan(this)
    this.obstacle = Obstacle(this)
    this.sheep = Sheep(this)
    this.character = new Character({ gameControl: this.gameControl })
    this.gameControl.on('onGameStateChange', this.handleGameStateChange)
    this.init()
  }

  handleGameStateChange = ({ gameState }: { gameState: GameState }) => {
    switch (gameState) {
      case GameState.paused:
        break
      case GameState.running:
        break
      case GameState.end:
        break
    }
  }

  private sheepMoving() {
    const isHit = checkCollision(this.sheep, this.character)
    if (oldSheepHitState !== isHit) {
      if (isHit) {
        sheepHitCount++
        this.sheepText.text = ` 🐑 ${sheepHitCount} 次`
      }
      oldSheepHitState = isHit
    }

    if (!isHit) {
      this.sheep.position.x -= sheepSpeed
    }

    if (this.sheep.position.x < 0 && Math.random() < Math.random() * 0.8) {
      this.sheep.position.x = Manager.width + 2000
    }
  }

  private moving() {
    const isHit = checkCollision(this.obstacle, this.character)
    if (oldState !== isHit) {
      if (isHit) {
        fucked++
        this.fuckText.text = `You have been fucked ${fucked}`
      }
      oldState = isHit
    }

    if (!isHit) {
      this.obstacle.position.x -= speed
      distance += 0.16
      this.distanceText.text = `You run ${distance.toFixed(2)} km`
    }

    if (this.obstacle.position.x < 0) {
      this.obstacle.position.x = Manager.width
    }
  }

  private init() {
    const myTree = Sprite.from(tree)
    myTree.scale = { x: 0.13, y: 0.13 }
    myTree.anchor.set(0.5)
    myTree.x = Manager.width * 0.5
    myTree.y = Manager.height * 0.5
    this.addChild(myTree)

    const sun = Sprite.from(sun_icon)
    sun.anchor.set(0.5)
    sun.position = { x: 80, y: 109 }
    sun.scale = { x: 0.1, y: 0.1 }

    const moon = Sprite.from(moon_icon)
    moon.anchor.set(0.5)
    moon.position = { x: 80, y: 109 }
    moon.scale = { x: 0.1, y: 0.1 }

    const cloud1 = Sprite.from(cloud_icon1)
    const cloud2 = Sprite.from(cloud_icon2)
    cloud1.anchor.set(0.5)
    cloud2.anchor.set(0.5)

    cloud1.scale = {
      x: 0.3,
      y: 0.3,
    }
    cloud1.position = {
      x: 180,
      y: 150,
    }
    cloud2.scale = {
      x: 0.3,
      y: 0.3,
    }
    cloud2.position = {
      x: Manager.width - 150,
      y: 350,
    }

    this.richText.anchor.set(1, 0)
    this.richText.position.x = Manager.width
    this.richText.position.y = 10

    this.fuckText.anchor.set(1, 1)
    this.fuckText.position.x = Manager.width
    this.fuckText.position.y = Manager.height

    this.distanceText.anchor.set(1, 1)
    this.distanceText.position.x = this.distanceText.width + 150
    this.distanceText.position.y = Manager.height

    this.sheepText.anchor.set(0.5, 0.5)
    this.sheepText.scale = { x: 1.8, y: 1.8 }
    this.sheepText.position = {
      x: Manager.width / 2,
      y: Manager.height - this.sheepText.height / 2,
    }

    this.addChild(this.richText)
    this.addChild(this.sheepText)
    this.addChild(this.fuckText)
    this.addChild(this.distanceText)
    this.addChild(cloud1)
    this.addChild(cloud2)
    this.addChild(sun)
    this.addChild(moon)
    this.addChild(this.character)
    this.sortChildren()

    const sheet = this.theatreProject.sheet('Animated scene')
    const SunAndMoonObj = sheet.object('Sun and Moon', {
      sunObj: types.compound({
        y: types.number(sun.position.y),
        alpha: types.number(sun.alpha),
        scaleX: types.number(sun.scale.x),
        scaleY: types.number(sun.scale.y),
      }),
      moonObj: types.compound({
        y: types.number(moon.position.y),
        alpha: types.number(moon.alpha),
        scaleX: types.number(moon.scale.x),
        scaleY: types.number(moon.scale.y),
      }),
      cloud1Move: types.compound({
        x: types.number(cloud1.position.x),
      }),
      cloud2Move: types.compound({
        x: types.number(cloud2.position.x),
      }),
    })

    SunAndMoonObj.onValuesChange((values) => {
      const { sunObj, moonObj, cloud1Move, cloud2Move } = values
      sun.alpha = sunObj.alpha
      sun.position.y = sunObj.y
      sun.scale = {
        x: sunObj.scaleX,
        y: sunObj.scaleY,
      }
      moon.alpha = moonObj.alpha
      moon.position.y = moonObj.y
      moon.scale = {
        x: moonObj.scaleX,
        y: moonObj.scaleY,
      }

      cloud1.position.x = cloud1Move.x
      cloud2.position.x = cloud2Move.x
    })
  }

  update(framesPassed: number): void {
    Group.shared.update()

    if (this.gameControl.getState() === GameState.running) {
      this.sheepMoving()
      this.moving()
      this.track.update()
      this.character.update()
    }

    this.richText.text = dayjs().format('@ YYYY-MM-DD, HH:mm:ss ')
  }
}
