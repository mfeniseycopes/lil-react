import $ from 'jquery'

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

  constructor(register) {
    this.register = register 
  }
 
  mount(element, $container, idx) {
    switch(elementType(element)) {
      case 'component':
        return this.mountComponentElement(element, $container, idx)
      case 'dom':
        return this.mountDOMElement(element, $container, idx)
      case 'text':
        return this.mountTextElement(element, $container, idx)
    }
  }

  mountComponentElement(element, $container, idx) {
    const instance = new element.type(element.props, this)
    instance.componentWillMount()

    element.next = instance.render()
    this.mount(element.next, $container, idx)

    instance.componentDidMount()
    this.register.register(element, null, instance)
  }

  mountDOMElement(element, $container, idx) {
    const $node = $(`<${element.type}>`);
    
    if (element.props.className) {
      $node.addClass(element.props.className)
    }

    (idx && idx !== 0) ? 
      $node.insertAfter($container.contents().eq(idx - 1)) :
      $container.append($node) 
    element.props.children.forEach(child => this.mount(child, $node)) 
    this.register.register(element, $node)
  }

  mountTextElement(element, $container, idx) {
    const $node = $(document.createTextNode(element.props.body)); 
    (idx && idx !== 0) ? 
      $node.insertAfter($container.contents().eq(idx - 1)) :
      $container.append($node) 
    this.register.register(element, $node)
  }

  unmount(element) {
    const link = this.register.fetch(element.id)
    
    if (elementType(element) === 'component') {
      link.instance.componentWillUnmount()
      return this.unmount(element.this.register)
    } else {
      element.props.children.forEach(child => unmount(child)) 
     
      const $container = link.$node.parent()
      link.$node.detach()

      this.register.unregister(element)
      return $container
    }

    
  }

  update(instance, element, nextProps, nextState = instance.state) {
    nextProps ?
      instance.componentWillReceiveProps(nextProps) :
      nextProps = instance.props
   
    const shouldUpdate = instance.shouldComponentUpdate(nextProps, nextState)

    if (shouldUpdate) {
      instance.componentWillUpdate(nextProps, nextState) 

      const prevProps = instance.props
      const prevState = instance.state
      const prev = element.next 
    
      instance.props = nextProps
      instance.state = nextState
      
      const next = instance.render()

      element.next = this.diff(prev, next)

      instance.componentDidUpdate(prevProps, prevState)
    }
  }

  updateProps(id, nextProps) {
  
  }

  updateState(id, partialState) {
    const { element, instance } = this.register.fetch(id)

    const nextState = Object.assign({}, instance.state, partialState)
    const nextProps = instance.props

    this.update(instance, element, nextProps, nextState)
  }

  diff(prev, next) {
    if (prev.type !== next.type) {
      this.mount(next, this.unmount(prev))
      return next 
    } else {
      if (elementType(prev) === 'component') {
        const instance = this.register.fetch(prev.id).instance
        this.update(instance, prev, next.props) 
      } else {

        // recurse children
        let j = 0, i = 0
        const prevChild = () => prev.props.children[j]
        const nextChild = () => next.props.children[i]

        for (i = 0; i < next.props.children.length; i++) {
          while (prevChild().type !== nextChild().type) {
            this.unmount(prevChild())  
            j++
          }
          
          if (prevChild()) {
            if (prevChild().key === nextChild().key) {
              next.props.children[i] = this.diff(prevChild(), nextChild())
              j++
            } else {
              // insert nextChild (keeps prevChild same for next iteration
              this.mount(nextChild(), this.register.fetch(prev.id).$node, i)
            } 
          }
        } 
        // unmount remaining prevChildren
        for(j; j < prev.props.children; j++) {
          this.unmount(prevChild())
        }
      }
    
      // mutation
      if (next.type === 'text') {
        this.updateTextNode(prev, next)
      } 
      // update $node classNames
      this.updateClassNames(prev, next) 

      // updates eventListeners, children
      prev.props = next.props
    }  

    return prev 
  }

  updateTextNode(prev, next) {
    const $node = this.register.fetch(prev.id).$node
    $node[0].textContent = next.props.body
  }

  updateClassNames(prev, next) {

    debugger
    if (prev.props.className === next.props.className) { return }

    const $node = this.register.fetch(prev.id).$node
    const prevClasses = new Set(prev.props.className.split(' '))
    const nextClasses = new Set(next.props.className.split(' '))
    
    $node.removeClass(Array.from(prevClasses).filter(name => !nextClasses.has(name)).join(' '))
    $node.addClass(Array.from(nextClasses).filter(name => !prevClasses.has(name)).join(' '))
  }
}

export default Updater
