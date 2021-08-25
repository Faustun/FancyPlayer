import Utils from '../helpers/utils'
import Thumbnails from './thumbnails'

import { PlayerInterface } from '../type/player'

export default class Controller {
  player: PlayerInterface
  autoHideTimer: number
  thumbnails?: Thumbnails
  disableAutoHide: any
  status: boolean
  onOff: boolean

  constructor(player: PlayerInterface) {
    this.player = player
    this.autoHideTimer = 0
    this.status = false
    this.onOff = true

    this.player.dom.mask.addEventListener('click', () => {
      this.maskhide()
    })
    if (!Utils.isMobile) {
      this.player.container.addEventListener('mousemove', () => {
        this.show()
        this.setAutoHide()
      })
      this.player.container.addEventListener('click', () => {
        this.setAutoHide()
      })
      this.player.on('play', () => {
        this.setAutoHide()
      })
      this.player.on('pause', () => {
        this.setAutoHide()
      })
    }

    this.initPlayButton()
    this.initRetreatAndFast()
    this.initThumbnails()
    this.initPlayedBar()
    this.initFullButton()
    this.initDoubleSpeed()
    // this.initHighlights()
    this.initVolumeButton()
  }

  // 播放按钮
  initPlayButton(): void {
    this.player.dom.playButton.addEventListener('click', () => {
      this.player.toggle()
    })

    if (!Utils.isMobile) {
      this.player.dom.videoWrap.addEventListener('click', () => {
        this.player.toggle()
      })
      this.player.dom.controllerMask.addEventListener('click', () => {
        this.player.toggle()
      })
    } else {
      this.player.dom.bezelIconBox.addEventListener('click', e => {
        this.player.toggle()
        e.stopPropagation()
      })
      this.player.dom.videoWrap.addEventListener('click', () => {
        this.setAutoHide()
        if (this.status) {
          this.status = false
          setTimeout(() => {
            if (!this.status && this.onOff) {
              this.toggle()
            } else if (this.status) {
              this.player.toggle()
              this.onOff = false
            } else if (!this.onOff) {
              this.onOff = true
            }
          }, 300)
        } else if (!this.status) {
          this.status = true
          setTimeout(() => {
            if (this.status && this.onOff) {
              this.toggle()
            } else if (!this.status) {
              this.player.toggle()
              this.onOff = false
            } else if (!this.onOff) {
              this.onOff = true
            }
          }, 300)
        }
      })
      this.player.dom.controllerMask.addEventListener('click', () => {
        this.toggle()
      })
    }
  }
  initRetreatAndFast(): void {
    this.player.dom.playRetreat.addEventListener('click', () => {
      this.player.seek((this.player.video as HTMLVideoElement).currentTime - 15)
      this.player.controller.setAutoHide()
    })
    this.player.dom.playFast.addEventListener('click', () => {
      this.player.seek((this.player.video as HTMLVideoElement).currentTime + 15)
      this.player.controller.setAutoHide()
    })
  }
  initDoubleSpeed(): void {
    const doubleSpeeds = document.querySelectorAll('.dplayer-popup-speed-item')
    this.player.dom.doubleSpeed.addEventListener('click', () => {
      const rateText = this.player.dom.doubleSpeed.innerText
      for (let i = 0; i < doubleSpeeds.length; i++) {
        const doubleSpeed = doubleSpeeds[i] as HTMLElement
        let rate = doubleSpeed.dataset.speed
        rate = rate === '1X' ? '倍速' : rate
        Utils.classList.removeClass(doubleSpeed, 'active')
        if (rate === rateText) {
          Utils.classList.addClass(doubleSpeed, 'active')
        }
      }
      this.maskShow()
    })

    for (let i = 0; i < doubleSpeeds.length; i++) {
      doubleSpeeds[i].addEventListener('click', () => {
        const rate = (doubleSpeeds[i] as HTMLElement).dataset.speed
        const rateText = rate === '1X' ? '倍速' : rate
        this.player.speed(rate!)
        this.player.dom.doubleSpeed.innerText = rateText!
        this.maskhide()
      })
    }
  }

