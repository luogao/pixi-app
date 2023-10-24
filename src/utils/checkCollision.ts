import { DisplayObject } from 'pixi.js'

export default function checkCollision(
  objA: DisplayObject,
  objB: DisplayObject
): boolean {
  const a = objA.getBounds()
  const b = objB.getBounds()

  const rightmostLeft = a.left < b.left ? b.left : a.left
  const leftmostRight = a.right > b.right ? b.right : a.right

  if (leftmostRight <= rightmostLeft) {
    return false
  }

  const bottommostTop = a.top < b.top ? b.top : a.top
  const topmostBottom = a.bottom > b.bottom ? b.bottom : a.bottom

  // // 获取精灵的位置和半径
  // const x1 = objA.x
  // const y1 = objA.y
  // const radius1 = objA.width / 2

  // const x2 = objB.x
  // const y2 = objB.y
  // const radius2 = objB.width / 2

  // // 判断是否碰撞
  // const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
  // const isColliding = distance < radius1 + radius2

  // if (isColliding) {
  //   // 处理碰撞
  //   console.log('碰撞发生了！')
  // }

  // return isColliding
  return topmostBottom > bottommostTop
}
