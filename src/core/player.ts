import { PlayerInterfaceConfig, interfaceQuality } from '../type/options'
import { PlayerInterface } from '../type/player'
import { TranInterface } from '../type/i18n'
import { EventsInterface } from '../type/events'
import { UserInterface } from '../type/user'
import handleOption from './options'
import I18n from './i18n'
import Events from './events'
import User from './user'
import Utils from '../helpers/utils'
import Dom from './dom'

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
  }
}
