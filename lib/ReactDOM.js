import Registry from './Registry'
import Updater from './Updater'
import Dispatcher from './Dispatcher'

function render(element, container) {
  const registry = new Registry()

  const updater = new Updater(registry)
  const dispatcher = new Dispatcher(registry, container)

  updater.mount(element, container)
}

export { render }