  // 视频缩略图
  initThumbnails(): void {
    if (this.player.options.video.thumbnails) {
      this.thumbnails = new Thumbnails({
        container: this.player.dom.playedBarPreview,
        barWidth: this.player.dom.playedBarWrap.offsetWidth,
        url: this.player.options.video.thumbnails,
        events: this.player.events
      })

      this.player.on('loadedmetadata', () => {
        this.thumbnails!.resize(
          160,
          ((this.player.video as HTMLVideoElement).videoHeight /
            (this.player.video as HTMLVideoElement).videoWidth) *
            160,
          this.player.dom.playedBarWrap.offsetWidth
        )
      })
    }
  }
  //
  initPlayedBar(): void {
    const thumbMove = (e: any) => {
      const clientX = typeof e.clientX !== 'undefined' ? e.clientX : e.changedTouches[0].clientX
      let percentage =
        (clientX -
          Utils.getBoundingClientRectViewLeftOrTop(this.player.dom.playedBarWrap, 'left')) /
        this.player.dom.playedBarWrap.clientWidth
      percentage = Math.max(percentage, 0)
      percentage = Math.min(percentage, 1)
      this.player.bar.set('played', percentage, 'width')
      this.player.dom.ptime.innerHTML = Utils.secondToTime(
        percentage * (this.player.video as HTMLVideoElement).duration
      )
    }

    const thumbUp = (e: any) => {
      const clientX = typeof e.clientX !== 'undefined' ? e.clientX : e.changedTouches[0].clientX
      document.removeEventListener(Utils.nameMap.dragEnd, thumbUp)
      document.removeEventListener(Utils.nameMap.dragMove, thumbMove)
      let percentage =
        (clientX -
          Utils.getBoundingClientRectViewLeftOrTop(this.player.dom.playedBarWrap, 'left')) /
        this.player.dom.playedBarWrap.clientWidth
      percentage = Math.max(percentage, 0)
      percentage = Math.min(percentage, 1)
      this.player.bar.set('played', percentage, 'width')
      this.player.seek(
        this.player.bar.get('played') * (this.player.video as HTMLVideoElement).duration
      )
      this.player.timer.enable('progress')
    }

    this.player.dom.playedBarWrap.addEventListener(Utils.nameMap.dragStart, () => {
      this.player.timer.disable('progress')
      document.addEventListener(Utils.nameMap.dragMove, thumbMove)
      document.addEventListener(Utils.nameMap.dragEnd, thumbUp)
    })

    this.player.dom.playedBarWrap.addEventListener(Utils.nameMap.dragMove, (e: any) => {
      const barWidth = this.player.dom.playedBarWrap.offsetWidth
      if ((this.player.video as HTMLVideoElement).duration) {
        const px = Utils.cumulativeOffset(this.player.dom.playedBarWrap).left
        const clientX = typeof e.clientX !== 'undefined' ? e.clientX : e.changedTouches[0].clientX
        const tx = clientX - px
        if (tx < 0 || tx > barWidth) {
          return
        }

        const time = (this.player.video as HTMLVideoElement).duration * (tx / barWidth)
        if (Utils.isMobile) {
          this.thumbnails && this.thumbnails.show()
        }
        this.thumbnails && this.thumbnails.move(tx)
        let BarTimeLeft: number = 0
        if (tx - 23 < 0) {
          BarTimeLeft = 23
        } else if (tx + 23 > barWidth) {
          BarTimeLeft = barWidth - 23
        } else {
          BarTimeLeft = tx
        }
        this.player.dom.playedBarTime.style.left = `${BarTimeLeft}px`
        this.player.dom.playedBarTime.innerText = Utils.secondToTime(time)
        Utils.classList.removeClass(this.player.dom.playedBarTime, 'hidden')
        this._handleThumbnail(tx, time)
      }
    })

    this.player.dom.playedBarWrap.addEventListener(Utils.nameMap.dragEnd, () => {
      if (Utils.isMobile) {
        this.thumbnails && this.thumbnails.hide()
      }
    })

    if (!Utils.isMobile) {
      this.player.dom.playedBarWrap.addEventListener('mouseenter', () => {
        if ((this.player.video as HTMLVideoElement).duration) {
          this.thumbnails && this.thumbnails.show()
          Utils.classList.removeClass(this.player.dom.playedBarTime, 'hidden')
        }
      })

      this.player.dom.playedBarWrap.addEventListener('mouseleave', () => {
        if ((this.player.video as HTMLVideoElement).duration) {
          this.thumbnails && this.thumbnails.hide()
          Utils.classList.addClass(this.player.dom.playedBarTime, 'hidden')
        }
      })
    }
  }

