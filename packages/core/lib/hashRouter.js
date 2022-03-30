import html from "./html";
import createState from "./state";
// ### END Decision Tree
// ## END TYPES
const getQuery = () => {
    return Object.fromEntries(new URLSearchParams(location.search));
};
const getPath = () => {
    const raw = location.hash || '#/';
    return raw.slice(1);
};
const tokenize = (path) => {
    const tokens = [];
    const parts = path.split('/');
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (part === '' && i === parts.length - 1)
            break;
        if (part === '')
            throw new Error(`Unexpected empty path part in '${path}'`);
        if (part.startsWith(':')) {
            tokens.push({
                type: 'variable',
                value: part.slice(1)
            });
        }
        else {
            tokens.push({
                type: 'path',
                value: part
            });
        }
    }
    return tokens;
};
const createDecisionTree = (routes) => {
    const root = {
        children: new Map(),
        variables: new Map()
    };
    for (const [path, comp] of Object.entries(routes)) { // for each route
        const tokens = tokenize(path);
        let currentNode = root;
        for (const token of tokens) { // for each token
            const map = token.type === 'variable' ? currentNode.variables : currentNode.children;
            if (!map.has(token.value)) {
                map.set(token.value, {
                    children: new Map(),
                    variables: new Map()
                });
            }
            currentNode = map.get(token.value);
        } // END for each token
        if (currentNode.component) {
            throw new Error(`Route collision on '${path}'`);
        }
        currentNode.component = comp;
    } // END for each route
    return root;
};
const resolveRoute = (tree, params, path, tokens) => {
    const token = tokens.shift();
    if (!token)
        return tree.component && { comp: tree.component, path, params };
    if (token.type !== 'path')
        throw new Error(`Got unexpected token type '${token.type}' from path '${getPath()}'`);
    if (tree.children.has(token.value)) {
        const child = tree.children.get(token.value);
        return resolveRoute(child, params, `${path}/${token.value}`, tokens);
    }
    for (const [variableName, child] of tree.variables) {
        const result = resolveRoute(child, { ...params, [variableName]: token.value }, `${path}/:${variableName}`, tokens);
        if (result)
            return result;
    }
};
const defaultNotFound = html `<h1>Not Found</h1>`;
const createHashRouter = (routes, notFound = defaultNotFound) => {
    const decisionTree = createDecisionTree(routes);
    const routeState = createState(getPath());
    const initial = resolveRoute(decisionTree, {}, '/', tokenize(getPath())) || { comp: notFound, path: '/', params: {} };
    let current = typeof initial.comp === 'function'
        ? initial.comp({ query: getQuery(), params: initial.params })
        : initial.comp;
    routeState.set(initial.path.replace(/\/+/, '/'));
    window.addEventListener('hashchange', () => {
        const newRoute = resolveRoute(decisionTree, {}, '/', tokenize(getPath())) || { comp: notFound, path: '/', params: {} };
        current = current.replace(typeof newRoute.comp === 'function'
            ? newRoute.comp({ query: getQuery(), params: newRoute.params })
            : newRoute.comp);
        routeState.set(newRoute.path.replace(/\/+/, '/'));
    });
    return [current, routeState];
};
export default createHashRouter;
