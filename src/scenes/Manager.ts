import { Application, Container, DisplayObject } from 'pixi.js'

export class Manager {
  private constructor() {
    /*this class is purely static. No constructor to see here*/
  }

  // Safely store variables for our game
  private static app: Application
  private static currentScene: IScene

  // Width and Height are read-only after creation (for now)
  private static _width: number
  private static _height: number

  // With getters but not setters, these variables become read-only
  public static get width(): number {
    return Manager._width
  }
  public static get height(): number {
    return Manager._height
  }

  public static addContainer(container: Container) {
    Manager.app.stage.addChild(container)
    Manager.app.stage.sortChildren()
  }

  // Use this function ONCE to start the entire machinery
  public static initialize(
    width: number,
    height: number,
    background: number
  ): void {
    // store our width and height
    Manager._width = width
    Manager._height = height

    // Create our pixi app
    Manager.app = new Application({
      view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: background,
      width: width,
      height: height,
    })

    // 启动pixi js 控制台调试工具
    //@ts-ignore
    globalThis.__PIXI_APP__ = Manager.app

    // Add the ticker
    Manager.app.ticker.add(Manager.update)

    // window.addEventListener('resize', Manager.resize)
    // Manager.resize()
  }

  public static resize(): void {
    // current screen size
    const screenWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
    const screenHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    )

    // uniform scale for our game
    const scale = Math.min(
      screenWidth / Manager.width,
      screenHeight / Manager.height
    )

    // the "uniformly englarged" size for our game
    const enlargedWidth = Math.floor(scale * Manager.width)
    const enlargedHeight = Math.floor(scale * Manager.height)

    // margins for centering our game
    const horizontalMargin = (screenWidth - enlargedWidth) / 2
    const verticalMargin = (screenHeight - enlargedHeight) / 2

    if (Manager.app.view.style) {
      // now we use css trickery to set the sizes and margins
      Manager.app.view.style.width = `${enlargedWidth}px`
      Manager.app.view.style.height = `${enlargedHeight}px`
      ;(
        Manager.app.view.style as any
      ).margin = `${verticalMargin}px ${horizontalMargin}px`
    }
  }

  // Call this function when you want to go to a new scene
  public static changeScene(newScene: IScene): void {
    // Remove and destroy old scene... if we had one..
    if (Manager.currentScene) {
      Manager.app.stage.removeChild(Manager.currentScene)
      Manager.currentScene.destroy()
    }

    // Add the new one
    Manager.currentScene = newScene
    Manager.app.stage.addChild(Manager.currentScene)
    Manager.app.stage.sortChildren()
  }

  // This update will be called by a pixi ticker and tell the scene that a tick happened
  private static update(framesPassed: number): void {
    // Let the current scene know that we updated it...
    // Just for funzies, sanity check that it exists first.
    if (Manager.currentScene) {
      Manager.currentScene.update(framesPassed)
    }

    // as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
  }
}

// This could have a lot more generic functions that you force all your scenes to have. Update is just an example.
// Also, this could be in its own file...
export interface IScene extends DisplayObject {
  update(framesPassed: number): void

  resize?(screenWidth: number, screenHeight: number): void
}
