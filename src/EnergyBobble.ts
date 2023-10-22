import { Sprite, Ticker } from 'pixi.js'
import { Tween, Easing, Group } from 'tweedle.js'
import getRandomByRange from './utils/getRandomByRange'

enum EnergyBobbleStatus {
  unavailable,
  canReceive,
  received,
  receiving,
}

enum Direction {
  UP,
  DOWN,
}

export default class EnergyBobble {
  bobble: Sprite

  private direction = Direction.UP

  private status: EnergyBobbleStatus = EnergyBobbleStatus.canReceive

  private receiveAnimation = {
    x: 0,
    y: 0,
    scale: { x: 0, y: 0 },
    opacity: 1,
  }
  private moveAnimation: { x: number; y: number }

  private tween: Tween<typeof this.receiveAnimation | typeof this.moveAnimation>

  private onReceived: () => void

  constructor(options: {
    source: string
    initPosition: { x: number; y: number }
    initScale: {
      x: number
      y: number
    }
    receivedPosition: { x: number; y: number }
    onReceived: () => void
  }) {
    this.onReceived = options.onReceived
    this.bobble = Sprite.from(options.source)
    this.bobble.interactive = true
    this.bobble.anchor.set(0.5)
    this.bobble.x = options.initPosition.x
    this.bobble.y = options.initPosition.y
    this.bobble.scale = options.initScale

    this.bobble.on(
      'pointertap',
      () => this.handleTap(options.receivedPosition),
      this
    )

    this.receiveAnimation = {
      x: options.initPosition.x,
      y: options.initPosition.y,
      scale: options.initScale,
      opacity: 1,
    }

    this.moveAnimation = {
      x: options.initPosition.x,
      y: options.initPosition.y,
    }

    setInterval(() => {
      this.direction === Direction.UP
        ? (this.direction = Direction.DOWN)
        : (this.direction = Direction.UP)
    }, 2300)

    this.tween = new Tween(this.moveAnimation)
      .to(
        {
          x: this.moveAnimation.x,
          y: this.moveAnimation.y + getRandomByRange([5, 10]),
        },
        1000
      )
      .repeat(Infinity)
      .yoyo(true)
      .onUpdate(() => {
        this.bobble.x = this.moveAnimation.x
        this.bobble.y = this.moveAnimation.y
      })
      .start()

    Ticker.shared.add(this.update)
  }

  setStatus = (status: EnergyBobbleStatus) => {
    this.status = status
  }

  update = () => {
    Group.shared.update()
  }

  handleTap = (endPosition: { x: number; y: number }) => {
    console.log('this.bobble pointertap')
    this.setStatus(EnergyBobbleStatus.receiving)
    this.receiveAnimation.x = this.bobble.x
    this.receiveAnimation.y = this.bobble.y
    this.tween = new Tween(this.receiveAnimation)
      .to(
        {
          ...endPosition,
          scale: { x: 0, y: 0 },
          opacity: 0,
        },
        1300
      )
      .onUpdate(() => {
        this.bobble.x = this.receiveAnimation.x
        this.bobble.y = this.receiveAnimation.y
        this.bobble.alpha = this.receiveAnimation.opacity
        this.bobble.scale = this.receiveAnimation.scale
      })
      .easing(Easing.Cubic.InOut)
      .onComplete(() => {
        console.log(' animation complete')
        this.setStatus(EnergyBobbleStatus.received)
        this.onReceived()
      })
      .start()
  }
}
