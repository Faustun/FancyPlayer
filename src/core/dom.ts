import { TranInterface } from '../type/i18n'
import { PlayerInterfaceConfig } from '../type/options'
interface Styles {
  [propName: string]: any
}

interface createDomParams {
  element: any
  label: string
  className?: string
  url?: string
  styles?: any
  text?: string
}

export default class Dom {
  container: any
  volumeBar: any
  volumeBarWrap: any
  volumeBarWrapWrap: any
  volumeButton: any
  volumeButtonIcon: any
  volumeIcon: any
  loadedBar: any
  playedBar: any
  playedBarWrap: any
  playedBarTime: any
  video: any
  playButton: any
  videoWrap: any
  controllerMask: any
  ptime: any
  dtime: any
  controller: any
  browserFullButton: any

  constructor(element: any, options: PlayerInterfaceConfig, tran: TranInterface) {
    this.container = element
    this.init(element, options, tran)
  }

  init(element: any, options: PlayerInterfaceConfig, tran: TranInterface) {
    const { video, preload, screenshot, logo, theme } = options
    this.createDom({ element, label: 'div', className: 'dplayer-mask' })
    this.videoWrap = this.createDom({ element, label: 'div', className: 'dplayer-video-wrap' })
    if (video) {
      const { url = '', pic } = video
      this.video = this.createDom({
        element: this.videoWrap,
        label: 'video',
        className: 'dplayer-video dplayer-video-current',
        url
      })
      this.video.setAttribute('webkit-playsinline', true)
      this.video.setAttribute('playsinline', true)
      if (pic) {
        this.video.setAttribute('poster', pic)
      }
      if (screenshot) {
        this.video.setAttribute('crossorigin', 'anonymous')
      }
      if (preload) {
        this.video.setAttribute('preload', preload)
      }
    }
    if (logo) {
      let playerLogo = this.createDom({
        element: this.videoWrap,
        label: 'div',
        className: 'dplayer-logo'
      })
      this.createDom({ element: playerLogo, label: 'img', url: logo })
    }
    this.controllerMask = this.createDom({
      element,
      label: 'div',
      className: 'dplayer-controller-mask'
    })
    this.controller = this.createDom({ element, label: 'div', className: 'dplayer-controller' })

    const controllerLeft = this.createDom({
      element: this.controller,
      label: 'div',
      className: 'dplayer-icons dplayer-icons-left'
    })
    this.playButton = this.createDom({
      element: controllerLeft,
      label: 'button',
      className: 'dplayer-icon dplayer-play-icon'
    })
    this.createDom({ element: this.playButton, label: 'span', className: 'iconfont iconplay' })

    this.volumeButton = this.createDom({
      element: controllerLeft,
      label: 'div',
      className: 'dplayer-volume'
    })
    this.volumeButtonIcon = this.createDom({
      element: this.volumeButton,
      label: 'button',
      className: 'dplayer-icon dplayer-volume-icon'
    })
    this.volumeIcon = this.createDom({
      element: this.volumeButtonIcon,
      label: 'span',
      className: 'dplayer-icon-content'
    })
    this.createDom({ element: this.volumeIcon, label: 'span', className: 'iconfont iconvolume-up' })
    this.volumeBarWrapWrap = this.createDom({
      element: this.volumeButton,
      label: 'div',
      className: 'dplayer-volume-bar-wrap'
    })
    this.volumeBarWrapWrap.setAttribute('data-balloon-pos', 'up')
    this.volumeBarWrap = this.createDom({
      element: this.volumeBarWrapWrap,
      label: 'div',
      className: 'dplayer-volume-bar'
    })
    this.volumeBar = this.createDom({
      element: this.volumeBarWrap,
      label: 'div',
      className: 'dplayer-volume-bar-inner',
      styles: `background:${theme}`
    })
    this.createDom({
      element: this.volumeBar,
      label: 'span',
      className: 'dplayer-thumb',
      styles: `background:${theme}`
    })

    const playerTime = this.createDom({
      element: controllerLeft,
      label: 'span',
      className: 'dplayer-time'
    })
    this.ptime = this.createDom({
      element: playerTime,
      label: 'span',
      className: 'dplayer-ptime',
      text: '0:00'
    })
    this.createDom({ element: playerTime, label: 'span', text: ' / ' })
    this.dtime = this.createDom({
      element: playerTime,
      label: 'span',
      className: 'dplayer-dtime',
      text: '0:00'
    })

    const controllerRight = this.createDom({
      element: this.controller,
      label: 'div',
      className: 'dplayer-icons dplayer-icons-right'
    })
    const playerFull = this.createDom({
      element: controllerRight,
      label: 'div',
      className: 'dplayer-full'
    })
    this.browserFullButton = this.createDom({
      element: playerFull,
      label: 'button',
      className: 'dplayer-icon dplayer-full-icon'
    })
    const playerFullButIco = this.createDom({
      element: this.browserFullButton,
      label: 'span',
      className: 'dplayer-icon-content'
    })
    this.createDom({ element: playerFullButIco, label: 'span', className: 'iconfont iconfull' })
    this.playedBarWrap = this.createDom({
      element: this.controller,
      label: 'div',
      className: 'dplayer-bar-wrap'
    })

    this.playedBarTime = this.createDom({
      element: this.playedBarWrap,
      label: 'div',
      className: 'dplayer-bar-time hidden',
      text: '00:00'
    })
    this.createDom({ element: this.playedBarWrap, label: 'div', className: 'dplayer-bar-preview' })
    const playerBar = this.createDom({
      element: this.playedBarWrap,
      label: 'div',
      className: 'dplayer-bar'
    })
    this.loadedBar = this.createDom({
      element: playerBar,
      label: 'div',
      className: 'dplayer-loaded',
      styles: 'width: 0'
    })
    this.playedBar = this.createDom({
      element: playerBar,
      label: 'div',
      className: 'dplayer-played',
      styles: `width: 0; background: ${theme}`
    })
    this.createDom({
      element: this.playedBar,
      label: 'span',
      className: 'dplayer-thumb',
      styles: `background: ${theme}`
    })
    this.createDom({ element, label: 'div', className: 'dplayer-notice' })
  }

  createDom(params: createDomParams): any {
    const { label, className, element, url, styles, text } = params
    const createEle = document.createElement(label)
    createEle.className = className!
    element.appendChild(createEle)
    if (url) {
      createEle.setAttribute('src', url)
    }
    if (styles) {
      createEle.setAttribute('style', styles)
    }
    if (text) {
      createEle.innerHTML = text
    }
    return createEle
  }
}
