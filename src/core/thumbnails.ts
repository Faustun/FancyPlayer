import { EventsInterface } from '../type/events'
import { OptionsInterface } from '../type/thumbanails'

export default class Thumbnails {
  container: HTMLElement
  barWidth: number
  events: EventsInterface
  constructor(options: OptionsInterface) {
    this.container = options.container
    this.barWidth = options.barWidth
    this.container.style.backgroundImage = `url('${options.url}')`
    this.events = options.events
  }

  resize(width: number, height: number, barWrapWidth: number): void {
    this.container.style.width = `${width}px`
    this.container.style.height = `${height}px`
    this.container.style.top = `${-height + 2}px`
    this.barWidth = barWrapWidth
  }

  show() {
    this.container.style.display = 'block'
    this.events && this.events.trigger('thumbnails_show')
  }

  move(position: number) {
    this.container.style.backgroundPosition = `-${(Math.ceil((position / this.barWidth) * 100) -
      1) *
      160}px 0`
    this.container.style.left = `${Math.min(
      Math.max(position - this.container.offsetWidth / 2, -10),
      this.barWidth - 150
    )}px`
  }

  hide() {
    this.container.style.display = 'none'

    this.events && this.events.trigger('thumbnails_hide')
  }
}
