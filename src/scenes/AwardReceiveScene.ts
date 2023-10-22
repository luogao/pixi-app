import { Container, Sprite, Text, TextStyle } from 'pixi.js'
import { IScene, Manager } from './Manager'
import { getProject, types } from '@theatre/core'
import sun_icon from '../images/sun.png'
import moon_icon from '../images/moon.png'
import cloud_icon1 from '../images/cloud1.png'
import cloud_icon2 from '../images/cloud2.png'
import dayjs from 'dayjs'
import studio from '@theatre/studio'
import button from '../images/awardReceiveScene/按钮@3x.png'
import backLight1 from '../images/awardReceiveScene/背光1@3x.png'
import backLight2 from '../images/awardReceiveScene/背光2.png'
import rotatingLight from '../images/awardReceiveScene/旋转光.png'
import tipBg from '../images/awardReceiveScene/提示@3x.png'
import openLabel from '../images/awardReceiveScene/开.png'
import cardBG from '../images/awardReceiveScene/卡片@3x.png'
import redEnvelopeMask from '../images/awardReceiveScene/红包蒙蔽@3x.png'
import redEnvelope from '../images/awardReceiveScene/红包.png'
import successIcon from '../images/awardReceiveScene/成功图标@3x.png'
import titleLine from '../images/awardReceiveScene/标题风格线@3x.png'

const speed = 15
let fucked = 0
let oldState = false
let distance = 0
let sheepSpeed = 8
let oldSheepHitState = false
let sheepHitCount = 0

studio.initialize()

export default class AwardReceiveScene extends Container implements IScene {
  private theatreProject = getProject('红包领取动画')
  // private theatreProject = getProject('红包领取动画', {
  //   state: projectState,
  // })
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

  private childCount = 0

  private childMap = new Map()

  constructor() {
    super()
    this.interactive = true

    this.init()
    this.theatreProject.ready.then(() => {
      this.theatreSheet.sequence.play({
        direction: 'alternate',
      })
    })
    // this.mouseTracker = MouseTracker(this)
    // this.runningMan = RunningMan(this)
  }

  private init() {
    this.addSprite({
      name: 'rotatingLight',
      source: rotatingLight,
      width: 50,
      height: 50,
    })

    this.addSprite({ name: 'backLight2', source: backLight2 })

    this.addSprite({ name: 'backLight1', source: backLight1 })

    this.addSprite({ name: 'button', source: button })

    this.addSprite({ name: 'tipBg', source: tipBg })

    this.addSprite({ name: 'openLabel', source: openLabel })

    this.addSprite({ name: 'cardBG', source: cardBG })

    this.addSprite({ name: 'redEnvelopeMask', source: redEnvelopeMask })

    this.addSprite({ name: 'redEnvelope', source: redEnvelope })

    this.addSprite({ name: 'successIcon', source: successIcon })

    this.addSprite({ name: 'titleLine', source: titleLine })

    this.richText.anchor.set(1, 0)
    this.richText.position.x = Manager.width
    this.richText.position.y = 10

    this.addChild(this.richText)
  }

  addSprite = ({
    source,
    name,
  }: {
    name: string
    source: string
    width?: number
    height?: number
  }) => {
    const newSprite = Sprite.from(source)
    newSprite.scale = { x: 0.2, y: 0.2 }
    // newSprite.width = width || 50
    // newSprite.width = height || 50
    newSprite.anchor.set(0.5)

    newSprite.x = 100 + 90 * this.childMap.size
    newSprite.y = 100
    this.childMap.set(name, newSprite)
    this.addChild(newSprite)

    const theatreSheetObj = this.theatreSheet.object(name, {
      [name]: types.compound({
        y: types.number(newSprite.position.y),
        x: types.number(newSprite.position.x),
        alpha: types.number(newSprite.alpha, { range: [0, 1] }),
        scale: types.number(newSprite.scale.x, { nudgeMultiplier: 0.05 }),
        rotation: types.number(newSprite.rotation),
      }),
    })

    theatreSheetObj.onValuesChange((values) => {
      const sheetObjAnimationValue = values[name]

      newSprite.rotation = sheetObjAnimationValue.rotation
      newSprite.alpha = sheetObjAnimationValue.alpha
      newSprite.position = {
        x: sheetObjAnimationValue.x,
        y: sheetObjAnimationValue.y,
      }
      newSprite.scale = {
        x: sheetObjAnimationValue.scale,
        y: sheetObjAnimationValue.scale,
      }
    })
  }

  update(framesPassed: number): void {
    this.richText.text = dayjs().format('@ YYYY-MM-DD, HH:mm:ss ')
  }
}
