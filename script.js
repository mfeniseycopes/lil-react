import Component from './lib/Component'
import { renderToDOM } from './lib/Utility'

window.Component = Component

class ChildComponent extends Component {
  
  render() {
    return {
      html: `<div>${this.props.parent}</div>`,
      children: [
        { html: `<div>${this.props.child1}</div>` },
        { html: `<div>${this.props.child2}</div>` }
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

