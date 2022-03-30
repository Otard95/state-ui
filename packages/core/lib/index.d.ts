export declare const html: <N extends import("./types").HTMLElement<Element>>(html: TemplateStringsArray, ...comp: (string | number | boolean | import("./types").Attrib | N | N[] | null | undefined)[]) => N;
export declare const createState: <T>(initial: T) => Readonly<import("./types").State<T>>;
export declare const createAttrib: (name: string, value: string) => import("./types").Attrib;
export declare const utils: {
    id: (prefix?: string) => string;
};
declare const _default: {
    html: <N extends import("./types").HTMLElement<Element>>(html: TemplateStringsArray, ...comp: (string | number | boolean | import("./types").Attrib | N | N[] | null | undefined)[]) => N;
    createState: <T>(initial: T) => Readonly<import("./types").State<T>>;
    createAttrib: (name: string, value: string) => import("./types").Attrib;
    utils: {
        id: (prefix?: string) => string;
    };
};
export default _default;
