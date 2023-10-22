import { Application, Sprite, Text, TextStyle } from 'pixi.js'
import tree from './images/tree.png'
import icon_energy from './images/icon_energy.png'
import { Tween, Group, Easing } from 'tweedle.js'
import EnergyBobble from './EnergyBobble'
import getRandomByRange from './utils/getRandomByRange'
import { getProject, types } from '@theatre/core'
import sun_icon from './images/sun.png'
import moon_icon from './images/moon.png'
import cloud_icon1 from './images/cloud1.png'
import cloud_icon2 from './images/cloud2.png'
import dayjs from 'dayjs'
// import MouseTracker from './MouseTracker'
// import projectState from './pixi sun and moon.theatre-project-state.json'
import RunningMan from './RunningMan'
import Obstacle from './Obstacle'
import checkCollision from './utils/checkCollision'
import Sheep from './Sheep'
import RunningTrack from './RunningTrack'
import { LoaderScene } from './scenes/LoaderScene'
import studio from '@theatre/studio'

const speed = 15
let fucked = 0
let oldState = false
let distance = 0
let sheepSpeed = 8
let oldSheepHitState = false
let sheepHitCount = 0
studio.initialize()

const app = () => {
  const project = getProject('pixi sun and moon new')
  // const project = getProject('pixi sun and moon', { state: projectState })
  const sheet = project.sheet('Animated scene')


  let receivedCount = 0
  let bobbleCount = 2

  const appSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const myApp = new Application({
    view: document.getElementById('container') as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    backgroundColor: 0x6495ed,
    autoDensity: true,
    ...appSize,
  })

  myApp.stage.interactive = true
  myApp.stage.hitArea = myApp.screen
  const myTree = Sprite.from(tree)
  myTree.scale = { x: 0.13, y: 0.13 }
  myTree.anchor.set(0.5)
  myTree.x = myApp.screen.width / 2
  myTree.y = myApp.screen.height * 0.5
  myApp.stage.addChild(myTree)

  const myTreeTween = new Tween(myTree.scale)
    .to(
      {
        x: myTree.scale.x + 0.001,
        y: myTree.scale.y + 0.008,
      },
      210
    )
    .repeat(3)
    .yoyo(true)
    .easing(Easing.Cubic.InOut)

  const handleBobbleReceived = () => {
    bobbleCount--

    receivedCount++
    myTreeTween.start()
  }

  const addBobble = () => {
    const energyBobble = new EnergyBobble({
      source: icon_energy,
      initPosition: {
        x: getRandomByRange([0, appSize.width]),
        y: getRandomByRange([0, appSize.height / 2]),
      },
      initScale: { x: 0.03, y: 0.03 },
      receivedPosition: {
        x: myTree.x,
        y: myTree.y,
      },
      onReceived: handleBobbleReceived,
    })

    myApp.stage.addChild(energyBobble.bobble)
  }

  // addBobble()
  // addBobble()

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
    x: appSize.width - 150,
    y: 350,
  }

  myApp.stage.addChild(cloud1)
  myApp.stage.addChild(cloud2)

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

  const style = new TextStyle({
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
    wordWrapWidth: appSize.width,
    lineJoin: 'round',
  })

  const richText = new Text(
    'Rich text with a lot of options and across multiple lines',
    style
  )

  richText.anchor.set(1, 0)
  richText.position.x = appSize.width
  richText.position.y = 10

  myApp.stage.addChild(richText)
  myApp.stage.addChild(sun)
  myApp.stage.addChild(moon)
  // project.ready.then(() =>
  //   sheet.sequence.play({ iterationCount: Infinity, direction: 'alternate' })
  // )

  document.getElementById('add-button')?.addEventListener('click', () => {
    bobbleCount++

    if (bobbleCount >= 8) {
      bobbleCount = 1
    }
    addBobble()
  })

  RunningTrack(myApp)

  myApp.ticker.add(() => {
    Group.shared.update()
    // document.getElementById(
    //   'received-count'
    // )!.innerHTML = `恭喜你，已收取${receivedCount} 个能量`

    richText.text = dayjs().format('@ YYYY-MM-DD, HH:mm:ss ')
  })

  // MouseTracker(myApp)
  const runningMan = RunningMan(myApp)
  const obstacle = Obstacle(myApp)
  const sheep = Sheep(myApp)

  const fuckText = new Text(`You have been fucked ${fucked}  `, style)

  fuckText.anchor.set(1, 1)
  fuckText.position.x = myApp.screen.width
  fuckText.position.y = myApp.screen.height
  myApp.stage.addChild(fuckText)

  const distanceText = new Text(`You run ${distance}km`, style)

  distanceText.anchor.set(1, 1)
  distanceText.position.x = distanceText.width + 150
  distanceText.position.y = myApp.screen.height
  myApp.stage.addChild(distanceText)

  const moving = () => {
    const isHit = checkCollision(obstacle, runningMan)
    if (oldState !== isHit) {
      if (isHit) {
        fucked++
        fuckText.text = `You have been fucked ${fucked}`
      }
      oldState = isHit
    }

    if (!isHit) {
      obstacle.position.x -= speed
      distance += 0.16
      distanceText.text = `You run ${distance.toFixed(2)} km`
    }

    if (obstacle.position.x < 0) {
      obstacle.position.x = myApp.screen.width
    }
  }

  const sheepText = new Text(` 🐑 ${sheepHitCount} 次`, style)
  sheepText.anchor.set(0.5, 0.5)
  sheepText.scale = { x: 1.8, y: 1.8 }
  sheepText.position = {
    x: myApp.screen.width / 2,
    y: myApp.screen.height - sheepText.height / 2,
  }
  myApp.stage.addChild(sheepText)

  const sheepMoving = () => {
    const isHit = checkCollision(sheep, runningMan)
    if (oldSheepHitState !== isHit) {
      if (isHit) {
        sheepHitCount++
        sheepText.text = ` 🐑 ${sheepHitCount} 次`
      }
      oldSheepHitState = isHit
    }

    if (!isHit) {
      sheep.position.x -= sheepSpeed
    }

    if (sheep.position.x < 0 && Math.random() < Math.random() * 0.8) {
      sheep.position.x = myApp.screen.width + 2000
    }
  }

  myApp.ticker.add(() => {
    moving()
    sheepMoving()
  })

  const loaderScene = new LoaderScene()
  myApp.stage.addChild(loaderScene)
}

export default app
