import {
  Routes,
  DecisionTreeNode,
} from './types'
import tokenize from './tokenize'

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
export default createDecisionTree
