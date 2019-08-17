import { PlayerInterface } from '../type/player'

export default class FullScreen {
  player: PlayerInterface

  constructor(player: PlayerInterface) {
    this.player = player

    this.player.events.on('webfullscreen', () => {
      this.player.resize()
    })
    this.player.events.on('webfullscreen_cancel', () => {
      this.player.resize()
      utils.setScrollPosition(this.lastScrollPosition)
    })

    const fullscreenchange = () => {
      this.player.resize()
      if (this.isFullScreen('browser')) {
        this.player.events.trigger('fullscreen')
      } else {
        utils.setScrollPosition(this.lastScrollPosition)
        this.player.events.trigger('fullscreen_cancel')
      }
    }
    const docfullscreenchange = () => {
      const fullEle =
        document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
      if (fullEle && fullEle !== this.player.container) {
        return
      }
      this.player.resize()
      if (fullEle) {
        this.player.events.trigger('fullscreen')
      } else {
        utils.setScrollPosition(this.lastScrollPosition)
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
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        )
      case 'web':
        return this.player.container.classList.contains('dplayer-fulled')
    }
  }
}
