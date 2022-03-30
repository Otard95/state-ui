import { State } from '@ui.js/core/lib/types';
declare const createTransformState: <F, T>(state: State<F>, transform: (val: F) => T) => State<T>;
export default createTransformState;
