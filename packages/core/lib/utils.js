export const id = (prefix = '') => {
    return `${prefix}${Math.random().toString(36).substring(2, 12)}`;
};
