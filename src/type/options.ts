import { Lang } from './i18n'
export type Type = 'auto' | 'hls' | 'flv' | 'dash' | 'webtorrent' | 'normal'
export type Preload = 'none' | 'metadata' | 'auto'

export interface PlayerInterfaceConfig {
  container: object
  video: PlayerConfigVideo
  live?: boolean
  autoplay?: boolean
  theme?: string
  loop?: boolean
  lang?: Lang
  screenshot?: boolean
  hotkey?: boolean
  preload?: Preload
  volume?: number
  logo?: string
  apiBackend?: string
  mutex?: boolean

  [propName: string]: any
}

export interface PlayerConfigVideo {
  url: string
  quality?: interfaceQuality[]
  defaultQuality?: number
  pic?: string
  thumbnails?: string
  type?: Type
  customType?: string
}

export interface interfaceQuality {
  name: string
  url: string
  type: string
}
