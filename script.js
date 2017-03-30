import { Component, createElement, button, div, text } from './lib/React'
import { render } from './lib/ReactDOM'

class A extends Component {

  constructor(props, updater) {
    super(props, updater)
    this.state = { count: 0 }
  }

  render() {

    return (
      div({ className: this.state.count % 2 ? 'blue' : 'red' },
        text(
          { body: `count: ${this.state.count}` }),
        button(
          { onClick: e => this.setState({ count: this.state.count + 1 }),
            className: this.state.count % 2 ? 'red' : 'blue'},
          text(
            { body: 'click me' }),
        ),
        createElement(B)
      )
    )
  }
}

class B extends Component {
  render() {
    return div(null,
      text({ body: 'Hello!' }))
  }
}

render(div(null, createElement(A)), document.getElementById('root'))
