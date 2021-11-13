const html = require('choo/html')
const Component = require('choo/component')
const PIXI = require('pixi.js')
const Agent = require('./pixi-elements/agent.js')
const Drawing = require('./drawing.js')
var loop = require('raf-loop')


module.exports = class PixiRenderer extends Component {
  constructor (id, state, emit) {
    super(id)
  //  console.log("DESKTOP CAPTURER", desktopCapturer, systemPreferences)
    this.local = state.components[id] = {}
    state.pixi = this
    this.emit = emit
    this.drawingMode = true
    this.agents = []
  }

  toggleDrawing() {
    this.drawingMode = false
  }

  load (element) {
    console.log('loading')
    this.app = new PIXI.Application({
      view: this._canvas, 
      backgroundAlpha: 0,
      antialias: true
    })

    this.app.view.addEventListener('pointerdown', (e) => {
      e.target.setPointerCapture(e.pointerId)
      this.currDrawing = new Drawing([e.pageX, e.pageY, e.pressure])
      this.app.stage.addChild(this.currDrawing.el);
    })

    this.app.view.addEventListener('pointermove', (e) => {
      // console.log('pointer event', e)
      if (e.buttons !== 1) return

      this.currDrawing.add([e.clientX, e.clientY, e.pressure])
      this.currDrawing.render()
    })

    // const graphics = new PIXI.Graphics();

    // graphics.beginFill(0xDE3249);
    // graphics.drawRect(50, 50, 100, 100);
    // graphics.endFill();

    const test = new Agent(this.emit)
    this.app.stage.addChild(test.el);

    //this.canvas = new fabric.Canvas(t his._canvas)

  }

 

  update () {
    console.log('updating')
    return false
  }


  createElement ({
    width = window.innerWidth,
    height = window.innerHeight
  } = {}) {
  this._canvas = html`<canvas
    style="" width=${width} height=${height}
    ></canvas>`
    return html`<div class="">${this._canvas}</div>`
  }
}
