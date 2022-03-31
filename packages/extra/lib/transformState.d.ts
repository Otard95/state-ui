import { State } from '@state-ui/core/lib/types';
declare const createTransformState: <F, T>(state: State<F>, transform: (val: F) => T) => State<T>;
export default createTransformState;
