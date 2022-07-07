const html = require('choo/html')
const Component = require('choo/component')
// const HydraEditor = require('./editor/editor.js')
const log = require('./editor/log.js')
import HydraEditor from './hydra-editor-cm6/src/editor.js'
import createHydraAutocomplete from './hydra-editor-cm6/src/hydra-autocomplete.js'

module.exports = class Editor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    state.editor = this // hacky way fo sharing editor to rest of app
    this.emit = emit
    console.log('EDITOR is', HydraEditor)
    // state.emitter.on('hydra loaded', () => {
    //   console.log('hydra loaded')
    // })
     this.state = state
  }

  load (el) {
   // el.innerText = 'hi'
    const autocomplete = createHydraAutocomplete(this.state.hydra)
    const editor = new HydraEditor({ parent: this.textEl, 
      autocompleteOptions: autocomplete 
    })

    editor.on("*", (e, args) => {
      this.emit(e, args)
  })

  //   editor.on('editor:evalLine', (line) => {
  //     console.log('called eval line!')
  //     repl.eval(line)
  // })
  
  // editor.on('editor:evalBlock', (line) => {
  //     console.log('called eval line!')
  //     repl.eval(line)
  // })
  
  // editor.on('hideAll', (el, hi) => {
  //     console.log('called', el, hi)
  // })
  
  // editor.on('editor:evalAll', (line) => {
  //     console.log('called eval all!')
  //     repl.eval(line)
  //     console.log('after eval!!')
  // })

  //  log.init(this.logElement)
  //  this.editor = new HydraEditor(this.textEl)
  //  this.editor.on("*", (e, args) => {
  //      this.emit(e, args)
  //  })
  //  // hacky, maybe not necessary
  //  this.innerText = document.getElementsByClassName('CodeMirror')[0]
  }

  hide() {
    this.innerText.style.opacity = 0
  }

  show() {
   // this.innerText.style.opacity = 1
    //this.innerText.style.pointerEvents = 'all'
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
    this.textEl = html` <div></div>`
    this.logElement = html`<div class="console cm-s-default"></div>`
    return html`<div id="editor-container" style="display:flex;flex-direction:column;">
       ${this.textEl}
       ${this.logElement}
       </div>`
  }
}

//       <div style="position:relative;flex:auto;padding:15px" class="red">${this.textEl}</div>
