import { DisplayObject } from 'pixi.js'

export enum GameState {
  Init,
  paused,
  running,
  end,
}

export type GameObjectOptions = {
  source: string
  checkCollisionTarget: DisplayObject
  initPosition: { x: number; y: number }
  initScale: { x: number; y: number }
}
