import ReactDOM from './lib/ReactDOM'
import { Component, createElement } from './lib/React'
import $ from 'jquery'

class Test extends Component {
  constructor(props) {
    super(props)
    debugger
    this.state = { a: 'A', b: 'B' }
  }

  render() {
    return {
      type: 'div',
      props: {
        a: this.state.a,
        b: this.state.b,
        children: [{
          type: 'p',
          props: {
            children: [
              this.state.a,
              this.state.b
            ]
          }
        }]
      }
    }
      
  }
}

window.$ = $

const elA = createElement(Test, { update: false })
const elB = createElement(Test, { update: true })

const el1 = createElement(
    'div',
    { span: 'SPAN', div: 'DIV' },
    createElement('hey'),
    createElement('hay'))

const el2 = createElement(
    'main',
    { div: 'DIV', p: 'P' },
    createElement('ya'),
    createElement('yo'))

ReactDOM.render(elA, $('#root'))
// ReactDOM._diff(elA, elB)
elA.component.setState({b: 'b'})


