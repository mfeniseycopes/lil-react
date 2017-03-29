const events = ['onClick']
import $ from 'jquery'

class Dispatcher {

  constructor(tree) {
    this.tree = tree     
    $('#root').click(this.clickHandler.bind(this))    
  }

  clickHandler(e) {
    debugger
  }

}

export default Dispatcher
