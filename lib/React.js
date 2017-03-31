export class Component {

  constructor(props, updater = Component.updater) {
    this.props = props
    this.state = {}
    this.updater = updater
  }

  /* mounting lifecycle methods */
  componentWillMount() {}
  componentDidMount() {}

  /* updating lifecycle methods */
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) { return true }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}

  // unmount lifecycle methods
  componentWillUnmount() {}

}

Component.bindToId = (instance, id) => {
  instance.setState = function(partialState, callback) {
    this.updater.updateState(id, partialState)

    if (callback) callback(this.state)
  }
}

export const createElement = (type, props = {}, ...children) => ({
  type, props: { ...props, children }
})

const elementGenerator = type => (props, ...children) => createElement(type, props, ...children)

export const button = elementGenerator('button')
export const div = elementGenerator('div')
export const text = elementGenerator('text')
