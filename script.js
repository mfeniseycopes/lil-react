import $ from 'jquery'
import { Component } from './lib/React'
import { render } from './lib/ReactDOM'

class A extends Component {

  constructor(props, updater) {
    super(props, updater)
    this.state = { count: 0 }
  }

  render() {
    return {
      type: 'div',
      props: {
        children: [ 
          { type: 'text', body: `count: ${this.state.count}`, props: { children: [] } },
          { 
            type: 'button', 
            props: { 
              onClick: (e) => {
                this.setState({ count: this.state.count + 1 })
              },
              children: [
                {
                  type: 'text',
                  body: 'click me',
                  props: { children: [] }
                } 
              ] 
            } 
          } 
        ]
      }
    }
  }
}

render({
  type: 'div',
  props: {
    children: [ {
      type: A,
      props: {
        children: []
      }
    }] 
  } 
}, $('#root'))

