import { html } from '@state-ui/core'
import { createState } from '@state-ui/core'
import { HTMLElement, State } from '@state-ui/core/lib/types'

import { Routes } from './router/types'
import tokenize from './router/tokenize'
import createDecisionTree from './router/decisionTree'
import resolveRoute from './router/resolveRoute'

const getQuery = (): Record<string, string> => {
  return Object.fromEntries(new URLSearchParams(location.search))
}
const getPath = (): string => {
  const raw = location.hash || '#/'
  return raw.slice(1)
}

const defaultNotFound = html`<h1>Not Found</h1>`

const createHashRouter = (
  routes: Routes,
  notFound: HTMLElement = defaultNotFound,
): [ HTMLElement, State<string> ] => {
  const decisionTree = createDecisionTree(routes)
  const routeState = createState(getPath())

  const initial = resolveRoute(
    decisionTree,
    {},
    '/',
    tokenize(getPath())
  ) || {comp: notFound, path: '/', params: {}}

  let current = typeof initial.comp === 'function'
    ? initial.comp({ query: getQuery(), params: initial.params })
    : initial.comp
  routeState.set(initial.path.replace(/\/+/, '/'))

  window.addEventListener('hashchange', () => {
    const newRoute = resolveRoute(
      decisionTree,
      {},
      '/',
      tokenize(getPath())
    ) || {comp: notFound, path: '/', params: {}}
    current = current.replace(
      typeof newRoute.comp === 'function'
        ? newRoute.comp({ query: getQuery(), params: newRoute.params })
        : newRoute.comp
    )
    routeState.set(newRoute.path.replace(/\/+/, '/'))
  })

  return [ current, routeState ]
}
export default createHashRouter
