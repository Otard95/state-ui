import { State, StateOf } from './types';
declare type StyleVariables<S extends (State<unknown> | undefined)> = string | number | ((props: StateOf<S>) => string | number);
declare const createStyle: <S extends State<unknown>>(css: TemplateStringsArray, ...variables: StyleVariables<S>[]) => (state?: S | undefined) => string;
export default createStyle;
