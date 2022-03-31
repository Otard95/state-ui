import {
  DynamicStyleNode,
  StyleNode
} from './parse'

const resolveSelector = (selector: string): string => {
  if (selector.includes('&'))
    return resolveSelector(selector.replace(/\s*&/, ''))
  return `.${selector}`
}

const resolveDynamicValue = <T>(node: DynamicStyleNode<T>, context: T): string => {
  const { template, variable } = node
  if (typeof variable === 'function')
    return template.replace('{{var}}', String(variable(context)))
  return template.replace('{{var}}', String(variable))
}

export const compileStyles = <T>(styles: StyleNode<T>[], dynamic?: { context: T, append: string }): string => {
  const styleBySelector: { [selector: string]: string[] } = {}
  styles.forEach(node => {
    if (node.type === 'basic') {
      const { selector, property, value } = node
      if (!(selector in styleBySelector))
        styleBySelector[selector] = []
      styleBySelector[selector].push(`${property}: ${value};`)
    } else {
      if (!dynamic) throw new Error('Dynamic styles require a state')
      const { selector, property } = node
      const sel = `${dynamic.append}.${selector}`
      if (!(sel in styleBySelector))
        styleBySelector[sel] = []
      styleBySelector[sel].push(
        `${property}: ${resolveDynamicValue(node, dynamic.context)};`
      )
    }
  })
  return Object.entries(styleBySelector)
    .map(([selector, styles]) =>
      `${resolveSelector(selector)} {\n${styles.map(s => `  ${s};`).join('\n')}\n}`
    )
    .join('\n')
}


