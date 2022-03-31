export type StyleVariables<T> = string | number | ((props: T) => string | number)
export interface BasicStyleNode {
  type: 'basic'
  selector: string
  property: string
  value: string
}
export interface DynamicStyleNode<T> {
  type: 'dynamic'
  selector: string
  property: string
  template: string
  variable: StyleVariables<T>
}
export type StyleNode<T> = BasicStyleNode | DynamicStyleNode<T>

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

export const parseStyles = <T>(
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
