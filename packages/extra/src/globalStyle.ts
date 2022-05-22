import { State } from '@state-ui/core/lib/types'
import { is, utils } from '@state-ui/core'
import {
  parseStyles,
  StyleVariables,
} from './css/parse'
import { compileStyles } from './css/compile'
import {
  createStyleElement,
  updateStyleElement,
} from './css/elements'

const createGlobalStyle = <T>(
  css: TemplateStringsArray,
  ...variables: StyleVariables<T>[]
) => {

  if (!Array.isArray(css) && typeof css[0] === 'string') {
    throw new Error(`Invalid argument '${css}' expected TemplateStringsArray`)
  }

  const styleId = utils.id('UI_GLOBAL_STYLE_')

  const styleNodes = parseStyles('', css, variables)
  const staticStyleNodes = styleNodes.filter(node => node.type === 'basic')
  const dynamicStyleNodes = styleNodes.filter(node => node.type === 'dynamic')

  const staticStyle = createStyleElement(styleId, compileStyles(staticStyleNodes))
  document.head.appendChild(staticStyle.element)

  return (context?: State<T> | T): void => {
    if (!context) return

    const dynamicId = utils.id('UI_GLOBAL_STYLE_DYNAMIC_')
    const dynamicStyle = createStyleElement(
      dynamicId,
      compileStyles(
        dynamicStyleNodes,
        { context: is.state<T>(context) ? context.value : context }
      )
    )
    document.head.appendChild(dynamicStyle.element)

    is.state<T>(context) && context.on('change', newVal => {
      updateStyleElement(dynamicStyle, compileStyles(
        dynamicStyleNodes,
        {
          context: newVal,
          prepend: dynamicId
        }
      ))
    })
  }
}
export default createGlobalStyle
