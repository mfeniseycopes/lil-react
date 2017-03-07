import $ from 'jquery'

class DOMConnector {

  constructor(Component, obj, selector) {
    debugger
    this.component = new Component(obj)
    this.component.build()
    $(selector).append(this.component.$node) 
  }

}

class Component {
  
  constructor(obj) {
    this.obj = obj
    this.html = null 
    this.children = []
    this.childKeys = {}
    this.props = null 
    this.$node = null
  }

  build() {
    this.buildVirtual()
    this.buildReal()
  }

  buildReal() {
    this.$node = $(this.html)
    this.children.forEach(child => this.$node.append(child.buildReal())) 
    return this.$node
  }
  
  buildVirtual() {
    this.html = this.obj.html
    this.props = this.obj.props
    this.childKeys = {}
   
    if (this.obj.children) {
      this.children = this.obj.children.map(child => {
        const newChild = new Component(child)
        this.childKeys[child.key] = newChild 
        return newChild.buildVirtual()
      })
    }

    return this
  }

  attachChildren() {
    this.$node.append(this.children.map(child => child.$node)) 
  }

  detachChildren() {
    this.$node.empty()
  }

  replaceDOM(obj = null) {
    this.obj = obj ? obj : this.obj 
    const $oldNode = $node
    this.build()
    $oldNode.replace(this.$node)
  }

  equals(other) {
    this.html === other.html && this.props === other.props
  }

  update() {
    const obj = render()

    if (!this.equals(next)) {
      // construct otherNode
      this.replaceDOM()  
    } else {
      // maybs replace children 
      const changed = this.children.some((child, i) => !child.equals(obj.children[i])) 
      
      if (changed) {
        // remove child nodes
        this.detachChildren()

        const oldChildKeys = this.childKeys
        this.childKeys = {}

        this.children = obj.children.map(child => {
          let nextChild
          
          if (oldChildKeys[child.key]) {
            nextChild = oldChildKeys[child.key]
          } else {
            nextChild = new Component(child) 
            nextChild.build()
          }

          this.childKeys[child.key] = nextChild 
          return nextChild 
        })

        this.attachChildren()
      }
    }
  }
}

export { Component, DOMConnector } 
