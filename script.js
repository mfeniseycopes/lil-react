import ReactDOM from './lib/ReactDOM'
import { Component, createElement } from './lib/React'
import $ from 'jquery'

class Test extends Component {
  render() {
    return el1
  }
}

window.$ = $

const el1 = createElement(
    'main',
    { span: 'SPAN', div: 'DIV' },
    createElement('hey'),
    createElement('hay'))

const el2 = createElement(
    'main',
    { div: 'DIV', p: 'P' },
    createElement('ya'),
    createElement('yo'))

window.el1 = el1

ReactDOM.render(createElement(Test), $('#root'))
ReactDOM._diff(el1, el2)
