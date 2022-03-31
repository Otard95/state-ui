interface StyleElement {
  element: HTMLStyleElement
  content: Text
}
export const createStyleElement = (id: string, content: string): StyleElement => {
    const styleElement = document.createElement('style')
    styleElement.setAttribute('id', id)

    let styleTextNode = document.createTextNode(content)
    styleElement.appendChild(styleTextNode)

    return { element: styleElement, content: styleTextNode }
}

export const updateStyleElement = (element: StyleElement, content: string) => {
  const newTextNode = document.createTextNode(content)
  element.element.replaceChild(newTextNode, element.content)
  element.content = newTextNode
}

