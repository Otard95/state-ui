import { utils } from '@ui.js/core';
const { id } = utils;
const resolveStyleString = (id, css, variables, context) => {
    if (css.length === 0) {
        return "";
    }
    if (css.length - variables.length !== 1) {
        throw new Error("[style] Unexpected error, invalid ratio of strings to expressions in tag template");
    }
    let style = '';
    for (let i = 0; i < variables.length; i++) {
        const cssPart = css[i + 1];
        const variable = variables[i];
        style += `${typeof variable === 'function'
            ? variable(context)
            : variable}${cssPart}`;
    }
    return `.${id} {${css[0]}${style}}`;
};
const parseStyles = (css, path) => {
    let style = [];
    const lines = [];
    let current = '';
    for (let i = 0; i < css.length; i++) {
        const char = css[i];
        switch (char) {
            case '\n':
                lines.push(current);
                current = '';
                break;
            case '{':
                style.push(...parseStyles(css.slice(i + 1), [...path, current]));
                current = '';
                i += css.slice(i + 1).indexOf('}');
                if (i === -1) {
                    throw new Error("[style] Unexpected error, no closing brace found");
                }
                break;
            case '}':
                lines.push(current);
                style.push({
                    selector: path.join(' '),
                    css: lines.join('\n')
                });
                return style;
            default:
                current += char;
        }
    }
    style.push({
        selector: path.join(' '),
        css: current
    });
    return style;
};
const compileStyles = (styles) => {
    let css = [];
    for (const style of styles) {
        if (style.selector !== '') {
            const selector = style.selector.replace(/\s+/, ' ').replace(/([\w]+) +&:/, '$1:').trim();
            css.push(`${selector} {${style.css}}`);
        }
    }
    return css.join('\n');
};
const createStyle = (css, ...variables) => (state) => {
    const styleId = id('UI_STYLE_');
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', styleId);
    let styleTextNode = document.createTextNode(compileStyles(parseStyles(resolveStyleString(styleId, css, variables, (state && state.value)), [])));
    styleElement.appendChild(styleTextNode);
    document.head.appendChild(styleElement);
    state && state.on('change', () => {
        const newStyleTextNode = document.createTextNode(compileStyles(parseStyles(resolveStyleString(styleId, css, variables, (state && state.value)), [])));
        styleElement.replaceChild(newStyleTextNode, styleTextNode);
        styleTextNode = newStyleTextNode;
    });
    return `class="${styleId}"`;
};
export default createStyle;
