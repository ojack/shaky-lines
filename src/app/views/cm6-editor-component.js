const html = require('choo/html')
const Component = require('choo/component')
const HydraEditor = require('./editor/editor.js')
const log = require('./editor/log.js')
import Editor from './hydra-editor-cm6/src/editor.js'
import repl from './hydra-editor-cm6/src/hydra-environment/repl.js'
import createHydraAutocomplete from './hydra-editor-cm6/src/hydra-autocomplete.js'

module.exports = class Editor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    state.editor = this // hacky way fo sharing editor to rest of app
    this.emit = emit
  }

  load (element) {
   log.init(this.logElement)
   this.editor = new HydraEditor(this.textEl)
   this.editor.on("*", (e, args) => {
       this.emit(e, args)
   })
   // hacky, maybe not necessary
   this.innerText = document.getElementsByClassName('CodeMirror')[0]
  }

  hide() {
    this.innerText.style.opacity = 0
  }

  show() {
    this.innerText.style.opacity = 1
    this.innerText.style.pointerEvents = 'all'
  }

  update (state) {
    console.log('state', state)
    //  if(typeof state !== 'undefined') {
      if(state.panels.editor === false) {
        console.log('hiding')
        this.hide()
    } else {
        this.show()
    }
  // }
    return false
  }

  createElement ({ width = window.innerWidth, height = window.innerHeight} = {}) {
    this.textEl = html` <textarea></textarea>`
    this.logElement = html`<div class="console cm-s-default"></div>`
    return html`<div id="editor-container" style="display:flex;flex-direction:column;">
       <div style="position:relative;flex:auto;padding:15px" class="red">${this.textEl}</div>
       ${this.logElement}
       </div>`
  }
}
