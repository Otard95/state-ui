import { Component } from '@state-ui/core/lib/types'

// ## TYPES
// ### Token
interface TokenPath {
  type: 'path'
  value: string
}
interface TokenVariable {
  type: 'variable'
  value: string
}
export type Token = TokenPath | TokenVariable
// ### Token

// ### Routes
export interface RouteCompArgs {
  query: Record<string, string>
  params: Record<string, string>
  [key: string]: unknown
}
export type Routes = Record<string, Component<RouteCompArgs>>
// ### END Routes

// ### Decision Tree
export interface DecisionTreeNode {
  component?: Component<RouteCompArgs>
  children: Map<string, DecisionTreeNode>
  variables: Map<string, DecisionTreeNode>
}
export interface ResolvedRoute {
  comp: Component<RouteCompArgs>
  path: string
  params: Record<string, string>
}
// ### END Decision Tree
// ## END TYPES

