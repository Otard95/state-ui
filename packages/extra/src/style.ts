import { utils, State, createAttrib, Attrib, is } from '@state-ui/core'
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

  return (context?: State<T> | T): Attrib => {
    if (!context) {
      return createAttrib('class', styleId)
        .on('unmount', () => {
          // If this fail's it's because the style element is not in the DOM
          // In which case we don't care about the error
          try { document.head.removeChild(staticStyle.element) } catch {}
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
          context: is.state<T>(context) ? context.value : context,
          prepend: `.${dynamicId}`,
        }
      )
    )
    document.head.appendChild(dynamicStyle.element)

    is.state<T>(context) && context.on('change', newVal => {
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
        // If this fail's it's because the style element is not in the DOM
        // In which case we don't care about the error
        try {
          document.head.removeChild(staticStyle.element)
          document.head.removeChild(dynamicStyle.element)
        } catch {}
      })
      .on('mount', () => {
        document.head.appendChild(staticStyle.element)
        document.head.appendChild(dynamicStyle.element)
      })
  }
}
export default createStyle
