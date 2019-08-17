export interface UserInterface {
  storageName: UserStorage
  default: UserStorage
  data: UserStorage

  init(): void
  get(key: string): number
  set(key: string, value: any): void
}

export interface UserStorage {
  opacity?: string | number
  volume?: string | number
  unlimited?: string | number
  danmaku?: string | number
  subtitle?: string | number

  [propName: string]: any
}
