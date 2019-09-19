import Utils from '../helpers/utils'
import { DanmakuOption, DataInterface } from '../type/danmaku'
import { EventsInterface } from '../type/events'

class Danmaku {
  options: DanmakuOption
  container: HTMLElement
  danIndex: number
  dan: DataInterface[]
  paused: boolean
  showing: boolean
  events: EventsInterface
  danTunnel: any
  context?: CanvasRenderingContext2D | null

  constructor(options: DanmakuOption) {
    this.options = options
    this.container = this.options.container
    this.danIndex = 0
    this.dan = options.data
    this.showing = true
    this.paused = true
    this.events = this.options.events
    this._measure('')

    window.requestAnimationFrame(() => {
      this.frame()
    })
  }

  frame() {
    if (this.dan.length && !this.paused && this.showing) {
      let item = this.dan[this.danIndex]
      const dan: any[] = []
      while (item && this.options.time() > parseFloat((item as any).time)) {
        dan.push(item)
        item = this.dan[++this.danIndex]
      }
      this.draw(dan)
    }
    window.requestAnimationFrame(() => {
      this.frame()
    })
  }
  draw(dan: any) {
    if (this.showing) {
      const itemHeight = this.options.height
      const danWidth = this.container.offsetWidth
      const danHeight = this.container.offsetHeight
      const itemY = parseInt(danHeight / itemHeight + '')

      const danItemRight = (ele: HTMLElement) => {
        const eleWidth = ele.offsetWidth || parseInt(ele.style.width!)
        const eleRight =
          ele.getBoundingClientRect().right ||
          this.container.getBoundingClientRect().right + eleWidth
        return this.container.getBoundingClientRect().right - eleRight
      }

      const danSpeed = (width: number) => (danWidth + width) / 5

      const getTunnel = (ele: HTMLElement, type: string, width?: number) => {
        const tmp = danWidth / danSpeed(width!)

        for (let i = 0; i < itemY; i++) {
          const item = this.danTunnel[type][i + '']
          if (item && item.length) {
            if (type !== 'right') {
              continue
            }
            for (let j = 0; j < item.length; j++) {
              const danRight = danItemRight(item[j]) - 10
              if (
                danRight <= danWidth - tmp * danSpeed(parseInt(item[j].style.width)) ||
                danRight <= 0
              ) {
                break
              }
              if (j === item.length - 1) {
                this.danTunnel[type][i + ''].push(ele)
                ele.addEventListener('animationend', () => {
                  this.danTunnel[type][i + ''].splice(0, 1)
                })
                return i % itemY
              }
            }
          } else {
            this.danTunnel[type][i + ''] = [ele]
            ele.addEventListener('animationend', () => {
              this.danTunnel[type][i + ''].splice(0, 1)
            })
            return i % itemY
          }
        }
        return -1
      }

      if (Object.prototype.toString.call(dan) !== '[object Array]') {
        dan = [dan]
      }

      const docFragment = document.createDocumentFragment()

      for (let i = 0; i < dan.length; i++) {
        dan[i].type = Utils.number2Type(dan[i].type)
        if (!dan[i].color) {
          dan[i].color = 16777215
        }
        const item = document.createElement('div')
        item.classList.add('dplayer-danmaku-item')
        item.classList.add(`dplayer-danmaku-${dan[i].type}`)
        if (dan[i].border) {
          item.innerHTML = `<span style="border:${dan[i].border}">${dan[i].text}</span>`
        } else {
          item.innerHTML = dan[i].text
        }
        item.style.color = Utils.number2Color(dan[i].color)
        item.addEventListener('animationend', () => {
          this.container.removeChild(item)
        })

        const itemWidth = this._measure(dan[i].text)
        let tunnel: number
        // adjust
        switch (dan[i].type) {
          case 'right':
            tunnel = getTunnel(item, dan[i].type, itemWidth)
            console.log(tunnel)
            if (tunnel >= 0) {
              item.style.width = itemWidth + 1 + 'px'
              item.style.top = itemHeight * tunnel + 'px'
              item.style.transform = `translateX(-${danWidth}px)`
            }
            break
          case 'top':
            tunnel = getTunnel(item, dan[i].type)
            if (tunnel >= 0) {
              item.style.top = itemHeight * tunnel + 'px'
            }
            break
          case 'bottom':
            tunnel = getTunnel(item, dan[i].type)
            if (tunnel >= 0) {
              item.style.bottom = itemHeight * tunnel + 'px'
            }
            break
          default:
            console.error(`Can't handled danmaku type: ${dan[i].type}`)
        }

        if (tunnel! >= 0) {
          // move
          item.classList.add('dplayer-danmaku-move')

          // insert
          docFragment.appendChild(item)
        }
      }

      this.container.appendChild(docFragment)

      return docFragment
    }
  }
  seek() {
    this.clear()
    for (let i = 0; i < this.dan.length; i++) {
      if ((this.dan[i] as any).time >= this.options.time()) {
        this.danIndex = i
        break
      }
      this.danIndex = this.dan.length
    }
  }
  clear() {
    this.danTunnel = {
      right: {},
      top: {},
      bottom: {}
    }
    this.danIndex = 0
    this.options.container.innerHTML = ''

    this.events && this.events.trigger('danmaku_clear')
  }
  play() {
    this.paused = false
  }

  pause() {
    this.paused = true
  }

  resize() {
    const danWidth = this.container.offsetWidth
    const items = this.container.getElementsByClassName('dplayer-danmaku-item')
    for (let i = 0; i < items.length; i++) {
      ;(items[i] as HTMLElement).style.transform = `translateX(-${danWidth}px)`
    }
  }

  hide() {
    this.showing = false
    this.pause()
    this.clear()

    this.events && this.events.trigger('danmaku_hide')
  }

  show() {
    this.seek()
    this.showing = true
    this.play()

    this.events && this.events.trigger('danmaku_show')
  }
  _measure(text: string) {
    if (!this.context) {
      const measureStyle = getComputedStyle(
        this.container.getElementsByClassName('dplayer-danmaku-item')[0],
        null
      )
      this.context = document.createElement('canvas').getContext('2d')
      this.context!.font = measureStyle.getPropertyValue('font')
    }
    return this.context!.measureText(text).width
  }
}

export default Danmaku
