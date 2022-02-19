import { queryElement, queryGroupBySelector } from './utils/dom'
import { TurtleElement, TurtleSelectors } from './types/element'
import { Turtle } from './core/turtle'


let turtle: Turtle

/**
 * Implementar interpretador de comandos
 * recebidos do formulário em JSON para
 * manipulação da tartaruga com actions
 */
function turtleHandler() {
  
}


document.addEventListener('DOMContentLoaded', init)

function init() {
  const canvas = queryElement('canvas')

  const element = queryGroupBySelector<TurtleSelectors, TurtleElement>({
    form: 'form',
    select: 'select',
    canvas: 'canvas',
    outputCommands: 'output > pre',
    moveOptsTmpl: '#move__options',
    rotateOptsTmpl: '#rotate__options',
    containerOption: '#container-option',
  })

  element.select.oninput = () => {
    switch (element.select.value) {
      case 'move': {
        const el = element.moveOptsTmpl.content.cloneNode(true)
        element.containerOption.innerHTML = ''
        element.containerOption.appendChild(el)
        break
      }
      case 'rotate': {
        const el = element.rotateOptsTmpl.content.cloneNode(true)
        element.containerOption.innerHTML = ''
        element.containerOption.appendChild(el)
        break
      }
      default: {
        element.containerOption.innerHTML = ''
        element.outputCommands.innerHTML = ''
        break
      }
    }
  }

  element.form.onsubmit = (e) => {
    e.preventDefault()

    const data = new FormData(element.form)

    const cmd = Object.fromEntries(data.entries())
    element.outputCommands.innerHTML = JSON.stringify(cmd, null, 2)
  }


  /**
   * Refatorar este código para handler
   * da tartaruga via comandos do form.
   */

  const crc = canvas.getContext('2d')

  const x = canvas.width / 2 + 30
  const y = canvas.height / 2 + 30

  if (crc) {
    turtle = new Turtle(crc, x, y)

    turtle.hide()

    // turtle.savePos()
    turtle.setWidth(8)

    for (let i = 0; i < 36; i++) {
      turtle.setColor('hsl(' + 10 * i + ', 100%, 50%)')
      turtle.restorePos()
      turtle.rotateClockwise(10)

      turtle.savePos()

      for (let k = 0; k < 36; k++) {
        turtle.moveForward(5)
        turtle.rotateClockwise(3)
      }
    }

    turtle.runStepByStep(100, () => {
      turtle.show()
      console.log('terminou')
    })
  }
}
