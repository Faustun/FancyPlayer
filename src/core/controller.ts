import Utils from '../helpers/utils'
import Thumbnails from './thumbnails'

import { PlayerInterface } from '../type/player'

export default class Controller {
  player: PlayerInterface
  autoHideTimer: number
  thumbnails?: Thumbnails
  disableAutoHide: any

  constructor(player: PlayerInterface) {
    this.player = player

    this.autoHideTimer = 0
    if (!Utils.isMobile) {
      this.player.container.addEventListener('mousemove', () => {
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
    this.initThumbnails()
    this.initPlayedBar()
    this.initFullButton()
    // this.initQualityButton();
    // this.initScreenshotButton();
    // this.initSubtitleButton();
    this.initHighlights()
    if (!Utils.isMobile) {
      this.initVolumeButton()
    }
  }

  // 播放按钮
  initPlayButton() {
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
      this.player.dom.videoWrap.addEventListener('click', () => {
        this.toggle()
      })
      this.player.dom.controllerMask.addEventListener('click', () => {
        this.toggle()
      })
    }
  }

  // 自定义进度条提示点
  initHighlights(): void {
    this.player.on('durationchange', () => {
      if (
        (this.player.video as HTMLVideoElement).duration !== 1 &&
        (this.player.video as HTMLVideoElement).duration !== Infinity
      ) {
        if (this.player.options.highlight) {
          const highlights = document.querySelectorAll('.dplayer-highlight')
          ;[].slice.call(highlights, 0).forEach((item: Element) => {
            this.player.dom.playedBarWrap.removeChild(item)
          })
          for (let i = 0; i < this.player.options.highlight.length; i++) {
            if (!this.player.options.highlight[i].text || !this.player.options.highlight[i].time) {
              continue
            }
            const p = document.createElement('div')
            Utils.classList.addClass(p, 'dplayer-highlight')
            p.style.left =
              (this.player.options.highlight[i].time /
                (this.player.video as HTMLVideoElement).duration) *
                100 +
              '%'
            p.innerHTML =
              '<span class="dplayer-highlight-text">' +
              this.player.options.highlight[i].text +
              '</span>'
            this.player.dom.playedBarWrap.insertBefore(p, this.player.dom.playedBarTime)
          }
        }
      }
    })
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
      let percentage =
        ((e.clientX || e.changedTouches[0].clientX) -
          Utils.getBoundingClientRectViewLeft(this.player.dom.playedBarWrap)) /
        this.player.dom.playedBarWrap.clientWidth
      percentage = Math.max(percentage, 0)
      percentage = Math.min(percentage, 1)
      this.player.bar.set('played', percentage, 'width')
      this.player.dom.ptime.innerHTML = Utils.secondToTime(
        percentage * (this.player.video as HTMLVideoElement).duration
      )
    }

    const thumbUp = (e: any) => {
      document.removeEventListener(Utils.nameMap.dragEnd, thumbUp)
      document.removeEventListener(Utils.nameMap.dragMove, thumbMove)
      let percentage =
        ((e.clientX || e.changedTouches[0].clientX) -
          Utils.getBoundingClientRectViewLeft(this.player.dom.playedBarWrap)) /
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
      if ((this.player.video as HTMLVideoElement).duration) {
        const px = Utils.cumulativeOffset(this.player.dom.playedBarWrap).left
        const tx = (e.clientX || e.changedTouches[0].clientX) - px
        if (tx < 0 || tx > this.player.dom.playedBarWrap.offsetWidth) {
          return
        }
        const time =
          (this.player.video as HTMLVideoElement).duration *
          (tx / this.player.dom.playedBarWrap.offsetWidth)
        if (Utils.isMobile) {
          this.thumbnails && this.thumbnails.show()
        }
        this.thumbnails && this.thumbnails.move(tx)
        this.player.dom.playedBarTime.style.left = `${tx - (time >= 3600 ? 25 : 20)}px`
        this.player.dom.playedBarTime.innerText = Utils.secondToTime(time)
        Utils.classList.removeClass(this.player.dom.playedBarTime, 'hidden')
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
    const vWidth = 35

    const volumeMove = (event: any) => {
      const e = event || window.event
      const percentage =
        ((e.clientX || e.changedTouches[0].clientX) -
          Utils.getBoundingClientRectViewLeft(this.player.dom.volumeBarWrap) -
          5.5) /
        vWidth
      this.player.volume(percentage)
    }
    const volumeUp = () => {
      document.removeEventListener(Utils.nameMap.dragEnd, volumeUp)
      document.removeEventListener(Utils.nameMap.dragMove, volumeMove)
      Utils.classList.removeClass(this.player.dom.volumeButton, 'dplayer-volume-active')
    }

    this.player.dom.volumeBarWrapWrap.addEventListener('click', event => {
      const e: any = event || window.event
      const percentage =
        ((e.clientX || e.changedTouches[0].clientX) -
          Utils.getBoundingClientRectViewLeft(this.player.dom.volumeBarWrap) -
          5.5) /
        vWidth
      this.player.volume(percentage)
    })
    this.player.dom.volumeBarWrapWrap.addEventListener(Utils.nameMap.dragStart, () => {
      document.addEventListener(Utils.nameMap.dragMove, volumeMove)
      document.addEventListener(Utils.nameMap.dragEnd, volumeUp)
      Utils.classList.addClass(this.player.dom.volumeButton, 'dplayer-volume-active')
    })
    this.player.dom.volumeButtonIcon.addEventListener('click', () => {
      if ((this.player.video as HTMLVideoElement).muted) {
        ;(this.player.video as HTMLVideoElement).muted = false
        this.player.switchVolumeIcon()
        this.player.bar.set('volume', this.player.volume(), 'width')
      } else {
        ;(this.player.video as HTMLVideoElement).muted = true
        this.player.dom.volumeIconFont.className = 'iconfont iconvolume-off'
        this.player.bar.set('volume', 0, 'width')
      }
    })
  }

  // initQualityButton() {
  //     if (this.player.options.video.quality) {
  //         this.player.dom.qualityList.addEventListener('click', (e) => {
  //             if (e.target.classList.contains('dplayer-quality-item')) {
  //                 this.player.switchQuality(e.target.dataset.index);
  //             }
  //         });
  //     }
  // }

  // initScreenshotButton() {
  //     if (this.player.options.screenshot) {
  //         this.player.dom.camareButton.addEventListener('click', () => {
  //             const canvas = document.createElement('canvas');
  //             canvas.width = this.player.video.videoWidth;
  //             canvas.height = this.player.video.videoHeight;
  //             canvas.getContext('2d').drawImage(this.player.video, 0, 0, canvas.width, canvas.height);

  //             let dataURL;
  //             canvas.toBlob((blob) => {
  //                 dataURL = URL.createObjectURL(blob);
  //                 const link = document.createElement('a');
  //                 link.href = dataURL;
  //                 link.download = 'DPlayer.png';
  //                 link.style.display = 'none';
  //                 document.body.appendChild(link);
  //                 link.click();
  //                 document.body.removeChild(link);
  //                 URL.revokeObjectURL(dataURL);
  //             });

  //             this.player.events.trigger('screenshot', dataURL);
  //         });
  //     }
  // }

  // initSubtitleButton() {
  //     if (this.player.options.subtitle) {
  //         this.player.events.on('subtitle_show', () => {
  //             this.player.dom.subtitleButton.dataset.balloon = this.player.tran('Hide subtitle');
  //             this.player.dom.subtitleButtonInner.style.opacity = '';
  //             this.player.user.set('subtitle', 1);
  //         });
  //         this.player.events.on('subtitle_hide', () => {
  //             this.player.dom.subtitleButton.dataset.balloon = this.player.tran('Show subtitle');
  //             this.player.dom.subtitleButtonInner.style.opacity = '0.4';
  //             this.player.user.set('subtitle', 0);
  //         });

  //         this.player.dom.subtitleButton.addEventListener('click', () => {
  //             this.player.subtitle.toggle();
  //         });
  //     }
  // }

  setAutoHide(): void {
    this.show()
    clearTimeout(this.autoHideTimer)
    this.autoHideTimer = window.setTimeout(() => {
      if (
        (this.player.video as HTMLVideoElement).played.length &&
        !this.player.paused &&
        !this.disableAutoHide
      ) {
        this.hide()
      }
    }, 3000)
  }

  show(): void {
    Utils.classList.removeClass(this.player.container, 'dplayer-hide-controller')
  }

  hide(): void {
    Utils.classList.addClass(this.player.container, 'dplayer-hide-controller')
    // this.player.setting.hide();
    // this.player.comment && this.player.comment.hide();
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
