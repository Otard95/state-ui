import { isAttrib } from './attrib.js'
import debug from './debug.js'
import { isState } from './state.js'
import { HTMLElement, Attrib, ElementEvents, State } from './types'
import { id } from './utils.js'

type Renderable<N extends Element = Element> = HTMLElement<N> | HTMLElement<N>[] | State<HTMLElement> | Attrib | string | number | boolean | undefined | null

export const isHtml = (value: any): value is HTMLElement =>
  value !== null
  && typeof value === 'object'
  && value.type === 'html'

const isRenderable = (value: unknown): value is Renderable => {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
      return true
    case 'object':
      if (value === null) return true
      if (isHtml(value)) return true
      if (isAttrib(value)) return true
      if (isState(value) && isHtml(value.value)) return true
      if (Array.isArray(value)) return value.every(isRenderable)
  }
  return false
}

const tryTestBetweenTags = (
  src: string,
  next: string
): boolean => {
  if (src.lastIndexOf('>') === -1 && src.lastIndexOf('<') === -1) return true
  if (src.lastIndexOf('>') < src.lastIndexOf('<')) return false
  if (next.indexOf('<') > next.indexOf('>')) return false
  return true
}

const createSrcForNode = (
  node: HTMLElement,
  children: Map<string, HTMLElement>,
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

const createSrcForStates = (
  state: State<HTMLElement>,
  states: Map<string, State<HTMLElement>>,
): string => {
  const stateId = id('UI_STATE_')
  states.set(stateId, state)
  return `<${stateId}></${stateId}>`
}

const createSrcForRenderable = (
  renderable: Renderable,
  children: Map<string, HTMLElement>,
  attribs: Map<string, Attrib>,
  states: Map<string, State<HTMLElement>>,
  { src, next }: { src: string, next: string }
): string => {
  switch (typeof renderable) {
    case 'string':
    case 'number':
    case 'boolean':
      return renderable.toString()

    case 'object':
      if (isHtml(renderable))
        return createSrcForNode(renderable, children)

      if (isAttrib(renderable))
        return createSrcForAttrib(renderable, attribs)
      
      if (isState(renderable) && tryTestBetweenTags(src, next))
        return createSrcForStates(
          renderable as State<HTMLElement>,
          states
        )

      if (Array.isArray(renderable))
        return renderable.map(r => createSrcForRenderable(
          r,
          children,
          attribs,
          states,
          { src, next }
        )).join(' ')

      return ''

    default:
      return ''
  }
}

const createSrc = (
  children: Map<string, HTMLElement>,
  attribs: Map<string, Attrib>,
  states: Map<string, State<HTMLElement>>,
  html: TemplateStringsArray,
  comp: Renderable[]
): string => {
  let src = html[0]
  for (let i = 1; i < html.length; i++) {
    const c = comp[i-1]
    const next = html[i]

    if (!isRenderable(c))
      throw new Error(`Unexpected type ${typeof c} at:\n\t${
        src}\${...}${next}...\n\t${' '.repeat(src.length)}^^^^^^`)

    src += `${createSrcForRenderable(c, children, attribs, states, { src, next })}${next}`
  }
  return src
}

const setupChildren = <N extends HTMLElement>(
  wrapper: HTMLDivElement,
  node: N,
  children: Map<string, HTMLElement>
) => {
  for (const [id, comp] of children) {
    const child = wrapper.getElementsByTagName(id)[0]
    if (child === null) {
      console.debug({ node: wrapper, id, comp })
      throw new Error(`Could not find child with id ${id}`)
    }
    child.parentNode?.replaceChild(comp.element, child)
    node.on('unmount', () => comp.emit('unmount'))
    node.on('mount', () => comp.emit('mount'))
  }
}

const setupAttribs = <N extends HTMLElement>(
  wrapper: HTMLDivElement,
  node: N,
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
    node.on('unmount', () => attrib.emit('unmount'))
    node.on('mount', () => attrib.emit('mount'))
  }
}

const setupStates = <N extends HTMLElement>(
  wrapper: HTMLDivElement,
  node: N,
  states: Map<string, State<HTMLElement>>
) => {
  for (const [id, state] of states) {
    const child = wrapper.getElementsByTagName(id)[0]
    if (child === null) {
      console.debug({ node: wrapper, id, state })
      throw new Error(`Could not find child with id ${id}`)
    }
    child.parentNode?.replaceChild(state.value.element, child)
    state.on('change', (newVal, oldVal) => {
      oldVal.replace(newVal)
    })
    node.on('unmount', () => state.value.emit('unmount'))
    node.on('mount', () => state.value.emit('mount'))
  }
}

const createHTML = <N extends Element>(
  html: TemplateStringsArray,
  ...comp: Renderable[]
): HTMLElement<N> => {
  const children = new Map<string, HTMLElement>()
  const attribs = new Map<string, Attrib>()
  const states = new Map<string, State<HTMLElement>>()

  if (html.length === 0) {
    throw new Error('Unexpected end of input')
  }

  const src = createSrc(children, attribs, states, html, comp)

  const wrapper = document.createElement('div')
  wrapper.innerHTML = src

  const element = wrapper.children.length > 0
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
      debug('html::replace', 'html being replaced', { node, src, newNode })
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
      debug('html::emit', `html emitting event '${eventName}'`, { node, src, args })
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
  setupStates(wrapper, node, states)

  return node
}
export default createHTML
