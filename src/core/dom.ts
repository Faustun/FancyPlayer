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
  video?: HTMLMediaElement
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

  constructor(element: HTMLElement, options: PlayerInterfaceConfig, tran: TranInterface) {
    this.container = element
    this.init(element, options, tran)
  }

  init(element: HTMLElement, options: PlayerInterfaceConfig, tran: TranInterface): void {
    const { video, preload, screenshot, logo, theme } = options
    this.createDom({ ele: element, label: 'div', className: 'dplayer-mask' })
    this.videoWrap = this.createDom({ ele: element, label: 'div', className: 'dplayer-video-wrap' })
    if (video) {
      const { url = '', pic = '' } = video
      this.video = this.createDom({
        ele: this.videoWrap,
        label: 'video',
        className: 'dplayer-video dplayer-video-current',
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

    const controllerLeft = this.createDom({
      ele: this.controller,
      label: 'div',
      className: 'dplayer-icons dplayer-icons-left'
    })
    this.playButton = this.createDom({
      ele: controllerLeft,
      label: 'button',
      className: 'dplayer-icon dplayer-play-icon'
    })
    this.playButtonIco = this.createDom({
      ele: this.playButton,
      label: 'span',
      className: 'iconfont iconplay'
    })

    this.volumeButton = this.createDom({
      ele: controllerLeft,
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

    const playerTime = this.createDom({
      ele: controllerLeft,
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

    // 控制右侧
    const controllerRight = this.createDom({
      ele: this.controller,
      label: 'div',
      className: 'dplayer-icons dplayer-icons-right'
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
    this.createDom({ ele: this.playedBarWrap, label: 'div', className: 'dplayer-bar-preview' })
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

  createDom(params: createDomParams): any {
    const {
      label,
      className,
      ele,
      url,
      styles,
      text,
      poster,
      preload,
      screenshot,
      playsinline,
      webkitPlaysinline
    } = params
    const createEle = document.createElement(label)
    createEle.className = className!
    ele.appendChild(createEle)
    if (url) {
      createEle.setAttribute('src', url)
    }
    if (styles) {
      createEle.setAttribute('style', styles)
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
    if (text) {
      createEle.innerHTML = text
    }
    return createEle
  }
}
