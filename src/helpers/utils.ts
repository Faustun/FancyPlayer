import { ScrollPosition } from '../type/utils'

export default class Utils {
  static storage = {
    set(key: string, value: any): void {
      localStorage.setItem(key, value)
    },
    get(key: string): any {
      return localStorage.getItem(key)
    }
  }

  static isMobile = /mobile/i.test(window.navigator.userAgent)
  static isFirefox = /firefox/i.test(window.navigator.userAgent)
  static isChrome = /chrome/i.test(window.navigator.userAgent)

  static nameMap = {
    dragStart: Utils.isMobile ? 'touchstart' : 'mousedown',
    dragMove: Utils.isMobile ? 'touchmove' : 'mousemove',
    dragEnd: Utils.isMobile ? 'touchend' : 'mouseup'
  }
  static offset: number | undefined
  /**
   * Parse second to time string
   *
   * @param {Number} second
   * @return {String} 00:00 or 00:00:00
   */
  static secondToTime(second: number): string {
    const add0 = (num: number) => (num < 10 ? '0' + num : '' + num)
    const hour = Math.floor(second / 3600)
    const min = Math.floor((second - hour * 3600) / 60)
    const sec = Math.floor(second - hour * 3600 - min * 60)
    return (hour > 0 ? [hour, min, sec] : [min, sec]).map(add0).join(':')
  }

  static getScrollPosition(): ScrollPosition {
    return {
      left:
        window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
      top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    }
  }
  static setScrollPosition(lastScrollPosition: ScrollPosition): void {
    const { left = 0, top = 0 } = lastScrollPosition
    if (Utils.isFirefox) {
      document.documentElement.scrollLeft = left
      document.documentElement.scrollTop = top
    } else {
      window.scrollTo(left, top)
    }
  }

  static getBoundingClientRectViewLeft(element: HTMLElement): number {
    const scrollTop =
      window.scrollY ||
      window.pageYOffset ||
      document.body.scrollTop +
        ((document.documentElement && document.documentElement.scrollTop) || 0)

    if (element.getBoundingClientRect) {
      if (typeof Utils.offset !== 'number') {
        let temp = document.createElement('div') as HTMLElement | null
        temp!.style.cssText = 'position:absolute;top:0;left:0;'
        document.body.appendChild(temp!)
        Utils.offset = -temp!.getBoundingClientRect().top - scrollTop
        document.body.removeChild(temp!)
        temp = null
      }
      const rect = element.getBoundingClientRect()
      const offset = Utils.offset

      return rect.left + offset
    } else {
      // not support getBoundingClientRect
      return Utils.getElementViewLeft(element)
    }
  }
  static getElementViewLeft(element: HTMLElement): number {
    let actualLeft = element.offsetLeft
    let current = element.offsetParent as HTMLElement
    const elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      while (current !== null) {
        actualLeft += current.offsetLeft
        current = current.offsetParent as HTMLElement
      }
    } else {
      while (current !== null && current !== element) {
        actualLeft += current.offsetLeft
        current = current.offsetParent as HTMLElement
      }
    }
    return actualLeft - elementScrollLeft
  }
  static cumulativeOffset(element: HTMLElement) {
    let top: number = 0
    let left: number = 0
    do {
      top += element.offsetTop || 0
      left += element.offsetLeft || 0
      element = element.offsetParent as HTMLElement
    } while (element)

    return {
      top: top,
      left: left
    }
  }
}
