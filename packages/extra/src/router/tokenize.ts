import { Token } from './types'

const tokenize = (path: string): Token[] => {
  const tokens: Token[] = []
  const parts = path.split('/')
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]
    if (part === '' && i === parts.length - 1) break
    if (part === '') throw new Error(`Unexpected empty path part in '${path}'`)
    if (part.startsWith(':?')) {
      tokens.push({
        type: 'optional-variable',
        value: part.slice(2)
      })
    } else if (part.startsWith(':')) {
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
export default tokenize
