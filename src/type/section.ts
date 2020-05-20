/*
 * @Author: your name
 * @Date: 2020-04-07 18:07:05
 * @LastEditTime: 2020-05-20 14:36:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \FancyPlayer\src\type\section.ts
 */
import { PlayerInterface } from './player'

export interface Coordinate {
  x: number
  y: number

  [propName: string]: any
}

export interface highlightInterface {
  time: number
  thumbnail: string
}

export interface SectionInterface {
  player: PlayerInterface
  isDrag: boolean
  cacheY: number
  currentY: number

  initSections(): void
  getMinDistance(): number
  followPlaySlide(element: HTMLElement): void
}
