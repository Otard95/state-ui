export declare const createHashRouter: (routes: import("./hashRouter").Routes, notFound?: import("@state-ui/core/lib/types").HTMLElement<Element>) => [import("@state-ui/core/lib/types").HTMLElement<Element>, import("@state-ui/core/lib/types").State<string>];
export declare const createStyle: <T>(css: TemplateStringsArray, ...variables: (string | number | ((props: T) => string | number))[]) => (state?: import("@state-ui/core/lib/types").State<T> | undefined) => string;
export declare const createTransformState: <F, T>(state: import("@state-ui/core/lib/types").State<F>, transform: (val: F) => T) => import("@state-ui/core/lib/types").State<T>;
declare const _default: {
    createHashRouter: (routes: import("./hashRouter").Routes, notFound?: import("@state-ui/core/lib/types").HTMLElement<Element>) => [import("@state-ui/core/lib/types").HTMLElement<Element>, import("@state-ui/core/lib/types").State<string>];
    createStyle: <T>(css: TemplateStringsArray, ...variables: (string | number | ((props: T) => string | number))[]) => (state?: import("@state-ui/core/lib/types").State<T> | undefined) => string;
    createTransformState: <F, T_1>(state: import("@state-ui/core/lib/types").State<F>, transform: (val: F) => T_1) => import("@state-ui/core/lib/types").State<T_1>;
};
export default _default;
