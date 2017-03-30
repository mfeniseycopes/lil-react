import Register from './Register'
import Updater from './Updater'
import Dispatcher from './Dispatcher'

function render(element, container) {
  const register = new Register()

  const updater = new Updater(register)
  const dispatcher = new Dispatcher(register, container)

  updater.mount(element, container)
}

export { render }
