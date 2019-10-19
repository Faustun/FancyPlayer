import { TranInterface } from '../type/i18n'
import { PlayerInterfaceConfig } from '../type/options'
import { createDomParams } from '../type/dom'

export default class Dom {
  container: HTMLElement
  volumeBar?: HTMLElement
  volumeBarWrap?: HTMLElement
  volumeBarWrapWrap?: HTMLElement
  volumeButton?: HTMLElement
  volumeButtonIcon?: HTMLElement
  volumeIcon?: HTMLElement
  loadedBar?: HTMLElement
  playedBar?: HTMLElement
  playedBarWrap?: HTMLElement
  playedBarTime?: HTMLElement
  video?: HTMLVideoElement
  playButton?: HTMLElement
  playButtonIco?: HTMLElement
  videoWrap?: HTMLElement
  controllerMask?: HTMLElement
  ptime?: HTMLElement
  dtime?: HTMLElement
  controller?: HTMLElement
  browserFullButton?: HTMLElement
  webFullButton?: HTMLElement
  notice?: HTMLElement
  volumeIconFont?: HTMLElement
  playedBarPreview?: HTMLElement
  bezelIconBox?: HTMLElement
  bezelIcon?: HTMLElement
  loadingIcon?: HTMLElement
  playFast?: HTMLElement
  playRetreat?: HTMLElement
  doubleSpeed?: HTMLElement
  doubleSpeedPopup?: HTMLElement
  mask?: HTMLElement
  controllerLeft?: HTMLElement
  danmaku?: HTMLElement

  constructor(element: HTMLElement, options: PlayerInterfaceConfig, tran: TranInterface) {
    this.container = element
    this.init(element, options, tran)
  }

