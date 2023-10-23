import { AssetsManifest } from 'pixi.js'
import loading from './images/pixi_loading.jpg'
const playerJump = '/assets/player_jump.png'
const playerStand = '/assets/player_stand.png'
const playerRun = '/assets/player_run.png'
const playerGG = '/assets/player_gg.png'
const playerJumpJson = '/assets/player_jump.json'
const playerRunJson = '/assets/player_run.json'
const playerStandJson = '/assets/player_stand.json'
const playerGGJson = '/assets/player_gg.json'

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
          alias: 'playerGG',
          src: playerGG,
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
        {
          alias: 'playerGGJson',
          src: playerGGJson,
        },
      ],
    },
  ],
}

export default manifest
