import { Attrib, AttribEvents } from './types'

const createAttrib = (name: string, value: string): Attrib => {
  type AttribEventHandlerMap = {
    [E in keyof AttribEvents]: ((...args: AttribEvents[E]) => void)[]
  }
  const __eventHandlers: AttribEventHandlerMap = {
    change: [],
    mount: [],
    unmount: [],
  }

  const attrib: Attrib = {
    type: 'attrib',
    name,
    value,
    set: (value: string) => {
      const old = attrib.value
      attrib.value = value
      attrib.emit('change', value, old)
      return attrib
    },
    emit: (event, ...args) => {
      __eventHandlers[event].forEach(cb => (cb as Function)(...args))
      return attrib
    },
    on: (event, cb) => {
      __eventHandlers[event].push(cb)
      return attrib
    },
    off: (event, cb) => {
      const idx = __eventHandlers[event].indexOf(cb)
      if (idx !== -1) {
        __eventHandlers[event].splice(idx, 1)
      }
      return attrib
    },
  }
  return attrib
}
export default createAttrib

export const isAttrib = (attrib: any): attrib is Attrib =>
  attrib !== null
  && typeof attrib === 'object'
  && attrib.type === 'attrib'
