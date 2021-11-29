const html = require('choo/html')
const Component = require('choo/component')
const VideoGarden = require('../lib/video-garden.js')
const DrawSynth = require('../lib/drawSynth.js')


module.exports = class PixiRenderer extends Component {
  constructor(id, state, emit) {
    super(id)
    //  console.log("DESKTOP CAPTURER", desktopCapturer, systemPreferences)
    this.local = state.components[id] = {}
    // state.pixi = this
    this.emit = emit
    this.state = state
  }

  load(element) {
    //this.videoGarden = new VideoGarden(this.state, this.emit, this._canvas)
    const drawSynth = new DrawSynth(this.state, this.emit, this._canvas)
  }



  update() {
    // console.log('updating')
    return false
  }


  createElement({
    width = window.innerWidth,
    height = window.innerHeight
  } = {}) {
    this._canvas = html`<canvas
    style="" width="${width}px" height="${height}px"
    ></canvas>`
    width = 800
    height = 800
    this._canvas.width = width
    this._canvas.height = height
    console.log('canvas', width, height, this._canvas)
    return html`<div class="" id="canvas-experiments">${this._canvas}</div>`
  }
}
