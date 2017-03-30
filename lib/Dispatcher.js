import $ from 'jquery'

const eventTypeMap = {
  click: 'onClick',
  change: 'onChange',
  submit: 'onSubmit',
  select: 'onSelect',
}

class Dispatcher {

  constructor(tree, $container) {
    this.tree = tree     
    document.getElementById('root')
      .addEventListener('click', this.clickHandler.bind(this))    
  }

  clickHandler(e) {
    const id = e.target.dataset.id
    const event = eventTypeMap[e.type] 
    const cb = this.tree.fetchEventHandler(id, event)
    if (cb) cb(e)
  }

}

export default Dispatcher
