import { Component } from './React'

const elementType = (element) => {
  if (typeof element !== 'object') {
    throw 'Invalid Element'
  } else if (typeof element.type === 'function') {
    return 'component'
  } else if (element.type === 'text') {
    return 'text'
  } else {
    return 'dom'
  }
}

class Updater {
  
  constructor(registry) {
    this.registry = registry
    Component.updater = this
  }

  mount(element, container, idx) {
    let node, instance

    switch(elementType(element)) {
      case 'component':
        instance = this.mountComponentElement(element, container, idx)
        break
      case 'dom':
        node = this.mountDOMElement(element, container, idx)
        break
      case 'text':
        node = this.mountTextElement(element, container, idx)
        break
    }

    this.registry.register(element, node, instance)
  }

  mountComponentElement(element, container, idx) {
    const instance = new element.type(element.props)
    instance.componentWillMount()

    element.next = instance.render()
    this.mount(element.next, container, idx)

    instance.componentDidMount()

    return instance
  }

  mountDOMElement(element, container, idx) {
    const node = document.createElement(element.type)

    if (element.props.className) {
      node.className = element.props.className
    }

    this.mountNode(node, container, idx)
    element.props.children.forEach(child => this.mount(child, node))

    return node
  }

  mountTextElement(element, container, idx) {
    const node = document.createTextNode(element.props.body);
    this.mountNode(node, container, idx)

    return node
  }

  mountNode(node, container, idx) {
    (idx && idx !== 0) ?
      container.childNodes[idx - 1].insertBefore(node) :
      container.appendChild(node)
  }

  unmount(element) {
    const link = this.registry.fetch(element.id)

    if (elementType(element) === 'component') {
      link.instance.componentWillUnmount()
      return this.unmount(element.next)
      this.registry
    } else {
      element.props.children.forEach(child => unmount(child))

      const container = link.node.parentNode
      link.node.remove()

      this.registry.unregister(element)
      return container
    }
  }

  update(instance, element, nextProps, nextState = instance.state) {
    if (instance.shouldComponentUpdate(nextProps, nextState)
) {
      instance.componentWillUpdate(nextProps, nextState)

      const prevProps = instance.props
      const prevState = instance.state
      const prev = element.next

      instance.props = nextProps
      instance.state = nextState

      const next = instance.render()

      element.next = this.diff(prev, next)

      instance.componentDidUpdate(prevProps, prevState)
    } else {
      instance.props = nextProps
      instance.state = nextState
    }
  }

  updateProps(id, nextProps) {
    const { element, instance } = this.registry.fetch(id)

    instance.componentWillReceiveProps(nextProps)

    this.update(instance, element, nextProps)
  }

  updateState(id, partialState) {
    const { element, instance } = this.registry.fetch(id)

    const nextState = Object.assign({}, instance.state, partialState)
    const nextProps = instance.props

    this.update(instance, element, nextProps, nextState)
  }

  diff(prev, next) {
    if (prev.type !== next.type) {
      this.mount(next, this.unmount(prev))
      return next
    } else {
      elementType(prev) === 'component' ?
        this.updateProps(prev.id, next.props) :
        this.diffChildren(prev, next)

      // mutation
      if (next.type === 'text') {
        this.updateTextNode(prev, next)
      }
      // update node classNames
      this.updateClassNames(prev, next)

      // updates eventListeners, children
      prev.props = next.props
    }

    return prev
  }

  diffChildren(prev, next) {
    // recurse children
    let i = 0, j = 0
    const prevChildren = prev.props.children
    const nextChildren = next.props.children

    for (i; i < next.props.children.length; i++) {
      while (prevChildren[j].type !== nextChildren[i].type) {
        this.unmount(prevChildren[j])
        j++
      }

      if (prevChildren[j]) {
        if (prevChildren[j].key === nextChildren[i].key) {
          nextChildren[i] = this.diff(prevChildren[i], nextChildren[j])
          j++
        } else {
          // insert nextChild (keeps prevChild same for next iteration
          this.mount(nextChildren[i], this.registry.fetchNode(prev.id), i)
        }
      }
    }

    // unmount remaining prevChildren
    for(j; j < prevChildren.length; j++) {
      this.unmount(prevChild[j])
    }
  }

  updateTextNode(prev, next) {
    const node = this.registry.fetchNode(prev.id)
    node.textContent = next.props.body
  }

  updateClassNames(prev, next) {

    if (prev.props.className === next.props.className) { return }

    const node = this.registry.fetchNode(prev.id)
    const prevClasses = new Set(prev.props.className.split(' '))
    const nextClasses = new Set(next.props.className.split(' '))

    node.classList.remove(Array.from(prevClasses).filter(name => !nextClasses.has(name)).join(' '))
    node.classList.add(Array.from(nextClasses).filter(name => !prevClasses.has(name)).join(' '))
  }
}

export default Updater
