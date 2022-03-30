import createState from './state.js'
import { Attrib } from './types'

const createAttrib = (name: string, value: string): Attrib => {
  const state = createState({name, value})
  const set = (val: string) => {
    state.set({ name, value: val })
    return state
  }
  const attrib = { ...state, set }
  attrib.constructor = createAttrib
  return attrib
}
export default createAttrib

export const isAttrib = (attrib: any): attrib is Attrib =>
  attrib !== null
  && typeof attrib === 'object'
  && attrib.constructor === createAttrib
