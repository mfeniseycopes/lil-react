import $ from 'jquery'

export const renderToDOM = (component, selector) => {
  component.build(component.render())
  $(selector).append(component.$node) 
}
