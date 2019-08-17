import TPlayer from './core/player'
import { PlayerInterface } from './type/player'
import { PlayerInterfaceConfig } from './type/options'

export default function Player(config: PlayerInterfaceConfig): PlayerInterface {
  const context = new TPlayer(config)
  return context
}
