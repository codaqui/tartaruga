export type Primitive = number | boolean | string

export class Vector2 {
  constructor(public x: number, public y = 0) {}

  equals(obj: Vector2) {
    if (this.x != obj.x) return false

    if (this.y != obj.y) return false

    return true
  }
}

export type TurtleAction = {
  action: (...params: any[]) => void
  param: Vector2 | Primitive | null
}

export class Turtle {
  private imgData: ImageData
  private startPosition: Vector2
  private startRotation: number
  private actions: TurtleAction[] = []
  private executing: boolean = false
  private running: boolean = false
  private showTurtle: boolean = true
  private saveImgData: boolean = false
  private penWidth: number = 1
  private savedPosition: Vector2
  private savedRotation: number

  constructor(
    private crc: CanvasRenderingContext2D,
    private x = 0,
    private y = 0,
    private rotation = 0,
    private pencilDown = true,
    private penColor = '#000000'
  ) {
    this.imgData = this.crc.getImageData(
      0,
      0,
      crc.canvas.width,
      crc.canvas.height
    )
    this.savedPosition = new Vector2(x, y)
    this.savedRotation = rotation
    this.startPosition = new Vector2(x, y)
    this.startRotation = rotation
    this.save()
    this.drawTurtle()
    this.crc.lineCap = 'round'
  }

  showHistory() {
    console.log(this.actions)
  }

  runAll(): void {
    let oldTurtleShow = this.showTurtle
    let startTime = Date.now()

    this.executing = true
    this.showTurtle = false
    this.saveImgData = false

    for (let i = 0; i < this.actions.length; i++) {
      this.actions[i].action(this.actions[i].param)
    }

    this.showTurtle = oldTurtleShow

    if (this.showTurtle) this.drawTurtle()

    this.executing = false
    this.saveImgData = true

    console.debug(
      `[Tartaruga] Desenhou todos ${this.actions.length} passos, dando ${
        Date.now() - startTime
      } ms. Tempo médio por etapa: ${(
        (Date.now() - startTime) /
        this.actions.length
      ).toPrecision(2)} ms`
    )
  }

  runStepByStep(
    stepsPerSecond = 0,
    callback: (...params: any[]) => any = () => null
  ): void {
    if (stepsPerSecond <= 0) {
      console.error(
        '[Tartaruga] Etapas por segundo é menor que 0. Precisa ser maior que 0. Abortando desenho.'
      )
      return
    }
    if (this.running) {
      console.error(
        '[Tartaruga] A tartaruga já está correndo, não pode iniciar uma nova corrida'
      )
      return
    }
    this.running = true
    this.executing = true
    this.nextStep(stepsPerSecond, 0, callback)
  }

  private nextStep(
    stepsPerSecond: number,
    iteration: number,
    callback: Function
  ) {
    if (iteration >= this.actions.length) {
      console.debug('[Tartaruga] Feito.')
      this.running = false
      this.executing = false
      callback()
      return
    }
    this.actions[iteration].action(this.actions[iteration].param)
    setTimeout(
      this.nextStep.bind(this),
      1000 / stepsPerSecond,
      stepsPerSecond,
      iteration + 1,
      callback
    )
  }

  private drawTurtle() {
    if (!this.showTurtle) return

    this.restore()
    this.crc.beginPath()

    let v2 = this.convertToRotation(new Vector2(-20, 0))

    this.crc.moveTo(this.x + v2.x, this.y + v2.y)

    v2 = this.convertToRotation(new Vector2(0, -20))

    this.crc.lineTo(this.x + v2.x, this.y + v2.y)

    v2 = this.convertToRotation(new Vector2(20, 0))

    this.crc.lineTo(this.x + v2.x, this.y + v2.y)
    this.crc.closePath()
    this.crc.fillStyle = '#fff'
    this.crc.fill()
    this.crc.lineWidth = 0.6
    this.crc.strokeStyle = '#999999'
    this.crc.stroke()
  }

  private convertToRotation(old: Vector2) {
    let x = old.x * Math.cos(this.rotation) - old.y * Math.sin(this.rotation)
    let y = old.x * Math.sin(this.rotation) + old.y * Math.cos(this.rotation)
    return new Vector2(x, y)
  }

  private degreeToRadian(d: number) {
    return (d * Math.PI) / 180
  }

  private radianToDegree(r: number) {
    return (r * 180) / Math.PI
  }

  private save() {
    if (!this.saveImgData) return
    this.imgData = this.crc.getImageData(
      0,
      0,
      this.crc.canvas.width,
      this.crc.canvas.height
    )
  }

