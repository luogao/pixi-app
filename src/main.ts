import gameInit from './index'
import './style.css'
// import { gsap } from 'gsap'
// import { PixiPlugin } from 'gsap/PixiPlugin.js'
// import { MotionPathPlugin } from 'gsap/MotionPathPlugin.js'

//without this line, PixiPlugin and MotionPathPlugin may get dropped by your bundler (tree shaking)...
// gsap.registerPlugin(PixiPlugin, MotionPathPlugin)


// 初始化游戏
gameInit()
