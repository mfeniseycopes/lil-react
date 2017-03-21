import $ from 'jquery'

const elementTypes = new Set(['main','div', 'span', 'p'])

const isComponentEl = el => typeof el.type === 'function'
const isDOMEl = el => elementTypes.has(el.type)
const isTextEl = el => !(isComponentEl(el) || elementTypes.has(el))

const normalizeEl = el => {
  if (typeof el === 'string') { el = { type: el } } 
  
  el.props = Object.assign({ children: [] }, el.props || {}) 
  if (!typeof el.props.children === 'array') {
    el.props.children = [el.props.children]
  }

  return el
}

const render = (element, $container) => _mount(element, $container)

const _mount = (element, $container) => {

  element = normalizeEl(element)

  if (isComponentEl(element)) {
    // before mount
    element.component = new element.type(element.props)
    element.component.el = element
    element.component.componentWillMount()

    // mount
    element.tree = element.component.render()
    element.$container = $container
    _mount(element.tree, $container)

    // after mount
    element.component.componentDidMount()
  } else {
    const nodeText = elementTypes.has(element.type)  ?
      `<${element.type}>` :
      document.createTextNode(element.type)

    element.$node = $(nodeText)
    element.$container = $container
    $container.append(element.$node)

    element.props.children.forEach((child, i) => {
      if (!element.key) { element.key = i }
      _mount(child, element.$node)
    })
  }

  return element
}

const _diff = (prev, next) => {
  
  next = normalizeEl(next)
  if (prev.type !== next.type) {
    // teardown
    _unmount(prev)
    _mount(next, prev.$container)
  } else {

    if (isComponentEl(prev)) {
      debugger
      _update(prev.component, next.props)

    } else {

      // recurse children
      const potentialUnmounts = {}

      const [prevChildren, nextChildren] = [prev.props.children, next.props.children]
      let [prevChild, i] = [prevChildren[0], 0]

      nextChildren.forEach((nextChild, j) => {

        while (prevChild && prevChild.key !== nextChild.key) {
          // detach $node
          prevChild.$node.detach()
          // keep reference for later keymatching
          potentialUnmounts[prevChild.key] = prevChild
          // update
          prevChild = prevChildren[++i]
        }

        prevChild = prevChild || potentialUnmounts[nextChild.key]

        // found it!
        if (prevChild) {
          _diff(prevChild, nextChild)

          // found in potentialUnmounts and need to reattch node
          if (i > prevChildren.length) {
            j === 0 ?
              nextChild.$container.append(nextChild.$node) :
              nextChild.$node.insertAfter(next.children[j - 1].$node)

            // remove from unmount list
            delete potentialUnmounts[nextChild.key]
          } else {
            prevChild = prevChildren[++i]
          }
        } else {
          prevChild = prevChildren[++i]
          _mount(next, prev.$container)
        }
      })

      Object.keys(potentialUnmounts).forEach(deadKey => {
        // call component unmount lifecycle methods
        // skip non-components, they will be garbage collected
      })
    }
  }
}

const _unmount = el => {
  el.props.children.forEach(child => _unmount(child))

  if (isComponentEl(el)) {
    el.component.componentWillUnmount()
    _unmount(el.tree)
  } else {
    el.$node.detach()
  }
}

const _update = (component, nextProps = component.props, nextState) => {
  if (!nextState) {
    component.componentWillReceiveProps(nextProps)
  }

  if (component.shouldComponentUpdate(nextProps, component.state)) {
    component.componentWillUpdate(nextProps, component.state)

    const prevProps = component.props
    const prevState = component.state
    const prevTree = component.el.tree

    component.props = nextProps
    component.state = nextState
    component.el.tree = component.render()
    _diff(prevTree, component.el.tree)

    component.componentDidUpdate(prevProps, prevState)
  }
}

const _updateState = (component, partialState) => {
  const nextState = Object.assign({}, component.state, partialState)
  _update(component, null, nextState)
}

const ReactDOM = { render, _updateState }
export default ReactDOM
