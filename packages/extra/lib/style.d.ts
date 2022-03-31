import { State } from '@state-ui/core/lib/types';
declare type StyleVariables<T> = string | number | ((props: T) => string | number);
declare const createStyle: <T>(css: TemplateStringsArray, ...variables: StyleVariables<T>[]) => (state?: State<T> | undefined) => string;
export default createStyle;
