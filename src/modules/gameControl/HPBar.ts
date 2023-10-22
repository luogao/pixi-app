import { Container, Graphics, Text } from 'pixi.js'
import { commonTextStyle } from '../../constants'
import { Tween } from 'tweedle.js'

class HPBar extends Container {
  constructor() {
    super()
    this.x = 16
    this.y = 50
    this.bar = this.createBar('#f0f')
    this.barTrack = this.createBar('#fff')
    this.init()
  }

  text: Text = new Text('HP: ', commonTextStyle)
  bar: Graphics
  barTrack: Graphics
  barDefaultWidth = 120
  barDefaultHeight = 26

  createBar = (bgColor: string) => {
    const bar = new Graphics()
    bar.beginFill(bgColor, 1)
    bar.drawRect(0, 0, this.barDefaultWidth, this.barDefaultHeight)
    bar.endFill()
    bar.position.x = this.text.width + 8
    return bar
  }

  init = () => {
    this.text.anchor.set(0)
    this.addChild(this.text)
    this.addChild(this.barTrack)
    this.addChild(this.bar)
  }

  updateBarWidthByPercent = (percent: number) => {
    new Tween(this.bar.scale)
      .to({
        x: percent,
        y: 1,
      })
      .duration(100)
      .start()
  }
}

export default HPBar
