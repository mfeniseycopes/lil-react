import ReactDOM from './lib/ReactDOM'
import { Component, createElement } from './lib/React'
import $ from 'jquery'

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

ReactDOM.render(el1, $('#root'))
ReactDOM._diff(el1, el2)
