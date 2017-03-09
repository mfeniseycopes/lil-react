import Component from './lib/Component'
import { renderToDOM } from './lib/Utility'

window.Component = Component

class TestComponent extends Component {

  render() {
    return {
      tag: 'div',
      inner: '0',
      children: [
        { tag: 'div', inner: '0-0',
          children: [{ tag: 'div', inner: '0-0-0' }] },
        { tag: 'div', inner: '0-1' },
      ]
    }
  }

}

class ChildComponent extends Component {

  render() {
    if (this.props.child2 === 'Nino2') {
      return {
        tag: 'div',
        inner: this.props.parent,
        children: [
          { tag: 'div', inner: this.props.child1 },
          { tag: 'div', inner: this.props.child2 },
          { tag: TestComponent }
        ]
      }
    }
    else {
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
}

const firstProps = {
  parent: 'Papa',
  child1: 'Nino1',
  child2: 'Nino2',
}

window.testComp = new ChildComponent(firstProps)

renderToDOM(testComp, '#root')

window.testComp.updating(Object.assign({}, firstProps, { parent: 'Mama', child2: 'Nina2' }))
