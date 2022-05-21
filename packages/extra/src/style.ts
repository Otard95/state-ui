import { utils, State, createAttrib, Attrib } from '@state-ui/core'
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

  return (state?: State<T>): Attrib => {
    if (!state) {
      return createAttrib('class', styleId)
        .on('unmount', () => {
          document.head.removeChild(staticStyle.element)
        })
        .on('mount', () => {
          document.head.appendChild(staticStyle.element)
        })
    }

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

    return createAttrib('class', `${styleId} ${dynamicId}`) // `class="${styleId} ${dynamicId}"`
      .on('unmount', () => {
        document.head.removeChild(staticStyle.element)
        document.head.removeChild(dynamicStyle.element)
      })
      .on('mount', () => {
        document.head.appendChild(staticStyle.element)
        document.head.appendChild(dynamicStyle.element)
      })
  }
}
export default createStyle
