export interface ScrollPosition {
  left: number
  top: number
}

export interface IDomClassList {
  hasClass(node: HTMLElement, className: string): boolean
  addClass(node: HTMLElement, className: string): void
  addClasses(node: HTMLElement, ...classNames: string[]): void
  removeClass(node: HTMLElement, className: string): void
  removeClasses(node: HTMLElement, ...classNames: string[]): void
  toggleClass(node: HTMLElement, className: string, shouldHaveIt?: boolean): void
}
