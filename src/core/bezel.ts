import { DomInterface } from '../type/dom'
import Utils from '../helpers/utils'

class Bezel {
  dom: DomInterface
  constructor(dom: DomInterface) {
    this.dom = dom

    this.dom.bezelIconBox.addEventListener('animationend', () => {
      Utils.classList.removeClass(this.dom.bezelIconBox, 'dplayer-bezel-transition')
    })
  }

  switch(className: string) {
    this.dom.bezelIcon.className = className
    Utils.classList.addClass(this.dom.bezelIconBox, 'dplayer-bezel-transition')
  }
}

export default Bezel
