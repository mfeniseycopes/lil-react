import ReactDOM from './lib/ReactDOM'
import { Component, createElement } from './lib/React'
import $ from 'jquery'

class Test extends Component {
  render() {
    return el1
  }
}

window.$ = $

const el0 = createElement(Test)

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

ReactDOM.render(el0, $('#root'))
ReactDOM._diff(el0, el2)
