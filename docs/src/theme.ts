import { createState } from '@state-ui/core'

export interface Theme {
  colors: {
    primary: string
    secondary: string
    highlight: string
  }
}

export const dark: Theme = {
  colors: {
    primary: '#2a2d34',
    secondary: '#999999',
    highlight: '#38a3a5',
  },
}
export const light: Theme = {
  colors: {
    primary: '#eee',
    secondary: '#666666',
    highlight: '#157e80',
  },
}

export default createState(dark)
