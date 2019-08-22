import { PlayerInterface } from '../type/player'
import { TimerInterface } from '../type/timer'
import Utils from '../helpers/utils'

class Timer implements TimerInterface {
  player: PlayerInterface
  types: string[]
  infoChecker?: number
  loadingChecker?: number
  enableloadingChecker?: boolean

  constructor(player: PlayerInterface) {
    this.player = player

    window.requestAnimationFrame = (() =>
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).oRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60)
      })()

    this.types = ['loading', 'info', 'fps']

    this.init()
  }

  init() {
    this.types.map((item: string) => {
      if (item !== 'fps') {
        // this[`init${item}Checker`]();
        ;(this as any)[`init${item}Checker`]()
      }
      return item
    })
  }

  initloadingChecker() {
    let lastPlayPos = 0
    let currentPlayPos = 0
    let bufferingDetected = false
    this.loadingChecker = window.setInterval(() => {
      if (this.enableloadingChecker) {
        // whether the video is buffering
        currentPlayPos = (this.player.video as HTMLVideoElement).currentTime
        if (
          !bufferingDetected &&
          currentPlayPos === lastPlayPos &&
          !(this.player.video as HTMLVideoElement).paused
        ) {
          Utils.classList.addClass(this.player.container, 'dplayer-loading')
          bufferingDetected = true
        }
        if (
          bufferingDetected &&
          currentPlayPos > lastPlayPos &&
          !(this.player.video as HTMLVideoElement).paused
        ) {
          Utils.classList.removeClass(this.player.container, 'dplayer-loading')
          bufferingDetected = false
        }
        lastPlayPos = currentPlayPos
      }
    }, 100)
  }

  // initfpsChecker() {
  //     window.requestAnimationFrame(() => {
  //         if (this.enablefpsChecker) {
  //             this.initfpsChecker();
  //             if (!this.fpsStart) {
  //                 this.fpsStart = new Date();
  //                 this.fpsIndex = 0;
  //             }
  //             else {
  //                 this.fpsIndex++;
  //                 const fpsCurrent = new Date();
  //                 if (fpsCurrent - this.fpsStart > 1000) {
  //                     this.player.infoPanel.fps(this.fpsIndex / (fpsCurrent - this.fpsStart) * 1000);
  //                     this.fpsStart = new Date();
  //                     this.fpsIndex = 0;
  //                 }
  //             }
  //         }
  //         else {
  //             this.fpsStart = 0;
  //             this.fpsIndex = 0;
  //         }
  //     });
  // }

  initinfoChecker() {
    // this.infoChecker = window.setInterval(() => {
    //     if (this.enableinfoChecker) {
    //         this.player.infoPanel.update();
    //     }
    // }, 1000);
  }

  enable(type: string) {
    ;(this as any)[`enable${type}Checker`] = true

    if (type === 'fps') {
      // this.initfpsChecker();
    }
  }

  disable(type: string) {
    ;(this as any)[`enable${type}Checker`] = false
  }

  destroy() {
    this.types.map(item => {
      ;(this as any)[`enable${item}Checker`] = false
      ;(this as any)[`${item}Checker`] && clearInterval((this as any)[`${item}Checker`])
      return item
    })
  }
}

export default Timer
