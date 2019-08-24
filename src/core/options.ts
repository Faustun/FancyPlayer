import { PlayerInterfaceConfig } from '../type/options'

export default (options: PlayerInterfaceConfig): PlayerInterfaceConfig => {
  // default options
  const defaultOption: PlayerInterfaceConfig = {
    container: options.container || document.getElementsByClassName('dplayer')[0],
    live: false,
    autoplay: false,
    theme: '#4588bf',
    loop: false,
    lang: 'zh-cn',
    screenshot: false,
    hotkey: true,
    preload: 'metadata',
    volume: 0.7,
    apiBackend: 'defaultApiBackend',
    video: { url: '' },
    mutex: true
  }

  for (const defaultKey in defaultOption) {
    if (defaultOption.hasOwnProperty(defaultKey) && !options.hasOwnProperty(defaultKey)) {
      options[defaultKey] = defaultOption[defaultKey]
    }
  }
  if (options.video) {
    !options.video.type && (options.video.type = 'auto')
  }
  if (typeof options.danmaku === 'object' && options.danmaku) {
    !options.danmaku.user && (options.danmaku.user = 'DIYgod')
  }
  if (options.subtitle) {
    !options.subtitle.type && (options.subtitle.type = 'webvtt')
    !options.subtitle.fontSize && (options.subtitle.fontSize = '20px')
    !options.subtitle.bottom && (options.subtitle.bottom = '40px')
    !options.subtitle.color && (options.subtitle.color = '#fff')
  }

  if (options.video.quality) {
    options.video.url = options.video.quality[options.video.defaultQuality!].url
  }
  return options
}