  private _handleThumbnail(tx: number, time: number): void {
    const halfWidth = 60
    const barWidth = this.player.dom.playedBarWrap.offsetWidth
    // const
    const highlights = document.querySelectorAll('.dplayer-highlight')
    for (let i = 0; i < highlights.length; i++) {
      const highlight = highlights[i] as HTMLElement
      const highlightImg = highlight.querySelectorAll('.dplayer-highlight-img')[0] as HTMLElement
      const styleLeft = (parseFloat(highlight.style.left as string) / 100) * barWidth
      const isTrue = tx < halfWidth || tx + halfWidth > barWidth
      if (!highlightImg) {
        return
      }
      highlightImg.innerText = Utils.secondToTime(time)
      if (isTrue && styleLeft < halfWidth) {
        highlightImg.style.marginLeft = '-' + styleLeft + 'px'
      }
      if (isTrue && styleLeft > barWidth - halfWidth) {
        highlightImg.style.marginLeft =
          '-' + (halfWidth - (barWidth - styleLeft) + halfWidth) + 'px'
      }
    }
  }

  // 全屏切换
  initFullButton(): void {
    this.player.dom.browserFullButton.addEventListener('click', () => {
      this.player.fullScreen.toggle('browser')
    })

    this.player.dom.webFullButton.addEventListener('click', () => {
      this.player.fullScreen.toggle('web')
    })
  }

  // 音量
  initVolumeButton(): void {
    if (!Utils.isMobile) {
      const vHeight = 60

      const volumeMove = (event: any) => {
        const e = event || window.event
        const percentage =
          1 -
          ((e.clientY || e.changedTouches[0].clientY) -
            Utils.getBoundingClientRectViewLeftOrTop(this.player.dom.volumeBarWrap, 'top')) /
            vHeight
        this.player.volume(percentage)
      }
      const volumeUp = () => {
        document.removeEventListener(Utils.nameMap.dragEnd, volumeUp)
        document.removeEventListener(Utils.nameMap.dragMove, volumeMove)
      }

      this.player.dom.volumeBarWrapWrap.addEventListener('click', event => {
        const e: any = event || window.event
        const percentage =
          1 -
          ((e.clientY || e.changedTouches[0].clientY) -
            Utils.getBoundingClientRectViewLeftOrTop(this.player.dom.volumeBarWrap, 'top')) /
            vHeight
        this.player.volume(percentage)
      })
      this.player.dom.volumeBarWrapWrap.addEventListener(Utils.nameMap.dragStart, () => {
        document.addEventListener(Utils.nameMap.dragMove, volumeMove)
        document.addEventListener(Utils.nameMap.dragEnd, volumeUp)
      })
      this.player.dom.volumeButton.addEventListener('mouseenter', () => {
        Utils.classList.addClass(this.player.dom.volumeButton, 'dplayer-volume-active')
      })
      this.player.dom.volumeButton.addEventListener('mouseleave', () => {
        Utils.classList.removeClass(this.player.dom.volumeButton, 'dplayer-volume-active')
      })
    }
    this.player.dom.volumeButtonIcon.addEventListener('click', () => {
      if ((this.player.video as HTMLVideoElement).muted) {
        ;(this.player.video as HTMLVideoElement).muted = false
        this.player.switchVolumeIcon()
        this.player.bar.set('volume', this.player.volume(), 'height')
      } else {
        ;(this.player.video as HTMLVideoElement).muted = true
        this.player.dom.volumeIconFont.className = 'iconfont iconvolume-off'
        this.player.bar.set('volume', 0, 'height')
      }
    })
  }

  maskhide(): void {
    Utils.classList.removeClass(this.player.dom.doubleSpeedPopup, 'open')
    Utils.classList.removeClass(this.player.dom.mask, 'dplayer-mask-show')

    this.disableAutoHide = false
  }

  maskShow(): void {
    Utils.classList.addClass(this.player.dom.doubleSpeedPopup, 'open')
    Utils.classList.addClass(this.player.dom.mask, 'dplayer-mask-show')

    this.disableAutoHide = true
  }

  setAutoHide(): void {
    // this.show()
    clearTimeout(this.autoHideTimer)
    this.autoHideTimer = window.setTimeout(() => {
      if (!this.disableAutoHide) {
        this.hide()
      }
    }, 3000)
  }

  show(): void {
    Utils.classList.removeClass(this.player.container, 'dplayer-hide-controller')
  }

  hide(): void {
    if (this.player.paused) {
      return
    }
    if (!Utils.classList.hasClass(this.player.container, 'dplayer-hide-controller')) {
      Utils.classList.addClass(this.player.container, 'dplayer-hide-controller')
    }
  }

  isShow(): boolean {
    return !Utils.classList.hasClass(this.player.container, 'dplayer-hide-controller')
  }

  toggle(): void {
    if (this.isShow()) {
      this.hide()
    } else {
      this.show()
    }
  }

  destroy(): void {
    clearTimeout(this.autoHideTimer)
  }
}
