import { State } from './types.js';
declare const createState: <T>(initial: T) => Readonly<State<T>>;
export default createState;
export declare const isState: <T>(state: any) => state is State<T>;
