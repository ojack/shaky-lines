const html = require('choo/html')
const Component = require('choo/component')
const fsl = require('./../lib/freesound/freesound-livecoding.js')

module.exports = class FreesoundComponent extends Component {
    constructor(id, state, emit) {
        super(id)
        //  console.log("DESKTOP CAPTURER", desktopCapturer, systemPreferences)
        this.local = state.components[id] = {}
        // state.pixi = this
        this.emit = emit
        this.state = state
        this.width = state.style.width
        this.height = state.style.height
  }

  load(element) {
    fsl.init(element)
  }

  update() {
    // console.log('updating')
    return false
  }

  createElement() {
      return html`<div class="f5 black w-100 h-100 overflow-y-auto"></div>`
  }
}