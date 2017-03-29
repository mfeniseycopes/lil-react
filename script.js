import $ from 'jquery'
import { Component } from './lib/React'
import { render } from './lib/ReactDOM'

class A extends Component {
  render() {
    return {
      type: 'div',
      props: {
        children: [ 
          { type: 'text', body: this.state.a, props: { children: [] } },
          { 
            type: 'button', 
            props: { 
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
    }, {
      type: 'text',
      body: 'hey',
      props: {}
    }] 
  } 
}, $('#root'))


let comp = register.registry[5].instance
comp.setState({ a: 'A' })