  private restore() {
    if (!this.saveImgData) return
    this.crc.putImageData(this.imgData, 0, 0)
  }

  savePos(): void {
    if (!this.executing) {
      this.actions.push({ action: this.savePos.bind(this), param: null })
      return
    }
    this.savedPosition = new Vector2(this.x, this.y)
    this.savedRotation = this.rotation
  }

  restorePos(): void {
    if (!this.executing) {
      this.actions.push({ action: this.restorePos.bind(this), param: null })
      return
    }
    this.x = this.savedPosition.x
    this.y = this.savedPosition.y
    this.rotation = this.savedRotation
  }

  reset(): void {
    this.resetActions()
    this.resetCanvas()
    this.resetTurtle()
  }

  resetCanvas(): void {
    this.crc.clearRect(0, 0, this.crc.canvas.width, this.crc.canvas.height)
    this.save()
    this.drawTurtle()
  }

  // Redefinir tartaruga
  resetTurtle(): void {
    this.x = this.startPosition.x
    this.y = this.startPosition.y
    this.rotation = this.startRotation
    this.drawTurtle()
  }

  // Redefinir ações
  resetActions(): void {
    this.actions = []
  }

  // Siga em frente
  moveForward(px: number): void {
    // console.log(px, this.stepByStep);
    if (!this.executing) {
      this.actions.push({ action: this.moveForward.bind(this), param: px })
      return
    }
    let v2 = this.convertToRotation(new Vector2(0, -px))
    if (this.pencilDown) {
      this.restore()
      this.crc.beginPath()
      this.crc.moveTo(this.x, this.y)
      this.crc.lineTo(this.x + v2.x, this.y + v2.y)
      this.crc.strokeStyle = this.penColor
      this.crc.lineWidth = this.penWidth
      this.crc.stroke()
      this.save()
    }
    this.x += v2.x
    this.y += v2.y
    this.drawTurtle()
  }

  /**
   * Mover para:
   * pode ser:
   *  - um ponto
   *  - um ponto com rotação
   * @param dx 
   * @param y 
   */
  moveTo(dx: Vector2, y?: number): void
  moveTo(dx: number, y: number): void
  moveTo(dx: Vector2 | number, y: number): void {
    if (typeof dx == 'number') {
      if (!this.executing) {
        this.actions.push({
          action: this.moveTo.bind(this),
          param: new Vector2(dx, y),
        })
        return
      }
      this.x = dx
      this.y = y
    } else {
      if (!this.executing) {
        this.actions.push({ action: this.moveTo.bind(this), param: dx })
        return
      }
      this.x = dx.x
      this.y = dx.y
    }
    this.drawTurtle()
  }

  // Mover para trás
  moveBackward(px: number): void {
    // if (!this.stepByStep) this.actions.push({ action: this.moveBackward.bind(this), param: px });
    this.moveForward(px * -1)
    this.drawTurtle()
  }

  // Rode no sentido dos ponteiros do relógio
  rotateClockwise(degree: number): void {
    if (!this.executing) {
      this.actions.push({
        action: this.rotateClockwise.bind(this),
        param: degree,
      })
      return
    }
    this.rotation += this.degreeToRadian(degree)
    this.drawTurtle()
  }

  // Roda no sentido contrário dos ponteiros do relógio
  rotateCounterClockwise(degree: number): void {
    if (!this.executing) {
      this.actions.push({
        action: this.rotateCounterClockwise.bind(this),
        param: degree,
      })
      return
    }
    this.rotation -= this.degreeToRadian(degree)
    this.drawTurtle()
  }

  // Definir Rotação para
  setRotationTo(degree: number): void {
    if (!this.executing) {
      this.actions.push({
        action: this.setRotationTo.bind(this),
        param: degree,
      })
      return
    }
    this.rotation = this.degreeToRadian(degree)
    this.drawTurtle()
  }

  setPen(down: boolean): void {
    if (!this.executing) {
      this.actions.push({ action: this.setPen.bind(this), param: down })
      return
    }
    this.pencilDown = down
  }

  setColor(color: string): void {
    if (!this.executing) {
      this.actions.push({ action: this.setColor.bind(this), param: color })
      return
    }
    this.penColor = color
  }

  setWidth(width: number): void {
    if (!this.executing) {
      this.actions.push({ action: this.setWidth.bind(this), param: width })
      return
    }
    this.penWidth = width
  }

  hide(): void {
    this.showTurtle = false
    this.restore()
  }

  show(): void {
    this.showTurtle = true
    this.drawTurtle()
  }

  getRotation(): number {
    return this.radianToDegree(this.rotation)
  }
}
