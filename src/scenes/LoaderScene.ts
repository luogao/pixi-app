import { Assets, Container, Graphics } from 'pixi.js'
import manifest from '../manifest'
// import AwardReceiveScene from './AwardReceiveScene'
import GameScene from './GameScene'
import { IScene, Manager } from './Manager'

export class LoaderScene extends Container implements IScene {
  // for making our loader graphics...
  private loaderBar: Container
  private loaderBarBoder: Graphics
  private BG: Graphics
  private loaderBarFill: Graphics
  constructor() {
    super()

    // lets make a loader graphic:
    const loaderBarWidth = Manager.width * 0.8 // just an auxiliar variable
    this.BG = new Graphics()
    this.BG.beginFill(0xf0ee00, 1)
    this.BG.drawRect(0, 0, Manager.width, Manager.height)
    this.BG.endFill()

    // the fill of the bar.
    this.loaderBarFill = new Graphics()
    this.loaderBarFill.beginFill(0x008800, 1)
    this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 50)
    this.loaderBarFill.endFill()
    this.loaderBarFill.scale.x = 0 // we draw the filled bar and with scale we set the %

    // The border of the bar.
    this.loaderBarBoder = new Graphics()
    this.loaderBarBoder.lineStyle(10, 0x0, 1)
    this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 50)

    // Now we keep the border and the fill in a container so we can move them together.
    this.loaderBar = new Container()
    // this.loaderBar.addChild(this.BG)
    this.loaderBar.addChild(this.loaderBarFill)
    this.loaderBar.addChild(this.loaderBarBoder)
    //Looks complex but this just centers the bar on screen.
    this.loaderBar.position.x = (Manager.width - this.loaderBar.width) / 2
    this.loaderBar.position.y = (Manager.height - this.loaderBar.height) / 2
    this.addChild(this.loaderBar)
    this.init()
  }

  private async init() {
    await Assets.init({ manifest: manifest })
    Assets.backgroundLoadBundle(['load-screen', 'game-screen'])
    await Assets.loadBundle(['load-screen','game-screen'], this.downloadProgress.bind(this))
    this.gameLoaded()
  }

  private downloadProgress(progress: number): void {
    // Progress goes from 0 to 100 but we are going to use 0 to 1 to set it to scale
    const progressRatio = (progress * 100) / 100
    this.loaderBarFill.scale.x = progressRatio
  }

  private gameLoaded(): void {
    // Our game finished loading!

    // Let's remove our loading bar
    // this.removeChild(this.loaderBar)

    // all your assets are ready! I would probably change to another scene
    // ...but you could build your entire game here if you want
    // (pls don't)
    Manager.changeScene(new GameScene())
  }

  update(framesPassed: number): void {}
}
