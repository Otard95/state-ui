import { HTMLElement as StateUiHTMLElement } from './types'

const mount = (el: StateUiHTMLElement, root: HTMLElement) => {
  root.appendChild(el.element)
  el.emit('mount')
}

export default mount
