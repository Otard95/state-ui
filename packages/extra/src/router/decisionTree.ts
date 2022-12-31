import { Component, HTMLElement} from '@state-ui/core'
import {
  Routes,
  DecisionTreeNode,
  Token,
  RouteCompArgs,
} from './types'
import tokenize from './tokenize'

const childNode = (map: Map<string, DecisionTreeNode>, path: string) => {
  if (!map.has(path)) {
    map.set(path, {
      children: new Map(),
      variables: new Map()
    })
  }
  return map.get(path) as DecisionTreeNode
}

const addPathToTree = (root: DecisionTreeNode, path: Token[], comp: Component<RouteCompArgs> | HTMLElement) => {
  const token = path.shift()

  if (!token) {
    if (root.component) throw new Error(`Route collision on '${path}'`)
    root.component = comp
    return
  }
  switch (token.type) {
    case 'path':
      addPathToTree(childNode(root.children, token.value), path, comp)
      break
    case 'variable':
      addPathToTree(childNode(root.variables, token.value), path, comp)
      break
    case 'optional-variable':
      addPathToTree(childNode(root.variables, token.value), path, comp)
      addPathToTree(root, path, comp)
      break
  }
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
    addPathToTree(root, tokens, comp)
  } // END for each route
  return root
}
export default createDecisionTree
