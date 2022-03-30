import { isAttrib } from './attrib.js';
import { id } from './utils.js';
const createSrcForNode = (node, children) => {
    const compId = id('UI_NODE_');
    children.set(compId, node);
    return `<${compId}></${compId}>`;
};
const createSrcForAttrib = (attrib, attribs) => {
    const attribId = id('UI_ATTRIB_');
    attribs.set(attribId, attrib);
    return ` data-ui-attr-id="${attribId}" ${attrib.value.name}="${attrib.value.value}"`;
};
const createSrc = (children, attribs, html, comp) => {
    let src = html[0];
    for (let i = 1; i < html.length; i++) {
        const c = comp[i - 1];
        const next = html[i];
        if (c === undefined || c === null) {
            continue;
        }
        if (c instanceof Node) {
            src += `${createSrcForNode(c, children)}${next}`;
            continue;
        }
        if (Array.isArray(c)) {
            c.forEach(cc => {
                src += `${createSrcForNode(cc, children)}`;
            });
            src += next;
            continue;
        }
        if (isAttrib(c)) {
            src += `${createSrcForAttrib(c, attribs)}${next}`;
            continue;
        }
        if (typeof c === 'string') {
            src += c;
            src += next;
            continue;
        }
        if (typeof c === 'number') {
            src += c.toString();
            src += next;
            continue;
        }
        if (typeof c === 'boolean') {
            src += c ? 'true' : 'false';
            src += next;
            continue;
        }
        throw new Error(`Unexpected type ${typeof c} at:\n${src}$$ERROR$$${next}...`);
    }
    return src;
};
const setupChildren = (node, children) => {
    for (const [id, comp] of children) {
        const child = node.getElementsByTagName(id)[0];
        if (child === null) {
            console.log({ node, id, comp });
            throw new Error(`Could not find child with id ${id}`);
        }
        child.parentNode?.replaceChild(comp, child);
    }
};
const setupAttribs = (node, attribs) => {
    for (const [id, attrib] of attribs) {
        const child = node.querySelector(`[data-ui-attr-id="${id}"]`);
        if (child === null) {
            console.log({ node, id, attrib });
            throw new Error(`Could not find child with id ${id}`);
        }
        child.removeAttribute('data-ui-attr-id');
        attrib.on('change', (v) => {
            child.setAttribute(attrib.value.name, v.value);
        });
    }
};
export default (html, ...comp) => {
    const children = new Map();
    const attribs = new Map();
    if (html.length === 0) {
        throw new Error('Unexpected end of input');
    }
    const src = createSrc(children, attribs, html, comp);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = src;
    setupChildren(wrapper, children);
    setupAttribs(wrapper, attribs);
    const node = wrapper.children.length > 0
        ? wrapper.children[0]
        : wrapper.childNodes.length === 1
            ? wrapper.childNodes[0]
            : new Error('Unexpected node');
    if (node instanceof Error) {
        throw node;
    }
    ;
    node.replace = (newNode) => {
        node.parentNode?.replaceChild(newNode, node);
        return newNode;
    };
    node.click = (cb) => {
        node.addEventListener('click', cb);
        return node;
    };
    return node;
};
