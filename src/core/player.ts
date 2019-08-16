import { PlayerInterfaceConfig, interfaceQuality } from '../type/options'
import { PlayerInterface } from '../type'
import { TranInterface } from '../type/i18n'
import { EventsInterface } from '../type/events'
import handleOption from './options'
import I18n from './i18n'
import Events from './events'

export default class TPlayer implements PlayerInterface {
  options: PlayerInterfaceConfig
  qualityVideo?: interfaceQuality
  qualityIndex?: number
  tran: TranInterface
  events: EventsInterface

  constructor(options: PlayerInterfaceConfig) {
    this.options = handleOption(options)
    if (this.options.video.quality) {
      this.qualityIndex = this.options.video.defaultQuality!
      this.qualityVideo = this.options.video.quality[this.qualityIndex]
    }
    this.tran = new I18n(this.options.lang!).tran
    this.events = new Events()
  }
}
