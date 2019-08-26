import Utils from '../helpers/utils'
import Thumbnails from './thumbnails'

import { PlayerInterface } from '../type/player'
import { InterfaceHighlights } from '../type/options'

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
    this.initRetreatAndFast()
    this.initThumbnails()
    this.initPlayedBar()
    this.initFullButton()
    this.initDoubleSpeed()
    // this.initQualityButton();
    // this.initScreenshotButton();
    // this.initSubtitleButton();
    this.initHighlights()
    if (!Utils.isMobile) {
      this.initVolumeButton()
    }
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
      this.player.dom.videoWrap.addEventListener('click', () => {
        this.toggle()
      })
      this.player.dom.controllerMask.addEventListener('click', () => {
        this.toggle()
      })
    }
  }
  initRetreatAndFast(): void {
    this.player.dom.playRetreat.addEventListener('click', () => {
      this.player.seek(this.player.video.currentTime - 15)
      this.player.controller.setAutoHide()
    })
    this.player.dom.playFast.addEventListener('click', () => {
      this.player.seek(this.player.video.currentTime + 15)
      this.player.controller.setAutoHide()
    })
  }
  initDoubleSpeed(): void {
    this.player.dom.doubleSpeed.addEventListener('click', () => {
      Utils.classList.toggleClass(this.player.dom.doubleSpeedPopup, 'open')
    })
  }

  // 自定义进度条提示点
  initHighlights(): void {
    this.player.on('durationchange', () => {
      const duration = (this.player.video as HTMLVideoElement).duration
      const highlightOptions = this.player.options.highlight

      if (duration !== 1 && duration !== Infinity) {
        if (highlightOptions) {
          const highlights = document.querySelectorAll('.dplayer-highlight')
          ;[].slice.call(highlights, 0).forEach((item: Element) => {
            this.player.dom.playedBarWrap.removeChild(item)
          })
          let parentHighlights: InterfaceHighlights[] = []
          for (let i = 0; i < highlightOptions.length; i++) {
            const highlightNode = document.createElement('div') as HTMLElement
            if (!highlightOptions[i].label) {
              Utils.classList.addClasses(highlightNode, 'dplayer-highlight node-small')
              highlightNode.style.backgroundColor = this.player.options.theme!
            } else {
              parentHighlights.push(highlightOptions[i])
              Utils.classList.addClasses(highlightNode, 'dplayer-highlight node-large')
              highlightNode.style.borderColor = this.player.options.theme!
            }
            highlightNode.style.left = (highlightOptions[i].time / duration) * 100 + '%'

            highlightNode.innerHTML = `<div class="dplayer-highlight-img" style="background-image: url('${highlightOptions[i].thumbnail}');"></div>
                `
            this.player.dom.playedBarWrap.insertBefore(highlightNode, this.player.dom.playedBarTime)
          }
          for (let i = 0; i < parentHighlights.length; i++) {
            let labelNode = document.createElement('div') as HTMLElement
            Utils.classList.addClass(labelNode, 'dplayer-highlight-label')
            labelNode.innerText = parentHighlights[i].label!
            if (i + 1 < parentHighlights.length) {
              labelNode!.style.left =
                ((parentHighlights[i + 1].time / duration - parentHighlights[i].time / duration) /
                  2 +
                  parentHighlights[i].time / duration) *
                  100 +
                '%'
            } else if (i + 1 === parentHighlights.length) {
              labelNode!.style.left =
                ((1 - parentHighlights[i].time / duration) / 2 +
                  parentHighlights[i].time / duration) *
                  100 +
                '%'
            }
            this.player.dom.playedBarWrap.insertBefore(labelNode!, this.player.dom.playedBarTime)
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
