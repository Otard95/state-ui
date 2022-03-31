import ui_createHashRouter from './hashRouter'
import ui_createStyle from './style'
import ui_createGlobalStyle from './globalStyle'
import ui_createTransformState from './transformState'

import ui_tokenize from './router/tokenize'
import ui_createDecisionTree from './router/decisionTree'
import ui_resolveRoute from './router/resolveRoute'

export const createHashRouter = ui_createHashRouter
export const createStyle = ui_createStyle
export const createGlobalStyle = ui_createGlobalStyle
export const createTransformState = ui_createTransformState

export const routing = {
  tokenize: ui_tokenize,
  createDecisionTree: ui_createDecisionTree,
  resolveRoute: ui_resolveRoute
}

export default {
  createHashRouter,
  createStyle,
  createGlobalStyle,
  createTransformState,
  routing,
}
