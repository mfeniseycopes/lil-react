const eventTypeMap = {
  click: 'onClick',
  change: 'onChange',
  submit: 'onSubmit',
  select: 'onSelect',
}

class Dispatcher {

  constructor(registry, $container) {
    this.registry = registry     
    
    document.getElementById('root')
      .addEventListener('click', this.clickHandler.bind(this))    
  }

  clickHandler(e) {
    const cb = this.registry.fetchEventHandler(e.target.dataset.id, eventTypeMap[e.type])
    if (cb) cb(e)
  }

}

export default Dispatcher
