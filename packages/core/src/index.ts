import ui_html, { isHtml } from './html'
import ui_createState, { isState } from './state'
import ui_createAttrib, { isAttrib } from './attrib'
import { id as ui_id } from './utils'
import ui_debug from './debug'
export { HTMLElement, State, StateOf, Component, Attrib, EventEmitter } from './types'

export const html = ui_html
export const createState = ui_createState
export const createAttrib = ui_createAttrib
export const is = {
  html: isHtml,
  state: isState,
  attrib: isAttrib,
}
export const utils = {
  id: ui_id
}
export const debug = ui_debug

export default {
  html: ui_html,
  createState: ui_createState,
  createAttrib: ui_createAttrib,
  is,
  utils: {
    id: ui_id,
  },
  debug: ui_debug,
}
