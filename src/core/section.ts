/*
 * @Author: your name
 * @Date: 2020-04-07 18:06:30
 * @LastEditTime: 2020-05-05 15:12:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \FancyPlayer\src\core\section.ts
 */

import Utils from '../helpers/utils'

import { SectionInterface, Coordinate } from '../type/section'
import { PlayerInterface } from '../type/player'

export default class Section implements SectionInterface {
  player: PlayerInterface
  section: HTMLElement
  sectionInner: HTMLElement
  startMouseDownXY: Coordinate
  cacheY: number
  currentY: number
  isPress: boolean
  isDrag: boolean
  sectionDoms: any

  constructor(player: PlayerInterface) {
    this.player = player
    this.startMouseDownXY = {
      x: 0,
      y: 0
    }
    this.sectionDoms = []
    this.cacheY = 0
    this.currentY = 0
    this.isPress = false
    this.isDrag = false
    this.section = this.player.dom.section
    this.sectionInner = this.player.dom.sectionInner
    this.initSections()
    this.sectionInner.addEventListener(Utils.nameMap.dragStart, this.onMouseDown.bind(this))
  }

  static get SLIDE_MIN(): number {
    return 3
  }

  resetValue() {
    this.sectionDoms = []
    this.cacheY = 0
    this.currentY = 0
    this.isPress = false
    this.isDrag = false
  }

  getViewPortHeight(): number {
    return document.documentElement.clientHeight || document.body.clientHeight
  }

  getMaxDistance(): number {
    return 0
  }

  getMinDistance(): number {
    const sectionHeight = this.section.clientHeight
    const sectionInnerHeight = this.sectionInner.clientHeight
    let minDistance = -(sectionInnerHeight - sectionHeight)
    return minDistance
  }

  controlAlignCenter(): void {
    if (this.getMinDistance() > 0) {
      Utils.classList.addClass(this.player.dom.section, 'align-center')
    } else {
      Utils.classList.removeClass(this.player.dom.section, 'align-center')
    }
  }

  sectionsClick(data: any): void {
    if (this.isDrag) {
      return
    }
    this.nodesActive_(data.index)
    this.player.events.trigger('node', data)
  }

  onMouseDown(e: any): void {
    if (e.type === 'touchstart') {
      e.clientX = e.touches[0].clientX
      e.clientY = e.touches[0].clientY
    }
    this.startMouseDownXY = {
      x: e.clientX,
      y: e.clientY
    }
    this.currentY = this.cacheY
    this.isPress = true

    document.addEventListener(Utils.nameMap.dragMove, this.onDragging.bind(this))
    document.addEventListener(Utils.nameMap.dragEnd, this.onDragEnd.bind(this))
  }
  onDragging(e: any): void {
    if (!this.isPress) {
      return
    }
    if (e.type === 'touchmove') {
      e.clientY = e.touches[0].clientY
    }
    const clientX = e.clientX as number
    const clientY = e.clientY as number
    const startMouseDownX = this.startMouseDownXY.x as number
    const startMouseDownY = this.startMouseDownXY.y as number
    const currentY = this.currentY as number
    let minDistance = this.getMinDistance()
    let maxDistance = this.getMaxDistance()
    if (minDistance > 0) {
      return
    }
    if (
      Math.abs(clientX - startMouseDownX) > Section.SLIDE_MIN ||
      Math.abs(clientY - startMouseDownY) > Section.SLIDE_MIN
    ) {
      this.isDrag = true
    }
    let distance = clientY - startMouseDownY + currentY
    this.translate(distance)
  }
  onDragEnd(e: any): void {
    setTimeout(() => {
      if (this.isPress) {
        this.isPress = false
        this.isDrag = false
      }
    })
    document.removeEventListener(Utils.nameMap.dragMove, this.onDragging.bind(this))
    document.removeEventListener(Utils.nameMap.dragEnd, this.onDragEnd.bind(this))
  }
  nodesActive_(index: number, colour?: string) {
    colour = colour || '#ddd'
    for (let i = 0; i < this.sectionDoms.length; i++) {
      if (i <= index) {
        this.sectionDoms[i].style.color = colour
      } else {
        this.sectionDoms[i].style.color = '#fff'
      }
    }
    this.followPlaySlide(this.sectionDoms[index])
  }
  followPlaySlide(element: HTMLElement): void {
    const boxOffsetTop = this.section.getBoundingClientRect().top
    const boxOffsetHeight = this.section.getBoundingClientRect().height
    const itemOffsetTop = element.getBoundingClientRect().top
    const itemOffsetHeight = element.getBoundingClientRect().height
    let topDifference = boxOffsetTop - itemOffsetTop
    let difference = 0
    if (topDifference > 0) {
      difference = (topDifference as number) + (this.cacheY as number)
      this.translate(difference)
    } else if (itemOffsetTop + itemOffsetHeight > boxOffsetTop + boxOffsetHeight) {
      difference =
        -(itemOffsetTop + itemOffsetHeight - (boxOffsetTop + boxOffsetHeight)) +
        this.cacheY +
        -itemOffsetHeight
      this.translate(difference)
    }
  }
  translate(distance: number): void {
    let minDistance = this.getMinDistance()
    let maxDistance = this.getMaxDistance()
    distance = distance > maxDistance ? maxDistance : distance
    distance = distance < minDistance ? minDistance : distance
    this.cacheY = distance
    this.sectionInner.style.transform = `translateY(${distance}px)`
  }

  // 侧边节点
  initSections(): void {
    if (this.player.options.isTimeNode) {
      this.player.on('durationchange', () => {
        const duration = (this.player.video as HTMLVideoElement).duration
        if (duration !== 1 && duration !== 0 && duration !== Infinity) {
          this._createSectionDom()
        }
      })
    } else {
      this._createSectionDom()
    }
  }
  _createSectionDom() {
    const highlightOptions = this.player.options.highlight
    console.log(highlightOptions)
    this.sectionDoms = []
    this.sectionInner.innerHTML = ''
    if (highlightOptions) {
      for (let i = 0; i < highlightOptions.length; i++) {
        if (highlightOptions[i].label) {
          const highlightNode = document.createElement('div') as HTMLElement
          const highlightNodeText = document.createElement('span') as HTMLElement
          const highlightNodeIco = document.createElement('span') as HTMLElement
          const highlightNodeBor = document.createElement('span') as HTMLElement
          const time = highlightOptions[i].time
          highlightNodeBor.className = 'dplayer-section-line'
          highlightNode.className = 'dplayer-section-item'
          highlightNodeText.innerHTML = highlightOptions[i].label!
          if (time) {
            highlightNode.setAttribute('data-time', time + '')
          }
          if (this.getViewPortHeight() <= 768) {
            Utils.classList.addClass(highlightNode, 'small-space')
          }

          if (highlightOptions[i].fileType === 1) {
            highlightNodeIco.className = 'iconfont iconvideo'
          } else if (highlightOptions[i].fileType === 2) {
            highlightNodeIco.className = 'iconfont iconphoto'
          }

          highlightNode.appendChild(highlightNodeIco)
          highlightNode.appendChild(highlightNodeText)
          highlightNode.appendChild(highlightNodeBor)
          this.sectionInner.appendChild(highlightNode)

          this.sectionDoms.push(highlightNode)

          highlightNode.addEventListener(
            'click',
            this.sectionsClick.bind(this, {
              index: i,
              ele: highlightNode,
              nodes: this.sectionDoms
            })
          )
        }
      }
    }
  }
}
