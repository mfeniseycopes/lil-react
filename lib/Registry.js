import { Component } from './React'

class Registry {

  constructor() {
    this.nextId = 1
    this.registry = {}
  }

  register(element, node, instance = null) {
    element.id = this.nextId++

    if (node && element.type !== 'text') node.dataset['id'] = element.id
    if (instance) Component.bindToId(instance, element.id)

    this.registry[element.id] = { element, node, instance }
  }

  unregister(id) {
    return delete this.registry[id]
  }

  fetch(id) {
    return this.registry[id]
  }

  fetchEventHandler(id, event) {
    const { props: { [event]: cb } } = this.fetch(id).element
    return cb
  }

  fetchNode(id) {
    return this.fetch(id).node
  }

}

export default Registry
