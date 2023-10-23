import { LoaderScene } from './scenes/LoaderScene'
import { Manager } from './scenes/Manager'

const appSize = {
  width: 800,
  height: 500,
}

function gameInit() {
  Manager.initialize(appSize.width, appSize.height, 0x00cfe0)
  const loadScene = new LoaderScene()
  Manager.changeScene(loadScene)
}

export default gameInit
