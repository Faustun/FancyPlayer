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
}
