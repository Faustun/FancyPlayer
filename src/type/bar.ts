export interface Elements {
  volume: any
  played: any
  loaded: any

  [propName: string]: any
}

export interface BarInterface {
  elements: Elements

  set(type: string, percentage: number, direction: string): void
  get(type: string, direction?: string): number
}
