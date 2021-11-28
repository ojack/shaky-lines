const html = require('choo/html')
const Component = require('choo/component')
const VideoGarden = require('./video-garden.js')


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
    this.videoGarden = new VideoGarden(this.state, this.emit, this._canvas)
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
    this._canvas.width = width
    this._canvas.height = height
    console.log('canvas', width, height, this._canvas)
    return html`<div class="">${this._canvas}</div>`
  }
}
