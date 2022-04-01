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

const createStyle = <T>(
  css: TemplateStringsArray,
  ...variables: StyleVariables<T>[]
) => {

  const styleId = utils.id('UI_STYLE_')

  const styleNodes = parseStyles(`.${styleId}`, css, variables)
  const staticStyleNodes = styleNodes.filter(node => node.type === 'basic')
  const dynamicStyleNodes = styleNodes.filter(node => node.type === 'dynamic')

  const staticStyle = createStyleElement(styleId, compileStyles(staticStyleNodes))
  document.head.appendChild(staticStyle.element)

  return (state?: State<T>): string => {
    if (!state) return `class="${styleId}"`

    const dynamicId = utils.id('UI_STYLE_DYNAMIC_')
    const dynamicStyle = createStyleElement(
      dynamicId,
      compileStyles(
        dynamicStyleNodes,
        {
          context: state.value,
          prepend: `.${dynamicId}`,
        }
      )
    )
    document.head.appendChild(dynamicStyle.element)

    state.on('change', newVal => {
      updateStyleElement(dynamicStyle, compileStyles(
        dynamicStyleNodes,
        {
          context: newVal,
          prepend: `.${dynamicId}`
        }
      ))
    })

    return `class="${styleId} ${dynamicId}"`
  }
}
export default createStyle
