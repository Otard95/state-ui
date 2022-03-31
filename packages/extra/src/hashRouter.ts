import { html } from '@state-ui/core'
import { createState } from '@state-ui/core'
import { Component, HTMLElement, State } from '@state-ui/core/lib/types'

// ## TYPES
// ### Tokens
interface TokenPath {
  type: 'path'
  value: string
}
interface TokenVariable {
  type: 'variable'
  value: string
}
type Token = TokenPath | TokenVariable
// ### END Tokens

// ### Routes
export interface RouteCompArgs {
  query: Record<string, string>
  params: Record<string, string>
  [key: string]: unknown
}
export type Routes = Record<string, Component<RouteCompArgs>>
// ### END Routes

// ### Decision Tree
interface DecisionTreeNode {
  component?: Component<RouteCompArgs>
  children: Map<string, DecisionTreeNode>
  variables: Map<string, DecisionTreeNode>
}
interface ResolvedRoute {
  comp: Component<RouteCompArgs>
  path: string
  params: Record<string, string>
}
// ### END Decision Tree
// ## END TYPES

const getQuery = (): Record<string, string> => {
  return Object.fromEntries(new URLSearchParams(location.search))
}
const getPath = (): string => {
  const raw = location.hash || '#/'
  return raw.slice(1)
}
const tokenize = (path: string): Token[] => {
  const tokens: Token[] = []
  const parts = path.split('/')
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]
    if (part === '' && i === parts.length - 1) break
    if (part === '') throw new Error(`Unexpected empty path part in '${path}'`)
    if (part.startsWith(':')) {
      tokens.push({
        type: 'variable',
        value: part.slice(1)
      })
    } else {
      tokens.push({
        type: 'path',
        value: part
      })
    }
  }
  return tokens
}

const createDecisionTree = (
  routes: Routes,
): DecisionTreeNode => {
  const root: DecisionTreeNode = {
    children: new Map(),
    variables: new Map()
  }
  for (const [path, comp] of Object.entries(routes)) { // for each route
    const tokens = tokenize(path)
    let currentNode = root

    for (const token of tokens) { // for each token
      const map = token.type === 'variable' ? currentNode.variables : currentNode.children
      if (!map.has(token.value)) {
        map.set(token.value, {
          children: new Map(),
          variables: new Map()
        })
      }
      currentNode = map.get(token.value) as DecisionTreeNode
    } // END for each token
    if (currentNode.component) {
      throw new Error(`Route collision on '${path}'`)
    }
    currentNode.component = comp
  } // END for each route
  return root
}

const resolveRoute = (
  tree: DecisionTreeNode,
  params: Record<string, string>,
  path: string,
  tokens: Token[],
): ResolvedRoute | undefined => {
  const token = tokens.shift()
  if (!token) return tree.component && { comp: tree.component, path, params }
  if (token.type !== 'path')
    throw new Error(
      `Got unexpected token type '${token.type}' from path '${getPath()}'`
    )

  if (tree.children.has(token.value)) {
    const child = tree.children.get(token.value) as DecisionTreeNode
    return resolveRoute(child, params, `${path}/${token.value}`, tokens)
  }

  for (const [variableName, child] of tree.variables) {
    const result = resolveRoute(
      child,
      {...params, [variableName]: token.value},
      `${path}/:${variableName}`,
      tokens
    )
    if (result) return result
  }
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
