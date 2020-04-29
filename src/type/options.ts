import { Lang } from './i18n'
export type Type = 'auto' | 'hls' | 'flv' | 'dash' | 'webtorrent' | 'normal'
export type Preload = 'none' | 'metadata' | 'auto'

export interface PlayerInterfaceConfig {
  container: HTMLElement
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
  highlight?: InterfaceHighlight[]

  [propName: string]: any
}

export interface PlayerConfigVideo {
  url: string
  quality?: InterfaceQuality[]
  defaultQuality?: number
  pic?: string
  thumbnails?: string
  type?: Type
  customType?: any
}

export interface InterfaceHighlight {
  fileType: number
  label?: string
  thumbnail?: string
  time?: number

  [propName: string]: any
}

export interface InterfaceQuality {
  name: string
  url: string
  type: string
}

export interface InterfaceHighlights {
  time: number
  label?: string
}
