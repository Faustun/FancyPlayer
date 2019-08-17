import { PlayerInterfaceConfig, interfaceQuality } from '../type/options'
import { PlayerInterface } from '../type/player'
import { TranInterface } from '../type/i18n'
import { EventsInterface, PlayerOnCallBack } from '../type/events'
import { UserInterface } from '../type/user'
import handleOption from './options'
import I18n from './i18n'
import Events from './events'
import User from './user'
import Utils from '../helpers/utils'
import Dom from './dom'
import Bar from './bar'
import FullScreen from './fullscreen'

export default class TPlayer implements PlayerInterface {
  options: PlayerInterfaceConfig
  qualityVideo?: interfaceQuality
  qualityIndex?: number
  tran: TranInterface
  events: EventsInterface
  user: UserInterface
  container: any
  arrow: boolean
  dom: any
  video: any
  bar: any
  fullScreen: any
  controller: any

  constructor(options: PlayerInterfaceConfig) {
    this.options = handleOption(options)
    if (this.options.video.quality) {
      this.qualityIndex = this.options.video.defaultQuality!
      this.qualityVideo = this.options.video.quality[this.qualityIndex]
    }
    this.tran = new I18n(this.options.lang!).tran
    this.events = new Events()
    this.user = new User(this)

    this.container = this.options.container

    this.container.classList.add('dplayer')
    if (!this.options.danmaku) {
      this.container.classList.add('dplayer-no-danmaku')
    }
    if (this.options.live) {
      this.container.classList.add('dplayer-live')
    }
    if (Utils.isMobile) {
      this.container.classList.add('dplayer-mobile')
    }
    this.arrow = this.container.offsetWidth <= 500
    if (this.arrow) {
      this.container.classList.add('dplayer-arrow')
    }

    this.dom = new Dom(this.container, options, this.tran)

    this.video = this.dom.video

    this.bar = new Bar(this.dom)

    this.fullScreen = new FullScreen(this)
  }

  on(name: string, callback: PlayerOnCallBack) {
    this.events.on(name, callback)
  }
  resize() {
    if (this.controller.thumbnails) {
      this.controller.thumbnails.resize(
        160,
        (this.video.videoHeight / this.video.videoWidth) * 160,
        this.dom.playedBarWrap.offsetWidth
      )
    }
    this.events.trigger('resize')
  }
}
