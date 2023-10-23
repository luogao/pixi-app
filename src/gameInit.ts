import { LoaderScene } from './scenes/LoaderScene'
import { Manager } from './scenes/Manager'
const screenWidth = Math.max(
  document.documentElement.clientWidth,
  window.innerWidth || 0
)
const screenHeight = Math.max(
  document.documentElement.clientHeight,
  window.innerHeight || 0
)

const appSize = {
  width: screenWidth,
  height: screenHeight,
}

function gameInit() {
  Manager.initialize(appSize.width, appSize.height, 0x00cfe0)
  const loadScene = new LoaderScene()
  Manager.changeScene(loadScene)
}

export default gameInit
