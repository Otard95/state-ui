import { isAttrib } from './attrib.js'
import { HTMLElement, Attrib, ElementEvents } from './types'
import { id } from './utils.js'

const createSrcForNode = <N extends HTMLElement>(
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
  return ` data-ui-attr-id="${attribId}" ${attrib.name}="${attrib.value}"`
}

const createSrc = <N extends HTMLElement>(
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
    if (isHtml(c)) {
      src += `${createSrcForNode(c, children)}${next}`
      continue
    }
    if (Array.isArray(c)) {
      c.forEach(cc => {
        if (!isHtml(cc))
          throw new Error(
            `The 'html' template tag expects its expressions to be nodes, an array of nodes, attributes or simple values like a 'string', 'number' or 'boolean', but got '${typeof cc}[]'.`
          )
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

const setupChildren = <N extends HTMLElement>(
  wrapper: HTMLDivElement,
  node: HTMLElement,
  children: Map<string, N>
) => {
  for (const [id, comp] of children) {
    const child = wrapper.getElementsByTagName(id)[0]
    if (child === null) {
      console.debug({ node: wrapper, id, comp })
      throw new Error(`Could not find child with id ${id}`)
    }
    child.parentNode?.replaceChild(comp.element, child)
    comp.emit('mount')
    node.on('unmount', () => comp.emit('unmount'))
  }
}

const setupAttribs = (
  wrapper: HTMLDivElement,
  node: HTMLElement,
  attribs: Map<string, Attrib>
) => {
  for (const [id, attrib] of attribs) {
    const child = wrapper.querySelector(`[data-ui-attr-id="${id}"]`)
    if (child === null) {
      console.debug({ node: wrapper, id, attrib })
      throw new Error(`Could not find child with id ${id}`)
    }
    child.removeAttribute('data-ui-attr-id')
    attrib.on('change', (newVal) => {
      child.setAttribute(attrib.name, newVal)
    })
    attrib.emit('mount')
    node.on('unmount', () => attrib.emit('unmount'))
  }
}

const createHTML = <N extends Element>(
  html: TemplateStringsArray,
  ...comp: (HTMLElement<N> | HTMLElement<N>[] | Attrib | string | number | boolean | undefined | null)[]
): HTMLElement<N> => {
  const children = new Map<string, HTMLElement<N>>()
  const attribs = new Map<string, Attrib>()

  if (html.length === 0) {
    throw new Error('Unexpected end of input')
  }

  const src = createSrc(children, attribs, html, comp)

  const wrapper = document.createElement('div')
  wrapper.innerHTML = src

  const element: N | Error = wrapper.children.length > 0
    ? wrapper.children[0] as N
    : wrapper.childNodes.length > 0
      ? wrapper.childNodes[0] as N
      : new Error('Unexpected node')
  if (element instanceof Error) {
    throw element
  }

  const __eventsHandlers: { [K in keyof ElementEvents]: ((...args: ElementEvents[K]) => void)[] } = {
    mount: [],
    unmount: [],
  }
  const node: HTMLElement<N> = {
    element,
    replace: (newNode: HTMLElement) => {
      node.element.parentNode?.replaceChild(newNode.element, node.element)
      node.emit('unmount')
      newNode.emit('mount')
      return newNode
    },
    click: (cb) => {
      node.element.addEventListener('click', cb)
      return node
    },
    emit: (eventName, ...args) => {
      __eventsHandlers[eventName]?.forEach(f => (f as Function)(...args as any))
      return node
    },
    on: (event, cb) => {
      if (event in __eventsHandlers[event]) __eventsHandlers[event] = []
      __eventsHandlers[event]?.push(cb)
      return node
    },
    off: (event, cb) => {
      if (event in __eventsHandlers) return node
      const index = __eventsHandlers[event]?.indexOf(cb)
      if (index === undefined || index === -1) return node
      __eventsHandlers[event]?.splice(index, 1)
      return node
    }
  }
  node.constructor = createHTML

  setupChildren(wrapper, node, children)
  setupAttribs(wrapper, node, attribs)

  return node
}
export default createHTML
export const isHtml = (value: unknown): value is HTMLElement =>
  typeof value === 'object'
  && value !== null
  && value.constructor === createHTML