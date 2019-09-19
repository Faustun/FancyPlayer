import { EventsInterface } from './events'

export interface DanmakuOption {
  container: HTMLElement
  events: EventsInterface
  height: number
  data: DataInterface[]
  time(): number
}

export interface DataInterface {
  author: string
  color: number
  text: string
  time: number
  type: number
}

export interface ApiInterface {
  id: string
  address: string
  token: string
  user?: string
  addition: string[]
}

export interface CallbackInterface {
  (text: string): string
}
