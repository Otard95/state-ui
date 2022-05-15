import { parseStyles } from "./parse"

describe('css/parse (basic)', () => {


  it('should parse simple propery-value pair', () => {
    const styles = ['color: blue;']
    const parsedStyles = [
      {
        selector: '',
        type: 'basic',
        property: 'color',
        value: 'blue'
      }
    ]
    expect(parseStyles<any>('', styles, [])).toEqual(parsedStyles)
  })

  it('should parse multiple property-value pairs', () => {
    const styles = ['color: blue; background: red;']
    const parsedStyles = [
      {
        selector: '',
        type: 'basic',
        property: 'color',
        value: 'blue'
      },
      {
        selector: '',
        type: 'basic',
        property: 'background',
        value: 'red'
      }
    ]
    expect(parseStyles<any>('', styles, [])).toEqual(parsedStyles)
  })

  it('should handle line-breaks and whitespace', () => {
    const styles = ['\n  color: blue;\n  background: red; \n']
    const parsedStyles = [
      {
        selector: '',
        type: 'basic',
        property: 'color',
        value: 'blue'
      },
      {
        selector: '',
        type: 'basic',
        property: 'background',
        value: 'red'
      }
    ]
    expect(parseStyles<any>('', styles, [])).toEqual(parsedStyles)
  })

  it('should respect the given selector', () => {
    const styles = ['\n  color: blue;\n  background: red; \n']
    const parsedStyles = [
      {
        selector: '.foo',
        type: 'basic',
        property: 'color',
        value: 'blue'
      },
      {
        selector: '.foo',
        type: 'basic',
        property: 'background',
        value: 'red'
      }
    ]
    expect(parseStyles<any>('.foo', styles, [])).toEqual(parsedStyles)
  })

  it('should handle sub-blocks', () => {
    const styles = [`
      color: red;
      .bar {
        background: green;
      }
    `]
    const parsedStyles = [
      {
        selector: '.foo',
        type: 'basic',
        property: 'color',
        value: 'red'
      },
      {
        selector: '.foo .bar',
        type: 'basic',
        property: 'background',
        value: 'green'
      }
    ]
    expect(parseStyles<any>('.foo', styles, [])).toEqual(parsedStyles)
  })

  it('should handle sub-blocks when parent is empty', () => {
    const styles = [`
      .bar {
        background: green;
      }
    `]
    const parsedStyles = [
      {
        selector: '.foo .bar',
        type: 'basic',
        property: 'background',
        value: 'green'
      }
    ]
    expect(parseStyles<any>('.foo', styles, [])).toEqual(parsedStyles)
  })

  it('should handle comma seperated selectors', () => {
    const styles = [`
      html, body {
        background: green;
      }
    `]
    const parsedStyles = [
      {
        selector: 'html, body',
        type: 'basic',
        property: 'background',
        value: 'green'
      }
    ]
    expect(parseStyles<any>('', styles, [])).toEqual(parsedStyles)
  })

})