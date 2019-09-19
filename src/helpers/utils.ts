import { ScrollPosition, IDomClassList } from '../type/utils'
import { CharCode } from './charCode'

const _manualClassList = new (class implements IDomClassList {
  private _lastStart?: number
  private _lastEnd?: number

  private _findClassName(node: HTMLElement, className: string): void {
    let classes = node.className
    if (!classes) {
      this._lastStart = -1
      return
    }

    className = className.trim()

    let classesLen = classes.length
    let classLen = className.length

    if (classLen === 0) {
      this._lastStart = -1
      return
    }

    if (classesLen < classLen) {
      this._lastStart = -1
      return
    }

    if (classes === className) {
      this._lastStart = 0
      this._lastEnd = classesLen
      return
    }

    let idx = -1
    let idxEnd: number

    // tslint:disable-next-line
    while ((idx = classes.indexOf(className, idx + 1)) >= 0) {
      idxEnd = idx + classLen

      // a class that is followed by another class
      if (
        (idx === 0 || classes.charCodeAt(idx - 1) === CharCode.Space) &&
        classes.charCodeAt(idxEnd) === CharCode.Space
      ) {
        this._lastStart = idx
        this._lastEnd = idxEnd + 1
        return
      }

      // last class
      if (idx > 0 && classes.charCodeAt(idx - 1) === CharCode.Space && idxEnd === classesLen) {
        this._lastStart = idx - 1
        this._lastEnd = idxEnd
        return
      }

      // equal - duplicate of cmp above
      if (idx === 0 && idxEnd === classesLen) {
        this._lastStart = 0
        this._lastEnd = idxEnd
        return
      }
    }

    this._lastStart = -1
  }

  hasClass(node: HTMLElement, className: string): boolean {
    this._findClassName(node, className)
    return this._lastStart !== -1
  }

  addClasses(node: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(nameValue => nameValue.split(' ').forEach(name => this.addClass(node, name)))
  }

  addClass(node: HTMLElement, className: string): void {
    if (!node.className) {
      // doesn't have it for sure
      node.className = className
    } else {
      this._findClassName(node, className) // see if it's already there
      if (this._lastStart === -1) {
        node.className = node.className + ' ' + className
      }
    }
  }

  removeClass(node: HTMLElement, className: string): void {
    this._findClassName(node, className)
    if (this._lastStart === -1) {
      return // Prevent styles invalidation if not necessary
    } else {
      node.className =
        node.className.substring(0, this._lastStart) + node.className.substring(this._lastEnd!)
    }
  }

  removeClasses(node: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(nameValue =>
      nameValue.split(' ').forEach(name => this.removeClass(node, name))
    )
  }

  toggleClass(node: HTMLElement, className: string, shouldHaveIt?: boolean): void {
    this._findClassName(node, className)
    if (this._lastStart !== -1 && (shouldHaveIt === undefined || !shouldHaveIt)) {
      this.removeClass(node, className)
    }
    if (this._lastStart === -1 && (shouldHaveIt === undefined || shouldHaveIt)) {
      this.addClass(node, className)
    }
  }
})()

const _nativeClassList = new (class implements IDomClassList {
  hasClass(node: HTMLElement, className: string): boolean {
    return Boolean(className) && node.classList && node.classList.contains(className)
  }

  addClasses(node: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(nameValue => nameValue.split(' ').forEach(name => this.addClass(node, name)))
  }

  addClass(node: HTMLElement, className: string): void {
    if (className && node.classList) {
      node.classList.add(className)
    }
  }

  removeClass(node: HTMLElement, className: string): void {
    if (className && node.classList) {
      node.classList.remove(className)
    }
  }

  removeClasses(node: HTMLElement, ...classNames: string[]): void {
    classNames.forEach(nameValue =>
      nameValue.split(' ').forEach(name => this.removeClass(node, name))
    )
  }

  toggleClass(node: HTMLElement, className: string, shouldHaveIt?: boolean): void {
    if (node.classList) {
      node.classList.toggle(className, shouldHaveIt)
    }
  }
})()

class Utils {
  static isIE = navigator.userAgent.indexOf('Trident') >= 0
  static isChrome = navigator.userAgent.indexOf('Chrome') >= 0
  static isFirefox = navigator.userAgent.indexOf('Firefox') >= 0
  static isMobile =
    navigator.userAgent.indexOf('Android') >= 0 ||
    navigator.userAgent.indexOf('Adr') >= 0 ||
    !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

  static storage = {
    set(key: string, value: any): void {
      localStorage.setItem(key, value)
    },
    get(key: string): any {
      return localStorage.getItem(key)
    }
  }

  static classList: IDomClassList = Utils.isIE ? _manualClassList : _nativeClassList

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

  static getBoundingClientRectViewLeftOrTop(element: HTMLElement, direction: string): number {
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
      const rect = element.getBoundingClientRect() as any
      const offset = Utils.offset

      return rect[direction] + offset
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
      !(document as any).mozFullScreenElement &&
      !(document as any).webkitFullscreenElement
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
  static number2Color(num: number) {
    return '#' + ('00000' + num.toString(16)).slice(-6)
  }

  static number2Type(num: number) {
    switch (num) {
      case 0:
        return 'right'
      case 1:
        return 'top'
      case 2:
        return 'bottom'
      default:
        return 'right'
    }
  }
}

export default Utils
