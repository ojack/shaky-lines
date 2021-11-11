const html = require('choo/html')
const Component = require('choo/component')
const PIXI = require('pixi.js')
const Agent = require('./pixi-elements/agent.js')
var loop = require('raf-loop')


module.exports = class PixiRenderer extends Component {
  constructor (id, state, emit) {
    super(id)
  //  console.log("DESKTOP CAPTURER", desktopCapturer, systemPreferences)
    this.local = state.components[id] = {}
  }

  toggleDrawing() {

  }

  load (element) {
    console.log('loading')
    this.app = new PIXI.Application({
      view: this._canvas
    })

    // const graphics = new PIXI.Graphics();

    // graphics.beginFill(0xDE3249);
    // graphics.drawRect(50, 50, 100, 100);
    // graphics.endFill();

    const test = new Agent()
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
    style="width:100%;height:100%;" width=${width} height=${height}
    ></canvas>`
    return html`<div class="w-100 h-100">${this._canvas}</div>`
  }
}
