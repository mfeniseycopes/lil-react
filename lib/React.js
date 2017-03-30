//import ReactDOM from './ReactDOM'

export class Component {

  constructor(props, updater) {
    this.props = props
    this.state = {}
    this.updater = updater 
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

}

Component.bindSetState = (instance, id) => function(partialState, callback) {
  this.updater.updateState(id, partialState)

  if (callback) { callback(this.state) }
}

Component.bindToId = (instance, id) =>
  instance.setState = Component.bindSetState(instance, id)

export const createElement = (type, props = {}, ...children) => ({
  type, props: { ...props, children }
})

const typeGenerator = type => (props, ...children) => createElement(type, props, ...children)

export const button = typeGenerator('button') 
export const div = typeGenerator('div') 
export const text = typeGenerator('text')
