import createState from './state.js';
const createTransformState = (state, transform) => {
    const transformedState = createState(transform(state.value));
    state.on('change', (val) => transformedState.set(transform(val)));
    return transformedState;
};
export default createTransformState;
