import $ from 'jquery'

class Component {

  constructor(props, obj = null) {
    this.props = props
    this.state = {}

    this.obj = obj
    this.children = []
    this.childKeys = {}
    this.parent = null
    this.$node = null
  }

  // mounting lifecycle methods
  componentWillMount() {}
  componentDidMount() {}
  render() { return null }

  mounting(parent) {
    
    this.parent = parent
    // pre-mount
    this.componentWillMount()

    // mount
    // get render() obj
    this.obj = this.obj || this.render()
    this.$node = $(`<${this.obj.tag}>${this.obj.inner}</${this.obj.tag}>`)
    // create $node
    this.parent.$node.append(this.$node)
    // recursively mount children
    this.childKeys = {}

    if (this.obj.children) {
      this.children = this.obj.children.map(child => {
        const newChild = (typeof child.tag === 'function') ?
          new child.tag(child.props) : new Component(child.props, child)

        newChild.mounting(this)

        if (newChild.hasOwnProperty('key')) {
          this.childKeys[child.key] = newChild
        }
        return newChild
      })
    }

    // post-mount
    this.componentDidMount()
  }



  // updating lifecycle methods
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) { return true }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}

  receive(nextProps, nextState) {
    const prev = [this.props, this.prevState]
    this.props = nextProps
    this.state = nextState
    return prev
  }

  updating(nextProps, nextState) {
    nextProps = nextProps || this.props
    nextState = nextState || this.state
    
    // pre-update
    this.componentWillReceiveProps(nextProps)

    if (this.shouldComponentUpdate(nextProps, nextProps)) {
      this.componentWillUpdate(nextProps, nextProps)

      // update
      const [prevProps, prevState] = this.receive(nextProps, nextState)
      this.diff()

      // post-update
      this.componentDidUpdate(prevProps, prevState)
    } else {
      this.receive(nextProps, nextState)
    }
  }

  // unmount lifecycle methods
  componentWillUnmount() {}

  unmounting() {
    this.componentWillUnmount()
    this.$node.detach()
    //this.parent.$node.remove(this.$node)
  }

  // management methods
  setState(nextState, callback) {
    this.updating(this.props, nextState)
    callback(this.state)
  }

  build(obj = null) {
    obj = obj || this.render()
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
    this.children.forEach(child => child.unmounting())
  }

  // replaceDOM(obj) {
  //   // const $oldNode = this.$node
  //   // this.build(obj)
  //   // $oldNode.replaceWith(this.$node)
  //   this.obj = obj
  //   this.$node = $(`<${this.obj.tag}>${this.obj.inner}</${this.obj.tag}>`)
  //   // create $node
  //   this.parent.$node.append(this.$node)
  // }

  equals(obj) {
    return (this.obj && !obj || obj && !this.obj) || this.obj.tag !== obj.tag
  }

  receiveProps(nextProps) {
    this.props = nextProps
  }

  diff() {

    const obj = this.render()

    // different types
    if (this.equals(obj)) {

      // detach all children
      this.detachChildren()
      this.children = []
      this.childKeys = {}

      // change this node
      this.obj = obj
      //this.parent.$node.remove(this.$node)
      if (this.$node) this.$node.detach()

      if (this.obj !== null) {
        this.$node = $(`<${this.obj.tag}>${this.obj.inner}</${this.obj.tag}>`)
        this.parent.$node.append(this.$node)

        // remount all children
        if (this.obj.children) {
          this.children = this.obj.children.map(child => {
            const newChild = child.tag instanceof String ? 
              new Component(child.props) : new child.tag(child.props)

            newChild.mounting(this)

            if (child.hasOwnProperty('key')) { 
              this.childKeys[child.key] = newChild 
            }
          }) 
        }
      } else {
        this.$node = null
      }

    } else { // same types, different attributes
      // update this node
      this.obj = obj

      // recurse children
      const changed = this.children.some((child, i) => 
        !child.equals(obj.children[i]))
     
      if (changed) {
        this.detachChildren()

        const oldKeys = this.childKeys
        this.childKeys = {}

        this.children = this.obj.children.map(child => {
          let newChild;
          if (child.hasOwnProperty('key') && this.childKeys[child.key]) {
            newChild = this.childKeys[child.key]
            newChild.updating(child.props)
            childKeys[child.key] = newChild
          } else {
            debugger
            newChild = typeof child.tag === "string" ? 
              new Component(child.props, child) : new child.tag(child.props)

            newChild.mounting(this)
          }

          return newChild
        })
      } else {
        // recursively update  
        this.children.forEach((child, i) => {
          const nextProps = obj.children[i].props
          child.updating(nextProps)
        })
      }
    }




    if (!this.equals(this.obj)) {
      // construct otherNode
      // this.replaceDOM(obj)
      debugger
    } else {
      // maybs replace children
      const changed = this.children.some((child, i) => !child.equals(this.obj.children[i]))

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
            nextChild.updating(child.props, nextChild.state)
          } else {
            if (child.tag instanceof Component) {
              nextChild = new child.tag(child.props)
              nextChild.mounting(this)
            } else {
              nextChild = new Component(child.props)
              nextChild.mounting(this)
            }
          }

          if (child.hasOwnProperty('key')) { this.childKeys[child.key] = nextChild }

          return nextChild
        })

        // this.attachChildren()
      }
    }
  }
}

export default Component
