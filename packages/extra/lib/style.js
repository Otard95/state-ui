import { utils } from '@state-ui/core';
const finishNode = (node, acc) => {
    switch (node.type) {
        case 'basic':
            node.value = acc.trim();
            break;
        case 'dynamic':
            node.template = `${node.template || ''}${acc.trimEnd()}`;
            break;
    }
};
const newNode = (base) => ({ ...base, type: 'basic' });
const parseStyles = (selector, css, variables, pos = { i: 0, j: 0 }) => {
    let style = [];
    let acc = '';
    let node = newNode({ selector });
    for (let i = pos.i; i < css.length; i++) {
        const cssPart = css[i];
        for (let j = pos.j; j < cssPart.length; j++) {
            const char = cssPart[j];
            switch (char) {
                case ':':
                    if (acc[Math.max(acc.length - 1, 0)] === '&') {
                        acc += char;
                        break;
                    }
                    node.property = acc.trim();
                    acc = '';
                    break;
                case ';':
                    finishNode(node, acc);
                    acc = '';
                    style.push(node);
                    node = newNode({ selector });
                    break;
                case '{':
                    const subPos = { i, j: j + 1 };
                    style.push(...parseStyles(`${selector} ${acc.trim()}`, css, variables, subPos));
                    acc = '';
                    i = subPos.i;
                    j = subPos.j;
                    break;
                case '}':
                    if (node.property && !(node.value || node.template))
                        throw new Error(`Unexpected '}' in value of property ${node.property}`);
                    if (acc.trim().length > 0)
                        throw new Error(`Unexpected '}' near property ${style[style.length - 1].property}`);
                    pos.i = i;
                    pos.j = j + 1;
                    return style;
                default:
                    acc += char;
            }
        }
        if (!node.property && i < css.length - 1)
            throw new Error('Unexpected end of css');
        if (node.property && node.type === 'dynamic')
            throw new Error('A single property may only have one dynamic variable');
        if (node.property) {
            node.type = 'dynamic';
            node.variable = variables[i];
            node.template = `${acc.trimStart()}{{var}}`;
            acc = '';
        }
    }
    return style;
};
const resolveSelector = (selector) => {
    if (selector.includes('&'))
        return resolveSelector(selector.replace(/\s*&/, ''));
    return `.${selector}`;
};
const resolveDynamicValue = (node, context) => {
    const { template, variable } = node;
    if (typeof variable === 'function')
        return template.replace('{{var}}', String(variable(context)));
    return template.replace('{{var}}', String(variable));
};
const compileStyles = (styles, dynamic) => {
    const styleBySelector = {};
    styles.forEach(node => {
        if (node.type === 'basic') {
            const { selector, property, value } = node;
            if (!(selector in styleBySelector))
                styleBySelector[selector] = [];
            styleBySelector[selector].push(`${property}: ${value};`);
        }
        else {
            if (!dynamic)
                throw new Error('Dynamic styles require a state');
            const { selector, property } = node;
            const sel = `${dynamic.append}.${selector}`;
            if (!(sel in styleBySelector))
                styleBySelector[sel] = [];
            styleBySelector[sel].push(`${property}: ${resolveDynamicValue(node, dynamic.context)};`);
        }
    });
    return Object.entries(styleBySelector)
        .map(([selector, styles]) => `${resolveSelector(selector)} {\n${styles.map(s => `  ${s};`).join('\n')}\n}`)
        .join('\n');
};
const createStyleElement = (id, content) => {
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', id);
    let styleTextNode = document.createTextNode(content);
    styleElement.appendChild(styleTextNode);
    return { element: styleElement, content: styleTextNode };
};
const updateStyleElement = (element, content) => {
    const newTextNode = document.createTextNode(content);
    element.element.replaceChild(newTextNode, element.content);
    element.content = newTextNode;
};
const createStyle = (css, ...variables) => {
    const styleId = utils.id('UI_STYLE_');
    const styleNodes = parseStyles(styleId, css, variables);
    const staticStyleNodes = styleNodes.filter(node => node.type === 'basic');
    const dynamicStyleNodes = styleNodes.filter(node => node.type === 'dynamic');
    const staticStyle = createStyleElement(styleId, compileStyles(staticStyleNodes));
    document.head.appendChild(staticStyle.element);
    return (state) => {
        if (!state)
            return `class="${styleId}"`;
        const dynamicId = utils.id('UI_STYLE_DYNAMIC_');
        const dynamicStyle = createStyleElement(dynamicId, compileStyles(dynamicStyleNodes, {
            context: state.value,
            append: dynamicId
        }));
        document.head.appendChild(dynamicStyle.element);
        state.on('change', newVal => {
            updateStyleElement(dynamicStyle, compileStyles(dynamicStyleNodes, {
                context: newVal,
                append: dynamicId
            }));
        });
        return `class="${styleId} ${dynamicId}"`;
    };
};
export default createStyle;
