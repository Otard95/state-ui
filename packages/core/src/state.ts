import { State, StateEvent } from './types.js'

const createState = <T>(initial: T): State<T> => {
  type StateEventHandlerMap = {
    [E in keyof StateEvent<T>]: ((...a: StateEvent<T>[E]) => void)[]
  }
  const __eventHandlers: StateEventHandlerMap = {
    change: [],
  }
  const state: State<T> = {
    value: initial,
    set: (v: T) => {
      const old = state.value
      state.value = v
      __eventHandlers.change.forEach(cb => cb(v, old))
      return state
    },
    on: <E extends keyof StateEvent<T>, V extends StateEvent<T>[E]>(
      event: E,
      cb: (...v: V) => void
    ) => {
      __eventHandlers[event].push(cb as any)
      return state
    },
    off: <E extends keyof StateEvent<T>, V extends StateEvent<T>[E]>(
      event: E,
      cb: (...v: V) => void
    ) => {
      const idx = __eventHandlers[event].indexOf(cb as any)
      if (idx !== -1) {
        __eventHandlers[event].splice(idx, 1)
      }
      return state
    },
  }
  state.constructor = createState
  return state
}
export default createState

export const isState = <T>(state: any): state is State<T> =>
  state !== null
  && typeof state === 'object'
  && state.constructor === createState
