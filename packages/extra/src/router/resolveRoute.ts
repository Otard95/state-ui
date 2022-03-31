import {
  Token,
  ResolvedRoute,
  DecisionTreeNode,
} from './types'

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
      `Got unexpected token type '${token.type}'`,
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
export default resolveRoute
