import Component from './lib/Component'
import { renderToDOM } from './lib/Utility'

window.Component = Component

renderToDOM(
  Component, { 
    html: '<div>Parent</div>',
    children: [
      { html: '<div>Child1</div>' },
      { html: '<div>Child2</div>' }
    ]
  }, '#root')

