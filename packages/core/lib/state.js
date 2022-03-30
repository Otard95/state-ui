const createState = (initial) => {
    const __eventHandlers = {
        change: [],
    };
    const state = {
        value: initial,
        set: (v) => {
            const old = state.value;
            state.value = v;
            __eventHandlers.change.forEach(cb => cb(v, old));
            return state;
        },
        on: (event, cb) => {
            __eventHandlers[event].push(cb);
            return state;
        },
        off: (event, cb) => {
            const idx = __eventHandlers[event].indexOf(cb);
            if (idx !== -1) {
                __eventHandlers[event].splice(idx, 1);
            }
            return state;
        },
    };
    state.constructor = createState;
    return state;
};
export default createState;
export const isState = (state) => state !== null
    && typeof state === 'object'
    && state.constructor === createState;
