export type ElementEvents = {
  mount: [],
  unmount: [],
}

export type EventEmitter<Events extends Record<string, unknown[]>, E> = {
  emit: <E extends keyof Events>(event: E, ...args: Events[E]) => void
  on<Event extends keyof Events>(event: Event, cb: (...args: Events[Event]) => void): E
  off<Event extends keyof Events>(event: Event, cb: (...args: Events[Event]) => void): E
}

export interface HTMLElement<E = Element> extends EventEmitter<ElementEvents, HTMLElement<E>> {
  element: E
  replace(newNode: HTMLElement): HTMLElement
  click(cb:() => void): HTMLElement<E>
}

export type Component<
  P extends Record<string, unknown> = {},
  N extends HTMLElement = HTMLElement
> = N | ((props: P) => N)

export type StateEvent<T> = {
  change: [T, T]
}
export interface State<T> extends EventEmitter<StateEvent<T>, State<T>> {
  value: T
  set: (v: T) => State<T>
}
export type StateOf<S> = S extends State<infer T> ? T : never

export type AttribEvents = {
  change: [string, string]
  mount: [],
  unmount: [],
}
export interface Attrib extends EventEmitter<AttribEvents, Attrib> {
  name: string
  value: string
  set(val: string): void
}
