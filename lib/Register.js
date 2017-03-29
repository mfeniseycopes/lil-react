import { Component } from './React'

class Register { 

  constructor() {
    this.nextId = 1
    this.registry = {}
  }

  register(element, $node, instance = null) {
    element.id = this.nextId++
    if ($node) $node.data('id', element.id)

    if (instance) {
      Component.bindToId(instance, element.id)
    }

    this.registry[element.id] = { element, $node, instance }
  }

  unregister(id) {
    return delete this.registry[id]
  }

  fetch(id) {
    return this.registry[id]
  }

}

export default Register 
