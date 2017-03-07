import $ from 'jquery'

export const renderToDOM = (Component, obj, selector) => {
  const component = new Component(obj)
  component.build()
  $(selector).append(component.$node) 
}
