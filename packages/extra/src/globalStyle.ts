import { State } from '@state-ui/core/lib/types'
import { utils } from '@state-ui/core'
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

  const styleId = utils.id('UI_GLOBAL_STYLE_')

  const styleNodes = parseStyles('', css, variables)
  const staticStyleNodes = styleNodes.filter(node => node.type === 'basic')
  const dynamicStyleNodes = styleNodes.filter(node => node.type === 'dynamic')

  const staticStyle = createStyleElement(styleId, compileStyles(staticStyleNodes))
  document.head.appendChild(staticStyle.element)

  return (state?: State<T>): void => {
    if (!state) return

    const dynamicId = utils.id('UI_GLOBAL_STYLE_DYNAMIC_')
    const dynamicStyle = createStyleElement(
      dynamicId,
      compileStyles(
        dynamicStyleNodes,
        { context: state.value }
      )
    )
    document.head.appendChild(dynamicStyle.element)

    state.on('change', newVal => {
      updateStyleElement(dynamicStyle, compileStyles(
        dynamicStyleNodes,
        {
          context: newVal,
          append: dynamicId
        }
      ))
    })
  }
}
export default createGlobalStyle
