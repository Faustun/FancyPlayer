import { PlayerInterfaceConfig, InterfaceQuality } from './options'
import { TranInterface } from './i18n'
import { UserInterface } from './user'
import { EventsInterface, PlayerOnCallBack } from './events'
import { DomInterface } from './dom'

export interface PlayerInterface {
  bar: any
  timer: any
  controller: any
  paused?: boolean
  fullScreen: any
  // subtitle: any;
  // setting: any;
  // comment: any;
  options: PlayerInterfaceConfig
  tran: TranInterface
  qualityVideo?: InterfaceQuality
  qualityIndex?: number
  user: UserInterface
  container: HTMLElement
  arrow: boolean
  events: EventsInterface
  video: HTMLElement
  dom: DomInterface
  noticeTime: any
  focus?: boolean

  resize(): void
  play(): void
  pause(): void
  seek(time: number): void
  speed(rate: string): void
  toggle(): void
  on(name: string, callback: PlayerOnCallBack): void
  volume(percentage?: number, nostorage?: boolean, nonotice?: boolean): number
  notice(text: string, time: number, opacity: number): void
  switchVolumeIcon(): void
  // switchQuality(index: any)
  // switchVideo(): void
}
