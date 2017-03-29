const events = ['onClick']
import $ from 'jquery'

class Dispatcher {

  constructor(tree, $container) {
    this.tree = tree     
    document.getElementById('root')
      .addEventListener('click', this.clickHandler.bind(this))    
  }

  clickHandler(e) {
    this.tree.fetch(e.target.dataset.id).element.props.onClick(e)
  }

}

export default Dispatcher
