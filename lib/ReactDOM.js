import $ from 'jquery'

const elementTypes = new Set(['main','div', 'span', 'p'])

const render = (element, $container) => _mount(element, $container)

const _mount = (element, $container) => {

  debugger
  const nodeText = elementTypes.has(element.type)  ?
    `<${element.type}>` :
    document.createTextNode(element.type)

  element.$node = $(nodeText)
  element.$container = $container
  $container.append(element.$node)
  
  element.children.forEach((child, i) => {
    if (!element.key) { element.key = i }
    _mount(child, element.$node)
  })

  return element
}

const _diff = (prev, next) => {

  if (prev.type !== next.type) {
    // teardown
    _unmount(prev)
    _mount(next, prev.$container)
  } else {
    // update node, move node refs to next

    // recurse children
    const potentialUnmounts = {}

    let [prevChild, i] = [prev.children[0], 0]
    next.children.forEach((nextChild, j) => {

      while (prevChild && prevChild.key !== nextChild.key) {
        // detach $node
        prevChild.$node.detach()
        // keep reference for later keymatching
        potentialUnmounts[prevChild.key] = prevChild
        // update
        prevChild = prev.children[++i]
      }

      prevChild = prevChild || potentialUnmounts[nextChild.key]

      // found it!
      if (prevChild) {
        _diff(prevChild, nextChild)

        // found in potentialUnmounts and need to reattch node
        if (i > prev.children.length) {
          j === 0 ?
            nextChild.$container.append(nextChild.$node) :
            nextChild.$node.insertAfter(next.children[j - 1].$node)

          // remove from unmount list
          delete potentialUnmounts[nextChild.key]
        }
      } else {
        _mount(next, prev.$container)
      }
    })

    Object.keys(potentialUnmounts).forEach(deadKey => {
      // call component unmount lifecycle methods
      // skip non-components, they will be garbage collected
    })
  }
  return next
}

const _unmount = el => {
  el.children.forEach(child => _unmount(child))
  el.$node.detach()
}

const ReactDOM = { render, _diff }
export default ReactDOM
