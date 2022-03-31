import { createState } from '@state-ui/core'

export interface Theme {
  colors: {
    primary: string
    secondary: string
    highlight: string
  }
}

const dark: Theme = {
  colors: {
    primary: '#2a2d34',
    secondary: '#999999',
    highlight: '#38a3a5',
  }
}

export default createState(dark)
