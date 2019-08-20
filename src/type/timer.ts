import { PlayerInterface } from './player'

export interface TimerInterface {
  player: PlayerInterface
  types: string[]
  infoChecker?: number
  loadingChecker?: number
  enableloadingChecker?: boolean

  init(): void
  initloadingChecker(): void
  // initfpsChecker(): void
  initinfoChecker(): void
  enable(type: string): void
  disable(type: string): void
  destroy(): void
}
