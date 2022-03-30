export const id = (prefix = ''): string => {
  return `${prefix}${Math.random().toString(36).substring(2, 12)}`
};
