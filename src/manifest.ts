import { AssetsManifest } from 'pixi.js'
import loading from './images/pixi_loading.jpg'
import cloud1 from './images/cloud1.png'
import cloud2 from './images/cloud2.png'
const playerJump = '/assets/player_jump.png'
const playerStand = '/assets/player_stand.png'
const playerRun = '/assets/player_run.png'
const playerJumpJson = '/assets/player_jump.json'
const playerRunJson = '/assets/player_run.json'
const playerStandJson = '/assets/player_stand.json'

const manifest: AssetsManifest = {
  bundles: [
    {
      name: 'load-screen',
      assets: [
        {
          alias: 'loading',
          src: loading,
        },
      ],
    },
    {
      name: 'game-screen',
      assets: [
        {
          alias: 'cloud1',
          src: cloud1,
        },
        {
          alias: 'cloud2',
          src: cloud2,
        },
        {
          alias: 'start_button',
          src: '/assets/start_button.png',
        },
        {
          alias: 'playerJump',
          src: playerJump,
        },
        {
          alias: 'playerStand',
          src: playerStand,
        },
        {
          alias: 'playerRun',
          src: playerRun,
        },
        {
          alias: 'playerJumpJson',
          src: playerJumpJson,
        },
        {
          alias: 'playerRunJson',
          src: playerRunJson,
        },
        {
          alias: 'playerStandJson',
          src: playerStandJson,
        },
      ],
    },
  ],
}

export default manifest
