import createState from './state.js';
const createAttrib = (name, value) => {
    const state = createState({ name, value });
    const set = (val) => {
        state.set({ name, value: val });
        return state;
    };
    const attrib = { ...state, set };
    attrib.constructor = createAttrib;
    return attrib;
};
export default createAttrib;
export const isAttrib = (attrib) => attrib !== null
    && typeof attrib === 'object'
    && attrib.constructor === createAttrib;
