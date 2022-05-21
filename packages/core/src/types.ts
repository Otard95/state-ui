type ElementEvents = {
  'mount': [],
  'unmount': [],
}

export type HTMLElement<E = Element> = E & {
  __events: { [K in keyof ElementEvents]?: ((...args: ElementEvents[K]) => void)[] }
  replace(newNode: E): HTMLElement<E>
  click(cb:() => void): HTMLElement<E>
  on<Event extends keyof ElementEvents>(event: Event, cb: (...args: ElementEvents[Event]) => void): HTMLElement<E>
  off<Event extends keyof ElementEvents>(event: Event, cb: (...args: ElementEvents[Event]) => void): HTMLElement<E>
}

export type Component<
  P extends Record<string, unknown> = {},
  N extends HTMLElement = HTMLElement
> = N | ((props: P) => N)

export interface StateEvent<T> {
  change: [T, T]
}
export interface State<T> {
  value: T
  set: (v: T) => State<T>
  on: <E extends keyof StateEvent<T>, V extends StateEvent<T>[E]>(
    event: E, cb: (...v: V) => void
  ) => State<T>
  off: <E extends keyof StateEvent<T>, V extends StateEvent<T>[E]>(
    event: E, cb: (...v: V) => void
  ) => State<T>
}
export type StateOf<S> = S extends State<infer T> ? T : never

export type Attrib = Omit<State<{name: string, value: string}>, 'set'> & {
  set(val: string): void
}

export type OnClick = {  }
