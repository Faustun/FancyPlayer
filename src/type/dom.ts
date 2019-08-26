import { TranInterface } from './i18n'
import { PlayerInterfaceConfig } from './options'

export interface createDomParams {
  ele: any
  label: string
  className?: string
  url?: string
  styles?: string
  text?: string
  html?: string
  poster?: string
  preload?: string
  screenshot?: boolean
  playsinline?: string
  webkitPlaysinline?: string
}

export interface DomInterface {
  container: HTMLElement
  volumeBar: HTMLElement
  volumeBarWrap: HTMLElement
  volumeBarWrapWrap: HTMLElement
  volumeButton: HTMLElement
  volumeButtonIcon: HTMLElement
  volumeIcon: HTMLElement
  loadedBar: HTMLElement
  playedBar: HTMLElement
  playedBarWrap: HTMLElement
  playedBarTime: HTMLElement
  video: HTMLVideoElement
  playButton: HTMLElement
  playButtonIco: HTMLElement
  videoWrap: HTMLElement
  controllerMask: HTMLElement
  ptime: HTMLElement
  dtime: HTMLElement
  controller: HTMLElement
  browserFullButton: HTMLElement
  webFullButton: HTMLElement
  notice: HTMLElement
  volumeIconFont: HTMLElement
  playedBarPreview: HTMLElement
  bezelIconBox: HTMLElement
  bezelIcon: HTMLElement
  loadingIcon: HTMLElement
  playFast: HTMLElement
  playRetreat: HTMLElement
  doubleSpeed: HTMLElement
  doubleSpeedPopup: HTMLElement

  init(element: HTMLElement, options: PlayerInterfaceConfig, tran: TranInterface): void
  createDom(params: createDomParams): any
}
