import { PlayerInterface } from '../type/player'
import { ScrollPosition } from '../type/utils'
import Utils from '../helpers/utils'

export default class FullScreen {
  player: PlayerInterface
  lastScrollPosition?: ScrollPosition

  constructor(player: PlayerInterface) {
    this.player = player

    this.player.events.on('webfullscreen', () => {
      this.player.resize()
    })
    this.player.events.on('webfullscreen_cancel', () => {
      this.player.resize()
      Utils.setScrollPosition(this.lastScrollPosition!)
    })

    const fullscreenchange = () => {
      this.player.resize()
      if (this.isFullScreen('browser')) {
        this.player.events.trigger('fullscreen')
      } else {
        Utils.setScrollPosition(this.lastScrollPosition!)
        this.player.events.trigger('fullscreen_cancel')
      }
    }
    const docfullscreenchange = () => {
      const fullEle =
        document.fullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      if (fullEle && fullEle !== this.player.container) {
        return
      }
      this.player.resize()
      if (fullEle) {
        this.player.events.trigger('fullscreen')
      } else {
        Utils.setScrollPosition(this.lastScrollPosition!)
        this.player.events.trigger('fullscreen_cancel')
      }
    }
    if (/Firefox/.test(navigator.userAgent)) {
      document.addEventListener('mozfullscreenchange', docfullscreenchange)
      document.addEventListener('fullscreenchange', docfullscreenchange)
    } else {
      this.player.container.addEventListener('fullscreenchange', fullscreenchange)
      this.player.container.addEventListener('webkitfullscreenchange', fullscreenchange)
      document.addEventListener('msfullscreenchange', docfullscreenchange)
      document.addEventListener('MSFullscreenChange', docfullscreenchange)
    }
  }

  isFullScreen(type = 'browser') {
    switch (type) {
      case 'browser':
        return (
          document.fullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).msFullscreenElement
        )
      case 'web':
        return Utils.classList.hasClass(this.player.container, 'dplayer-fulled')
    }
  }

  request(type = 'browser') {
    const anotherType = type === 'browser' ? 'web' : 'browser'
    const anotherTypeOn = this.isFullScreen(anotherType)
    if (!anotherTypeOn) {
      this.lastScrollPosition = Utils.getScrollPosition()
    }

    switch (type) {
      case 'browser':
        if (this.player.container.requestFullscreen) {
          this.player.container.requestFullscreen()
        } else if ((this.player.container as any).mozRequestFullScreen) {
          ;(this.player.container as any).mozRequestFullScreen()
        } else if ((this.player.container as any).webkitRequestFullscreen) {
          ;(this.player.container as any).webkitRequestFullscreen()
        } else if ((this.player.video as any).webkitEnterFullscreen) {
          // Safari for iOS
          ;(this.player.video as any).webkitEnterFullscreen()
        } else if ((this.player.video as any).webkitEnterFullScreen) {
          ;(this.player.video as any).webkitEnterFullScreen()
        } else if ((this.player.container as any).msRequestFullscreen) {
          ;(this.player.container as any).msRequestFullscreen()
        }
        break
      case 'web':
        Utils.classList.addClass(this.player.container, 'dplayer-fulled')
        Utils.classList.addClass(document.body, 'dplayer-web-fullscreen-fix')
        this.player.events.trigger('webfullscreen')
        break
    }

    if (anotherTypeOn) {
      this.cancel(anotherType)
    }
  }

  cancel(type = 'browser') {
    switch (type) {
      case 'browser':
        if ((document as any).cancelFullScreen) {
          ;(document as any).cancelFullScreen()
        } else if ((document as any).mozCancelFullScreen) {
          ;(document as any).mozCancelFullScreen()
        } else if ((document as any).webkitCancelFullScreen) {
          ;(document as any).webkitCancelFullScreen()
        } else if ((document as any).webkitCancelFullscreen) {
          ;(document as any).webkitCancelFullscreen()
        } else if ((document as any).msCancelFullScreen) {
          ;(document as any).msCancelFullScreen()
        } else if ((document as any).msExitFullscreen) {
          ;(document as any).msExitFullscreen()
        }
        break
      case 'web':
        Utils.classList.removeClass(this.player.container, 'dplayer-fulled')
        Utils.classList.removeClass(document.body, 'dplayer-web-fullscreen-fix')
        this.player.events.trigger('webfullscreen_cancel')
        break
    }
  }

  toggle(type = 'browser') {
    if (this.isFullScreen(type)) {
      this.cancel(type)
    } else {
      this.request(type)
    }
  }
}
