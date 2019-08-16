export type Lang = 'en' | 'zh-cn' | 'zh-tw'

export interface TranTxt {
  'zh-cn': any
  'zh-tw': any

  [propName: string]: any
}

export interface TranInterface {
  (text: string): string
}

export interface I18nInterface {
  lang: Lang
  tran(text: string): string
}
