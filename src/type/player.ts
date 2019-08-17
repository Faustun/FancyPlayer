import { PlayerInterfaceConfig, interfaceQuality } from './options'
import { TranInterface } from './i18n'
import { UserInterface } from './user'

export interface PlayerInterface {
  options: PlayerInterfaceConfig
  tran: TranInterface
  qualityVideo?: interfaceQuality
  qualityIndex?: number
  user: UserInterface
  container: any
  arrow: boolean

  // play(): void
  // pause(): void
  // seek(time: number): void
  // toggle(): void
  // on(name: string, callback: PlayerOnCallBack): void
  // switchVideo(): void
}

export interface PlayerOnCallBack {
  (): void
}
