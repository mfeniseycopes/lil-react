import { Component, DOMConnector } from './Component.js'

console.log('running')
window.Component = Component
window.DOMConnector = DOMConnector
window.DC = new DOMConnector(
  Component, { 
    html: '<div>Parent</div>',
    children: [
      { html: '<div>Child1</div>' },
      { html: '<div>Child2</div>' }
    ]
  }, '#root')

