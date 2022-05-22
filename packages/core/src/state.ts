import debug from './debug.js'
import { State, StateEvent } from './types.js'

const createState = <T>(initial: T): State<T> => {
  type StateEventHandlerMap = {
    [E in keyof StateEvent<T>]: ((...args: StateEvent<T>[E]) => void)[]
  }
  const __eventHandlers: StateEventHandlerMap = {
    change: [],
  }
  const state: State<T> = {
    type: 'state',
    value: initial,
    set: (v: T) => {
      const old = state.value
      state.value = v
      state.emit('change', v, old)
      return state
    },
    emit: (event, ...args) => {
      debug('state::emit', `state emitting event '${event}'`, { state, args })
      __eventHandlers[event].forEach(cb => (cb as Function)(...args))
      return state
    },
    on: (event, cb) => {
      __eventHandlers[event].push(cb as any)
      return state
    },
    off: (event, cb) => {
      const idx = __eventHandlers[event].indexOf(cb)
      if (idx !== -1) {
        __eventHandlers[event].splice(idx, 1)
      }
      return state
    },
  }
  return state
}
export default createState

export const isState = <T>(state: any): state is State<T> =>
  state !== null
  && typeof state === 'object'
  && state.type === 'state'
