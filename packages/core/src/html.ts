import { isAttrib } from './attrib.js'
import { HTMLElement, Attrib, ElementEvents } from './types'
import { id } from './utils.js'

type Renderable<N> = HTMLElement<N> | HTMLElement<N>[] | Attrib | string | number | boolean | undefined | null

export const isHtml = (value: any): value is HTMLElement =>
  value !== null
  && typeof value === 'object'
  && value.type === 'html'

const isRenderable = <N extends Element>(value: unknown): value is Renderable<N> => {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
      return true
    case 'object':
      if (value === null) return true
      if (Array.isArray(value)) return value.every(isRenderable)
      if (isHtml(value)) return true
      if (isAttrib(value)) return true
  }
  return false
}

const createSrcForNode = <N extends Element>(
  node: HTMLElement<N>,
  children: Map<string, HTMLElement<N>>,
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

const createSrcForRenderable = <N extends Element>(
  renderable: Renderable<N>,
  children: Map<string, HTMLElement>,
  attribs: Map<string, Attrib>
): string => {
  switch (typeof renderable) {
    case 'string':
    case 'number':
    case 'boolean':
      return renderable.toString()

    case 'object':
      if (isHtml(renderable))
        return createSrcForNode(renderable, children)

      if (Array.isArray(renderable))
        return renderable.map(
          r => createSrcForRenderable(r, children, attribs)
        ).join('')

      if (isAttrib(renderable))
        return createSrcForAttrib(renderable, attribs)

      return ''

    default:
      return ''
  }
}

const createSrc = <N extends Element>(
  children: Map<string, HTMLElement>,
  attribs: Map<string, Attrib>,
  html: TemplateStringsArray,
  comp: Renderable<N>[]
): string => {
  let src = html[0]
  for (let i = 1; i < html.length; i++) {
    const c = comp[i-1]
    const next = html[i]

    if (!isRenderable(c))
      throw new Error(`Unexpected type ${typeof c} at:\n\t${
        src}\${...}${next}...\n\t${' '.repeat(src.length)}^^^^^^`)

    src += `${createSrcForRenderable(c, children, attribs)}${next}`
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
  ...comp: Renderable<N>[]
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
    type: 'html',
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

  setupChildren(wrapper, node, children)
  setupAttribs(wrapper, node, attribs)

  return node
}
export default createHTML
