import { html, createState } from '@state-ui/core'
import { createStyle } from '@state-ui/extra'
import theme, {dark, light, Theme} from './theme'

import Toggle from './components/base/toggle'
import Router from './router'
import NavLink from './components/base/nav-link'

const layout = () => {
  const appStyle = createStyle`
    display: grid;
    height: 100vh;
    width: 100vw;
    grid-template-columns: 250px 1fr;
    grid-template-rows: 50px 1fr;
    grid-template-areas:
      "logo header"
      "sidebar main";

    nav {
      display: flex;
      flex-direction: column;
    }
  `()

  const logoStyle = createStyle<Theme>`
    grid-area: logo;
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
    text-align: center;
    line-height: 50px;
    border-bottom: 2px solid ${theme => theme.colors.secondary};
    color: ${theme => theme.colors.highlight};
  `(theme)

  const headerStyles = createStyle<Theme>`
    grid-area: header;
    background-color: ${theme => theme.colors.primary};
    color: ${theme => theme.colors.secondary};
    border-bottom: 2px solid ${theme => theme.colors.secondary};
  `(theme)

  const themeToggle = createState(true)
    .on('change', state => theme.set(state ? dark : light))

  return html`
    <div id="app" aria-role="app" ${appStyle}>
      <h1 ${logoStyle}>State UI</h1>
      <header ${headerStyles}>test text ${Toggle(themeToggle)}</header>
      <nav>
        ${NavLink({ href: '/', text: 'Overview' })}
        ${NavLink({ href: '/getting-started/', text: 'Getting started' })}
      </nav>
      <main>${Router({})}</main>
    </div>
  `
}
export default layout
