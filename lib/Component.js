import $ from 'jquery'

class Component {

  constructor(props) {
    this.props = props
    this.state = {}

    this.tag = null
    this.inner = null
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
    debugger
    this.parent = parent
    // pre-mount
    this.componentWillMount()

    // mount
    // get render() obj
    const obj = this.render()
    this.$node = $(`<${obj.tag}>${obj.inner}</${obj.tag}>`)
    // create $node
    this.parent.$node.append(this.$node)
    // recursively mount children
    this.childKeys = {}

    if (obj.children) {
      this.children = obj.children.map(child => {
        let newChild

        if (typeof child.tag === 'function') {
          newChild = new child.tag(child.props)
          newChild.mounting(this)
        } else {
          newChild = new Component(child.props)
          newChild.$node = $(`<${child.tag}>${child.inner}</${child.tag}>`)
          this.$node.append(newChild.$node)
        }

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

  updating(nextProps, nextState) {
    nextProps = nextProps || this.props
    nextState = nextState || this.state
    debugger
    // pre-update
    this.componentWillReceiveProps(nextProps)

    if (this.shouldComponentUpdate(nextProps, nextProps)) {
      this.componentWillUpdate(nextProps, nextProps)

      // update
      this.receive(nextProps, nextState)
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
    this.parent.$node.remove(this.$node)
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
