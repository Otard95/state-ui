import { Attrib, State } from '@ui.js/core/lib/types'
import { createAttrib, utils } from '@ui.js/core'
import {createTransformState} from '.'

type StyleVariables<T> = string | number | ((props: T) => string | number)
interface BasicStyleNode {
  type: 'basic'
  selector: string
  property: string
  value: string
}
interface DynamicStyleNode<T> {
  type: 'dynamic'
  selector: string
  property: string
  template: string
  variable: StyleVariables<T>
}
type StyleNode<T> = BasicStyleNode | DynamicStyleNode<T>

const finishNode = <T>(node: Partial<StyleNode<T>>, acc: string) => {
  switch (node.type) {
    case 'basic':
      node.value = acc.trim()
      break
    case 'dynamic':
      node.template = `${node.template || ''}${acc.trimEnd()}`
      break
  }
}
const newNode = <T>(
  base: Partial<StyleNode<T>>
): Partial<StyleNode<T>> => ({...base, type: 'basic'})

const parseStyles = <T>(
  selector: string,
  css: TemplateStringsArray,
  variables: StyleVariables<T>[],
  pos: {i: number, j: number} = { i: 0, j: 0 },
): StyleNode<T>[] => {
  let style: StyleNode<T>[] = []

  let acc = ''
  let node: Partial<StyleNode<T>> = newNode({ selector })
  for (let i = pos.i; i < css.length; i++) {
    const cssPart = css[i]
    for (let j = pos.j; j < cssPart.length; j++) {
      const char = cssPart[j]
      switch (char) {
        case ':':
          if (acc[Math.max(acc.length - 1, 0)] === '&') {
            acc += char
            break
          }
          node.property = acc.trim()
          acc = ''
          break
        case ';':
          finishNode(node, acc)
          acc = ''
          style.push(node as StyleNode<T>)
          node = newNode({ selector })
          break
        case '{':
          const subPos = { i, j: j + 1 }
          style.push(...parseStyles(
            `${selector} ${acc.trim()}`,
            css,
            variables,
            subPos
          ))
          acc = ''
          i = subPos.i
          j = subPos.j
          break
        case '}':
          if (node.property && !((node as BasicStyleNode).value || (node as DynamicStyleNode<T>).template))
            throw new Error(`Unexpected '}' in value of property ${node.property}`)
          if (acc.trim().length > 0)
            throw new Error(`Unexpected '}' near property ${style[style.length-1].property}`)
          pos.i = i
          pos.j = j + 1
          return style
        default:
          acc += char
      }
    }
    if (!node.property && i < css.length - 1)
      throw new Error('Unexpected end of css')
    if (node.property && node.type === 'dynamic')
      throw new Error('A single property may only have one dynamic variable')

    if (node.property) {
      node.type = 'dynamic'
      ;(node as DynamicStyleNode<T>).variable = variables[i]
      ;(node as DynamicStyleNode<T>).template = `${acc.trimStart()}{{var}}`
      acc = ''
    }
  }

  return style
}

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

const compileStyles = <T>(styles: StyleNode<T>[], dynamic?: { context: T, append: string }): string => {
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

interface StyleElement {
  element: HTMLStyleElement
  content: Text
}
const createStyleElement = (id: string, content: string): StyleElement => {
    const styleElement = document.createElement('style')
    styleElement.setAttribute('id', id)

    let styleTextNode = document.createTextNode(content)
    styleElement.appendChild(styleTextNode)

    return { element: styleElement, content: styleTextNode }
}

const updateStyleElement = (element: StyleElement, content: string) => {
  const newTextNode = document.createTextNode(content)
  element.element.replaceChild(newTextNode, element.content)
  element.content = newTextNode
}

const createStyle = <T>(
  css: TemplateStringsArray,
  ...variables: StyleVariables<T>[]
) => {

  const styleId = utils.id('UI_STYLE_')

  const styleNodes = parseStyles(styleId, css, variables)
  const staticStyleNodes = styleNodes.filter(node => node.type === 'basic')
  const dynamicStyleNodes = styleNodes.filter(node => node.type === 'dynamic')

  const staticStyle = createStyleElement(styleId, compileStyles(staticStyleNodes))
  document.head.appendChild(staticStyle.element)

  return (state?: State<T>): string => {
    if (!state) return `class="${styleId}"`

    const dynamicId = utils.id('UI_STYLE_DYNAMIC_')
    const dynamicStyle = createStyleElement(
      dynamicId,
      compileStyles(
        dynamicStyleNodes,
        {
          context: state.value,
          append: dynamicId
        }
      )
    )
    document.head.appendChild(dynamicStyle.element)

    state.on('change', newVal => {
      updateStyleElement(dynamicStyle, compileStyles(
        dynamicStyleNodes,
        {
          context: newVal,
          append: dynamicId
        }
      ))
    })

    return `class="${styleId} ${dynamicId}"`
  }
}
export default createStyle
