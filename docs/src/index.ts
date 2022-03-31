import { createGlobalStyle } from '@state-ui/extra'

import theme, { Theme } from './theme'
import layout from './layout'

window.addEventListener('DOMContentLoaded', () => {

  createGlobalStyle<Theme>`
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      background-color: ${theme => theme.colors.primary};
    }
  `(theme)

  document.body.appendChild(layout())
})
