import ReactDOM from './lib/ReactDOM'
import { Component, createElement } from './lib/React'
import $ from 'jquery'

class Test extends Component {
  render() {
    const children = [
      createElement('<p>P</p>'),

    ]

    if (this.props.p = 'p') {
      children.push(createElement('<span>SPAN</span>'))
    }

    return (
      createElement(
        `<div>${this.props.div}</div>`,
        {}, ...children)
    )
  }
}

window.updateComponent = ReactDOM.updateComponent
window.$ = $

const el1 = createElement(
    'main',
    { span: 'SPAN', div: 'DIV' },
    createElement('hey'),
    createElement('div'))

const el2 = createElement(
    'main',
    { div: 'DIV', p: 'P' },
    createElement('div'),
    createElement('div'))

window.el1 = el1

ReactDOM.render(el1, $('#root'))
ReactDOM._diff(el1, el2)
