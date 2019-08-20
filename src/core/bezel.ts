import { DomInterface } from '../type/dom'

class Bezel {
  dom: DomInterface
  constructor(dom: DomInterface) {
    this.dom = dom

    this.dom.bezelIconBox.addEventListener('animationend', () => {
      this.dom.bezelIconBox.classList.remove('dplayer-bezel-transition')
    })
  }

  switch(className: string) {
    this.dom.bezelIcon.className = className
    this.dom.bezelIconBox.classList.add('dplayer-bezel-transition')
  }
}

export default Bezel
