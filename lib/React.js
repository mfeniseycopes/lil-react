import ReactDOM from './ReactDOM'
export class Component {

  constructor(props, el) {
    this.props = props
    this.state = {}
    this.el = el
  }

  /* mounting lifecycle methods */
  componentWillMount() { console.log('componentWillMount') }
  componentDidMount() { console.log('componentDidMount') }

  /* updating lifecycle methods */
  componentWillReceiveProps(nextProps) { console.log('componentWillReceiveProps') }
  shouldComponentUpdate(nextProps, nextState) { console.log('componentShouldUpdate'); return true }
  componentWillUpdate(nextProps, nextState) { console.log('componentWillUpdate')}
  componentDidUpdate(prevProps, prevState) { console.log('componentDidUpdate') }

  // unmount lifecycle methods
  componentWillUnmount() { console.log('componentWillUnmount') }

  // management methods
  setState(partialState, callback) {
    debugger
    ReactDOM._updateState(this, partialState)
    if (callback) { callback(this.state) }
  }
}

export const createElement = (type, props = {}, ...children) => ({
  type, props: { ...props, children }
})
