import $ from 'jquery'

const _buildFromObj = obj => (typeof obj.tag === 'function') ?
  new obj.tag(obj.props) : new Component(obj.props, obj)

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

  /* mounting lifecycle methods */
  componentWillMount() {}
  componentDidMount() {}
  render() { return null }

  mounting(parent) {

    this.parent = parent
    // pre-mount
    this.componentWillMount()

    // mount
    this.obj = this.obj || this.render()
    this.reconstruct()

    // post-mount
    this.componentDidMount()
  }

  /* updating lifecycle methods */
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
  }

  // management methods
  setState(nextState, callback) {
    this.updating(this.props, nextState)
    callback(this.state)
  }

  /* construction */

  appendChild(child) {
    this.children.push(child)
    if (child.obj.hasOwnProperty('key')) { this.childKeys[child.key] = child }
  }

  detachChildren() {
    this.children.forEach(child => child.unmounting())
  }

  diff() {

    const obj = this.render()

    // different types
    if (!this.equals(obj)) {

      this.obj = obj
      this.reconstruct()

    // same types, different attributes
    } else {

      // TODO: update node properties
      if (this.obj.html !== obj.html) { this.$node.html(obj.html)}

      this.obj = obj

      this.lazyUpdateChildren()
    }
  }

  equals(obj) {
    return (this.obj && !obj || obj && !this.obj) || this.obj.tag !== obj.tag
  }

  lazyUpdateChildren() {
    // recurse children
    const changed = this.children.some((child, i) =>
      !child.equals(this.obj.children[i]))

    if (changed) {

      const old = this.resetChildren()

      this.obj.children.forEach(child => {
        let newChild;

        if (child.hasOwnProperty('key') && old.childKeys[child.key]) {
          newChild = old.childKeys[child.key]
          newChild.updating(child.props)
        } else {
          newChild = _buildFromObj(child)
          newChild.mounting(this)
        }

        this.appendChild(newChild)
      })
    } else {
      // recursively update
      this.children.forEach((child, i) => {
        const nextProps = this.obj.children[i].props
        child.updating(nextProps)
      })
    }
  }

  reconstruct() {
    this.resetNode()
    this.resetChildren()

    // recursively mount children
    if (this.obj.children) {
      this.obj.children.forEach(child => {
        const newChild = _buildFromObj(child)

        newChild.mounting(this)

        this.appendChild(newChild)

        return newChild
      })
    }
  }

  resetChildren() {
    const old = [this.children, this.childKeys]

    this.detachChildren()
    this.children = []
    this.childKeys = {}

    return old
  }

  resetNode() {
    if (this.$node) this.$node.detach()
    if (this.obj) {
      this.$node = $(`<${this.obj.tag}>${this.obj.inner}</${this.obj.tag}>`)
      this.parent.$node.append(this.$node)
    } else {
      this.$node = null
    }
  }
}

export default Component