  init(element: HTMLElement, options: PlayerInterfaceConfig, tran: TranInterface): void {
    const { video, preload, screenshot, logo, theme, danmaku } = options
    this.mask = this.createDom({ ele: element, label: 'div', className: 'dplayer-mask' })
    this.videoWrap = this.createDom({ ele: element, label: 'div', className: 'dplayer-video-wrap' })
    // 视频
    if (video) {
      const { url = '', pic = '' } = video
      this.video = this.createMediaDom({
        ele: this.videoWrap,
        label: 'video',
        className: 'dplayer-video dplayer-video-current dplayer-no-highlight',
        url,
        poster: pic,
        preload,
        screenshot,
        playsinline: 'true',
        webkitPlaysinline: 'true'
      })
    }
    if (logo) {
      let playerLogo = this.createDom({
        ele: this.videoWrap,
        label: 'div',
        className: 'dplayer-logo'
      })
      this.createDom({ ele: playerLogo, label: 'img', url: logo })
    }
    if (danmaku) {
      this.danmaku = this.createDom({
        ele: this.videoWrap,
        label: 'div',
        className: 'dplayer-danmaku'
      })
      this.createDom({
        ele: this.danmaku,
        label: 'div',
        className: 'dplayer-danmaku-item dplayer-danmaku-item--demo'
      })
    }
    const bezelWrap = this.createDom({
      ele: this.videoWrap,
      label: 'div',
      className: 'dplayer-bezel'
    })
    this.bezelIconBox = this.createDom({
      ele: bezelWrap,
      label: 'span',
      className: 'dplayer-bezel-icon dplayer-bezel-pause'
    })
    const LoadHtmlStr = `<div class="spinner1"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>`
    this.loadingIcon = this.createDom({
      ele: bezelWrap,
      label: 'span',
      className: 'diplayer-loading-icon',
      html: LoadHtmlStr
    })
    this.bezelIcon = this.createDom({
      ele: this.bezelIconBox,
      label: 'span',
      className: 'iconfont iconplay'
    })

    this.controllerMask = this.createDom({
      ele: element,
      label: 'div',
      className: 'dplayer-controller-mask'
    })
    this.controller = this.createDom({
      ele: element,
      label: 'div',
      className: 'dplayer-controller'
    })

    this.controllerLeft = this.createDom({
      ele: this.controller,
      label: 'div',
      className: 'dplayer-icons dplayer-icons-left'
    })

    this.playRetreat = this.createDom({
      ele: this.controllerLeft,
      label: 'button',
      className: 'dplayer-icon dplayer-retreat'
    })
    this.createDom({
      ele: this.playRetreat,
      label: 'span',
      className: 'iconfont iconretreat'
    })

    this.playButton = this.createDom({
      ele: this.controllerLeft,
      label: 'button',
      className: 'dplayer-icon dplayer-play-icon'
    })
    this.playButtonIco = this.createDom({
      ele: this.playButton,
      label: 'span',
      className: 'iconfont iconplay'
    })

    this.playFast = this.createDom({
      ele: this.controllerLeft,
      label: 'button',
      className: 'dplayer-icon dplayer-fast'
    })
    this.createDom({
      ele: this.playFast,
      label: 'span',
      className: 'iconfont iconfast'
    })

    // 控制右侧
    const controllerRight = this.createDom({
      ele: this.controller,
      label: 'div',
      className: 'dplayer-icons dplayer-icons-right'
    })

    const playerTime = this.createDom({
      ele: controllerRight,
      label: 'span',
      className: 'dplayer-time'
    })
    this.ptime = this.createDom({
      ele: playerTime,
      label: 'span',
      className: 'dplayer-ptime',
      text: '0:00'
    })
    this.createDom({ ele: playerTime, label: 'span', text: ' / ' })
    this.dtime = this.createDom({
      ele: playerTime,
      label: 'span',
      className: 'dplayer-dtime',
      text: '0:00'
    })

    const doubleSpeed = this.createDom({
      ele: controllerRight,
      label: 'div',
      className: 'dplayer-double-speed-wrap'
    })
    this.doubleSpeed = this.createDom({
      ele: doubleSpeed,
      text: '倍速',
      label: 'span',
      className: 'dplayer-double-speed'
    })
    const doubleSpeedStr = `<div class="dplayer-popup-speed-item" data-speed="0.5X">0.5X</div>
    <div class="dplayer-popup-speed-item" data-speed="1X">1X</div>
    <div class="dplayer-popup-speed-item" data-speed="1.25X">1.25X</div>
    <div class="dplayer-popup-speed-item" data-speed="1.5X">1.5X</div>
    <div class="dplayer-popup-speed-item" data-speed="2X">2X</div>
    `
    this.doubleSpeedPopup = this.createDom({
      ele: doubleSpeed,
      label: 'div',
      html: doubleSpeedStr,
      className: 'dplayer-popup-panel'
    })

    this.volumeButton = this.createDom({
      ele: controllerRight,
      label: 'div',
      className: 'dplayer-volume'
    })
    this.volumeButtonIcon = this.createDom({
      ele: this.volumeButton,
      label: 'button',
      className: 'dplayer-icon dplayer-volume-icon'
    })
    this.volumeIcon = this.createDom({
      ele: this.volumeButtonIcon,
      label: 'span',
      className: 'dplayer-icon-content'
    })
    this.volumeIconFont = this.createDom({
      ele: this.volumeIcon,
      label: 'span',
      className: 'iconfont iconvolume-up'
    })
    this.volumeBarWrapWrap = this.createDom({
      ele: this.volumeButton,
      label: 'div',
      className: 'dplayer-volume-bar-wrap'
    })
    // this.volumeBarWrapWrap.setAttribute('data-balloon-pos', 'up')
    this.volumeBarWrap = this.createDom({
      ele: this.volumeBarWrapWrap,
      label: 'div',
      className: 'dplayer-volume-bar'
    })
    this.volumeBar = this.createDom({
      ele: this.volumeBarWrap,
      label: 'div',
      className: 'dplayer-volume-bar-inner',
      styles: `background:${theme}`
    })
    this.createDom({
      ele: this.volumeBar,
      label: 'span',
      className: 'dplayer-thumb',
      styles: `background:${theme}`
    })
    // 全屏按钮
    const playerFull = this.createDom({
      ele: controllerRight,
      label: 'div',
      className: 'dplayer-full'
    })
    this.webFullButton = this.createDom({
      ele: playerFull,
      label: 'button',
      className: 'dplayer-icon dplayer-full-in-icon'
    })
    this.browserFullButton = this.createDom({
      ele: playerFull,
      label: 'button',
      className: 'dplayer-icon dplayer-full-icon'
    })
    const browserFullButIco = this.createDom({
      ele: this.browserFullButton,
      label: 'span',
      className: 'dplayer-icon-content'
    })
    const webFullButIco = this.createDom({
      ele: this.webFullButton,
      label: 'span',
      className: 'dplayer-icon-content'
    })
    this.createDom({ ele: browserFullButIco, label: 'span', className: 'iconfont iconfull' })
    this.createDom({ ele: webFullButIco, label: 'span', className: 'iconfont iconfull-web' })

    this.playedBarWrap = this.createDom({
      ele: this.controller,
      label: 'div',
      className: 'dplayer-bar-wrap'
    })

    this.playedBarTime = this.createDom({
      ele: this.playedBarWrap,
      label: 'div',
      className: 'dplayer-bar-time hidden',
      text: '00:00'
    })
    this.playedBarPreview = this.createDom({
      ele: this.playedBarWrap,
      label: 'div',
      className: 'dplayer-bar-preview'
    })
    const playerBar = this.createDom({
      ele: this.playedBarWrap,
      label: 'div',
      className: 'dplayer-bar'
    })
    this.loadedBar = this.createDom({
      ele: playerBar,
      label: 'div',
      className: 'dplayer-loaded',
      styles: 'width: 0'
    })
    this.playedBar = this.createDom({
      ele: playerBar,
      label: 'div',
      className: 'dplayer-played',
      styles: `width: 0; background: ${theme}`
    })
    this.createDom({
      ele: this.playedBar,
      label: 'span',
      className: 'dplayer-thumb',
      styles: `background: ${theme}`
    })
    this.notice = this.createDom({ ele: element, label: 'div', className: 'dplayer-notice' })
  }

  createMediaDom(params: createDomParams): HTMLVideoElement {
    const {
      label,
      className,
      ele,
      url,
      poster,
      preload,
      screenshot,
      playsinline,
      webkitPlaysinline
    } = params
    const createEle = document.createElement(label) as HTMLVideoElement
    if (className) {
      createEle.className = className!
    }
    if (url) {
      createEle.setAttribute('src', url)
    }
    if (preload) {
      createEle.setAttribute('preload', preload)
    }
    if (poster) {
      createEle.setAttribute('poster', poster)
    }
    if (playsinline) {
      createEle.setAttribute('playsinline', playsinline)
    }
    if (webkitPlaysinline) {
      createEle.setAttribute('webkit-playsinline', webkitPlaysinline)
    }
    if (screenshot) {
      createEle.setAttribute('crossorigin', 'anonymous')
    }
    ele.appendChild(createEle)
    return createEle
  }

  createDom(params: createDomParams): HTMLElement {
    const { label, className, ele, url, styles, text, html } = params
    const createEle = document.createElement(label)
    if (className) {
      createEle.className = className!
    }
    if (url) {
      createEle.setAttribute('src', url)
    }
    if (styles) {
      createEle.setAttribute('style', styles)
    }
    if (text) {
      createEle.innerText = text
    }
    if (html) {
      createEle.innerHTML = html
    }
    ele.appendChild(createEle)
    return createEle
  }
}
