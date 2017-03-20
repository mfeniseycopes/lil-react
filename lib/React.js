export class Component {

  constructor(props) {
    this.props = props
    this.state = {}
  }

  /* mounting lifecycle methods */
  componentWillMount() { console.log('componentWillMount') }
  componentDidMount() { console.log('componentDidMount') }

  /* updating lifecycle methods */
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) { return true }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}

  // unmount lifecycle methods
  componentWillUnmount() { console.log('componentWillUnmount') }

  // management methods
  setState(nextState, callback) {
    this.updating(this.props, nextState)
    callback(this.state)
  }
}

export const createElement = (type, props = {}, ...children) => ({
  type, props: { ...props, children }
})
