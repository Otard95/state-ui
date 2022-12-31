export const id = (prefix = ''): string => {
  return `${prefix}${Math.random().toString(36).substring(2, 12)}`
};

export const escape = (str: string): string =>
  str
    .replace('&', '&amp;')
    .replace('<', '&lt;')
    .replace('>', '&gt;')
    .replace('"', '&quot;')
    .replace("'", '&#39;')
