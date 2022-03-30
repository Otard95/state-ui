import { isAttrib } from './attrib.js'
import { HTMLElement, Attrib } from './types'
import { id } from './utils.js'

const createSrcForNode = <N extends Element>(
  node: N,
  children: Map<string, N>,
): string => {
  const compId = id('UI_NODE_')
  children.set(compId, node)
  return `<${compId}></${compId}>`
}

const createSrcForAttrib = (
  attrib: Attrib,
  attribs: Map<string, Attrib>,
): string => {
  const attribId = id('UI_ATTRIB_')
  attribs.set(attribId, attrib)
  return ` data-ui-attr-id="${attribId}" ${attrib.value.name}="${attrib.value.value}"`
}

const createSrc = <N extends Element>(
  children: Map<string, N>,
  attribs: Map<string, Attrib>,
  html: TemplateStringsArray,
  comp: (N | N[] | Attrib | string | number | boolean | undefined | null)[]
): string => {
  let src = html[0]
  for (let i = 1; i < html.length; i++) {
    const c = comp[i-1]
    const next = html[i]

    if (c === undefined || c === null) {
      continue
    }
    if (c instanceof Node) {
      src += `${createSrcForNode(c, children)}${next}`
      continue
    }
    if (Array.isArray(c)) {
      c.forEach(cc => {
        src += `${createSrcForNode(cc, children)}`
      })
      src += next
      continue
    }
    if (isAttrib(c)) {
      src += `${createSrcForAttrib(c, attribs)}${next}`
      continue
    }
    if (typeof c === 'string') {
      src += c
      src += next
      continue
    }
    if (typeof c === 'number') {
      src += c.toString()
      src += next
      continue
    }
    if (typeof c === 'boolean') {
      src += c ? 'true' : 'false'
      src += next
      continue
    }
    throw new Error(`Unexpected type ${typeof c} at:\n${src}$$ERROR$$${next}...`)
  }
  return src
}

const setupChildren = <N extends Element>(
  node: HTMLDivElement,
  children: Map<string, N>
) => {
  for (const [id, comp] of children) {
    const child = node.getElementsByTagName(id)[0] as unknown as N
    if (child === null) {
      console.log({ node, id, comp })
      throw new Error(`Could not find child with id ${id}`)
    }
    child.parentNode?.replaceChild(comp, child)
  }
}

const setupAttribs = <N extends Element>(
  node: HTMLDivElement,
  attribs: Map<string, Attrib>
) => {
  for (const [id, attrib] of attribs) {
    const child = node.querySelector(`[data-ui-attr-id="${id}"]`) as unknown as N
    if (child === null) {
      console.log({ node, id, attrib })
      throw new Error(`Could not find child with id ${id}`)
    }
    child.removeAttribute('data-ui-attr-id')
    attrib.on('change', (v) => {
      child.setAttribute(attrib.value.name, v.value)
    })
  }
}

export default <N extends HTMLElement>(
  html: TemplateStringsArray,
  ...comp: (N | N[] | Attrib | string | number | boolean | undefined | null)[]
): N => {
  const children = new Map<string, N>()
  const attribs = new Map<string, Attrib>()

  if (html.length === 0) {
    throw new Error('Unexpected end of input')
  }

  const src = createSrc(children, attribs, html, comp)

  const wrapper = document.createElement('div')
  wrapper.innerHTML = src

  setupChildren(wrapper, children)
  setupAttribs(wrapper, attribs)

  const node = wrapper.children.length > 0
    ? wrapper.children[0]
    : wrapper.childNodes.length === 1
      ? wrapper.childNodes[0]
      : new Error('Unexpected node')
  if (node instanceof Error) {
    throw node
  }

  ;(node as unknown as N).replace = (newNode: Element) => {
    node.parentNode?.replaceChild(newNode, node)
    return newNode as HTMLElement
  }
  ;(node as unknown as N).click = (cb) => {
    node.addEventListener('click', cb)
    return node as HTMLElement
  }

  return node as N
}
