import Component from './lib/Component'
import { renderToDOM } from './lib/Utility'

window.Component = Component

class NestedChildComponent extends Component {
  
  render() {
    return {
      tag: 'div',
      inner: this.props.parent,
      children: [
        { tag: 'div', inner: this.props.child1 },
        { tag: 'div', inner: this.props.child2 },
      ]
    }
  }

}

class ChildComponent extends Component {
  
  render() {
    return {
      tag: 'div',
      inner: this.props.parent,
      children: [
        { tag: 'div', inner: this.props.child1 },
        { tag: 'div', inner: this.props.child2 },
        { tag: NestedChildComponent, props: this.props },
      ]
    }
  }
}

const firstProps = {
  parent: 'Papa',
  child1: 'Nino1',
  child2: 'Nino2',
} 

window.testComp = new ChildComponent(firstProps) 

renderToDOM(testComp, '#root')

window.testComp.receiveProps(Object.assign({}, firstProps, { child2: 'Nina2' }))
window.testComp.diff()

