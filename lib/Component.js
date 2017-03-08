import $ from 'jquery'

class Component {
  
  constructor(props) {
    this.tag = null 
    this.inner = null
    this.children = []
    this.childKeys = {}
    this.props = props 
    this.$node = null
  }

  build(obj) {
    this.buildVirtual(obj)
    this.buildReal()
  }

  buildReal() {
    this.$node = $(`<${this.tag}>${this.inner}</${this.tag}>`)
    this.children.forEach(child => this.$node.append(child.buildReal())) 
    return this.$node
  }
  
  buildVirtual(obj) {
    this.tag = obj.tag
    this.inner = obj.inner 
    this.childKeys = {}
   
    if (obj.children) {
      this.children = obj.children.map(child => {
        let newChild
        debugger
        if (typeof child.tag === 'function') {
          newChild = new child.tag(child.props) 
          newChild.buildVirtual(newChild.render())
        } else {
          newChild = new Component(child.props)
          newChild.buildVirtual(child)
        }
        this.childKeys[child.key] = newChild 
        return newChild
      })
    }

    return this
  }

  className() {
    return this.constructor.name
  }

  attachChildren() {
    this.$node.append(this.children.map(child => child.$node)) 
  }

  detachChildren() {
    this.$node.empty()
  }

  replaceDOM(obj) {
    const $oldNode = this.$node
    this.build(obj)
    $oldNode.replaceWith(this.$node)
  }

  equals(other) {
    return this.tag === other.tag && this.props === other.props
  }

  receiveProps(nextProps) {
    this.props = nextProps
  }

  diff() {

    const obj = this.render()

    if (!this.equals(obj)) {
      // construct otherNode
      this.replaceDOM(obj)  
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
          
          if (child.hasOwnProperty('key') && 
            oldChildKeys.hasOwnProperty(child.key)) {

            nextChild = oldChildKeys[child.key]
          } else {
            if (child.tag instanceof Component) {
              nextChild = new child.tag(child.props) 
              nextChild.build(nextChild.render())
            } else {
              nextChild = new Component(child.props) 
              nextChild.build(child)
            }
          }

          if (child.hasOwnProperty('key')) { this.childKeys[child.key] = nextChild }

          return nextChild 
        })

        this.attachChildren()
      }
    }
  }
}

export default Component
