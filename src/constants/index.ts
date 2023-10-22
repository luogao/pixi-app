import { TextStyle } from 'pixi.js'
import { Manager } from '../scenes/Manager'

export const commonTextStyle = new TextStyle({
  fontFamily: 'Zen Dots',
  fontSize: 16,
  fontWeight: 'bold',
  fill: ['#F56EB3', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 5,
  letterSpacing: 1.6,
  dropShadow: false,
  dropShadowColor: '#7F167F',
  dropShadowBlur: 8,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 10,
  wordWrap: true,
  wordWrapWidth: Manager.width,
  lineJoin: 'round',
})
