import { PlayerOnCallBack } from './player'

export interface EventsInterface {
  events: any
  videoEvents: string[]
  playerEvents: string[]

  on(name: string, callBack: PlayerOnCallBack): void
  trigger(name: string, info: any): void

  type(name: string): string | null
}
