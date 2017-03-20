import $ from 'jquery'

export const renderToDOM = (component, selector) => {
  const parent = { $node: $(selector) }
  component.mounting(parent)
  // $(selector).append(component.$node)
}
