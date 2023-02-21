import { EditorState, Compartment } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

import EventEmitter from 'events'
import { setup } from './setup.js'
import { openLintPanel } from  "@codemirror/lint"
import { js_beautify } from 'js-beautify'


export default class Editor extends EventEmitter {
  constructor({ parent = document.body, autocompleteOptions = [] } = {}) {
    super()
    const self = this

    this.cm = new EditorView({
      state: EditorState.create({
        lineWrapping: true,
        extensions:  setup({ autocompleteOptions, emit: (val, text) => {
          console.log('EMITTING', self, val, text)
          self.emit(val,text)
        }
        })
      }),
      parent: parent
    })

     openLintPanel(this.cm)

    window.cm = this.cm
    // this.cm.execCommand('openLintPanel')
  }

  formatCode() {
    const formatted = js_beautify(this.cm.state.doc.toString()
      , { indent_size: 2, "break_chained_methods": true /*"indent_with_tabs": true*/ })
    // this.cm.setValue(formatted)

    this.cm.dispatch({
      changes: { from: 0, to: cm.state.doc.length, insert: formatted }
    })
  }

  setValue(val = '') {
    this.cm.dispatch({
      changes: { from: 0, to: cm.state.doc.length, insert: val }
    })
  }

  toggle() {
    // console.log('TOGGLING', this.cm, this.cm.dom, this.cm.dom.style.opacity)
    if (this.cm.dom.style.opacity == 0) {
      this.cm.dom.style.opacity = 1
    } else {
      this.cm.dom.style.opacity = 0
    }
  }
}



