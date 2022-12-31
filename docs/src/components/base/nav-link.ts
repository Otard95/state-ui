import { Component, html } from "@state-ui/core";
import { createStyle } from "@state-ui/extra";

import theme, { Theme } from '../../theme'

const linkStyle = createStyle<Theme>`
  font-size: 1.2rem;
  color: ${theme => theme.colors.highlight};
`(theme)

type NavLinkProps = {
  href: string
  text: string
}
const NavLink: Component<NavLinkProps> = ({ href, text }) => {
  return html`<a href="#${href}" ${linkStyle}>${text}</a>`
}

export default NavLink
