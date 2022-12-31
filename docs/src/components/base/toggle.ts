import { html } from '@state-ui/core'
import {State} from '@state-ui/core/lib/types'
import { createStyle } from '@state-ui/extra'

const style = createStyle<boolean>`
  display: block;
  width: 40px;
  height: 20px;
  border-radius: 10px;
  background: red;

  &:after {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: green;
    transition: all 0.3s ease;
    transform: translateX(${(state) => state ? '20px' : '0'});
  }
`

const Toggle = (state: State<boolean>) => {
  return html`
    <span ${style(state)}></span>
  `.click(() => {
    state.set(!state.value)
  })
}
export default Toggle
