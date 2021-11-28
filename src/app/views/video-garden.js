const PIXI = require('pixi.js')
const Rect = require('./pixi-elements/rect.js')
const Drawing = require('./pixi-elements/drawing.js')
const Agent = require('./pixi-elements/agent.js')
const sandbox = require('./pixi-elements/sandbox.js')

import { Sprite } from '@pixi/picture'
var loop = require('raf-loop')

module.exports = class VideoGarden {
  constructor(state, emit, el) {
    // super(id)
    // //  console.log("DESKTOP CAPTURER", desktopCapturer, systemPreferences)
    // this.local = state.components[id] = {}
    state.pixi = this
    this.emit = emit
    //this.drawingMode = state.renderer.drawingMode
    state.emitter.on('renderer: toggle drawingMode', (val) => {
      console.log('toggled drawing mode')
      this.setDrawingMode(val)
    })
    state.emitter.on('renderer:delete element', (el) => {
      console.log('element to be deleted', el)
      el.container.destroy()
    })
    state.emitter.on('renderer:load image', (image) => {
      const texture = PIXI.Texture.from(image)
      const sprite = new Sprite(texture)
      const imageEl = new Agent(emit, sprite)
      // sprite.x = 400,
      // sprite.y = 400
      // sprite.interactive = true
      this.app.stage.addChild(imageEl.container)
      this.setDrawingMode(this.drawingMode)
      imageEl.updatePivot()
    })

    state.emitter.on('select', (obj) => {
      console.log('selected image is', obj)
    })
    this.state = state
    window.PIXI = PIXI
    // this.agents = []
    // window.agents = this.agents

    this.app = new PIXI.Application({
      view: this._canvas,
      backgroundAlpha: 0,
      antialias: true,
      width: this._canvas.width,
      height: this._canvas.height
    })

    const graphicsContainer = new PIXI.Container()


    this.app.stage.addChild(graphicsContainer)

    this.currDrawing = null

    this.app.view.addEventListener('pointerdown', (e) => {
      if (!this.drawingMode) return
      e.target.setPointerCapture(e.pointerId)
      this.currDrawing = new Drawing(this.emit, [e.pageX, e.pageY, e.pressure])
      graphicsContainer.addChild(this.currDrawing.container);
    })

    this.app.view.addEventListener('pointermove', (e) => {
      // console.log('pointer event', e)
      if (e.buttons !== 1) return
      if (!this.drawingMode) return
      // console.log(e.pressure)
      this.currDrawing.add([e.clientX, e.clientY, e.pressure])
      this.currDrawing.render()
    })

    this.app.view.addEventListener('pointerup', (e) => {
      //console.log('on pointer up', e)
      if (!this.drawingMode) return
      this.currDrawing.end()
      this.emit('select', this.currDrawing)
    })

    this.setDrawingMode(this.state.renderer.drawingMode)


    // const graphics = new PIXI.Graphics();

    // graphics.beginFill(0xDE3249);
    // graphics.drawRect(50, 50, 100, 100);
    // graphics.endFill();

    const test = new Rect(this.emit)
    graphicsContainer.addChild(test.container);
   // this.app.stage.addChild(test.control.container)
    this.emit('select', test)

    sandbox(this.app.stage, this.app)

    window.stage = this.app.stage
    window.graphics = this.app.view
    //this.canvas = new fabric.Canvas(t his._canvas)

    let t = 0
    this.app.ticker.add((delta) => {
      t += delta
      graphicsContainer.children.forEach((child) => {
        if (child.params) {
          child.params.forEach((param) => {
            if (param._update) {
              param._update(param.baseValue, t)
            }
          })
        }
      })

      // this.params.forEach((param) => {
      //   if(param._update) {
      //     param._update(param, t)
      //   }
      // })
    })
  }

  setDrawingMode(val) {
    this.drawingMode = val
    const interactive = !this.drawingMode
    this.app.stage.children.forEach((child) => child.interactive = interactive)
  }
}
