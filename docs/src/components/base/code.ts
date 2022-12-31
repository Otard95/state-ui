import { Component, html } from "@state-ui/core";
import { createStyle } from "@state-ui/extra";

import theme, { Theme } from '../../theme'

const codeStyle = createStyle<Theme>`
  font-family: monospace;
  color: ${theme => theme.colors.secondary};
  background: darken(${theme => theme.colors.primary}, 10%);
`(theme)

type CodeProps = {
  code: string
}
const Code: Component<CodeProps> = ({ code }) => {
  return html`
    <pre><code ${codeStyle}>${code}</code></pre>
  `
}

export default Code
