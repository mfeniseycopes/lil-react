import Register from './Register'
import Updater from './Updater'
import Dispatcher from './Dispatcher'

function render(el, $container) {
  const register = new Register()

  window.register = register

  const updater = new Updater(register)
  const dispatcher = new Dispatcher(register, $container)

  updater.mount(el, $container)
}

export { render }
