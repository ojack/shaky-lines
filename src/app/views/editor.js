// hydra component
// @todo: remove patch bay from thie (add to config)
const html = require('choo/html')
const Component = require('choo/component')
const repl = require('../util/repl.js')

/* eslint-disable no-eval */
var CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/mode/javascript/javascript')
//require('codemirror/addon/hint/javascript-hint')
//require('codemirror/addon/hint/show-hint')
require('codemirror/addon/selection/mark-selection')
//require('codemirror/addon/comment/comment')

// var Mutator = require('./../src/Mutator.js');

module.exports = class Editor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    this.local.show = state.panels.editor
    // hacky way of accessing events
    state.editor = this
    //this.fontSize = 18
    this.fontSize = 24
    this.emit = emit
    this.eval = repl.eval
  }

  load (element) {
    console.log('loading codemirror', this.textEl)
    this.cm = CodeMirror.fromTextArea(this.textEl, {
      // theme: 'tomorrow-night-eighties',
      value: '',
      mode: {name: 'javascript', globalVars: true},
      lineWrapping: true,
      styleSelectedText: true,
      extraKeys: {
        'Ctrl-Enter': this.evalBlock.bind(this),
        'Ctrl--': this.zoom.bind(this, -1),
        'Ctrl-=': this.zoom.bind(this, 1),
        'Ctrl-S': (e) => { 
          console.log(e)
          //e.preventDefault()
         
          this.emit('editor:save', this.cm.getValue()) 
        }, 
        'Ctrl-D': (e) => { 
          this.emit('editor:download', this.cm.getValue()) 
        }
      }
    })

    // prevent default ctr-s functionality
    document.addEventListener("keydown", function(e) {
      if (e.key === 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
       // alert('captured');
      }
    }, false);

    this.cm.refresh()
    this.codeEl = document.getElementsByClassName('CodeMirror-scroll')[0]
    console.log(this.cm)
    this.cm.setValue('//')
    this.updateVisibility()
    this.zoom(1)

  }

  zoom(direction = 1) {
    this.fontSize = this.fontSize += direction*3
    console.log(this.fontSize, direction)
    //console.log(size)
    this.cm.getWrapperElement().style["font-size"] = `${this.fontSize}px`
    this.cm.refresh()
  }

  evalBlock() {
    repl.eval(this.getCurrentBlock().text)
  }

  updateVisibility() {
   // console.log('showing', this)
    this.codeEl.style.display = this.local.show ? 'block' : 'none'
    this.element.style.display = this.local.show ? 'block' : 'none'
  }

  update (state = {}) {
   // console.log(state)
    this.local = Object.assign({}, this.local, state)
    this.updateVisibility()
    return false
  }

  getLine () {
    var c = this.cm.getCursor()
    var s = this.cm.getLine(c.line)
  //  this.cm.markText({line: c.line, ch:0}, {line: c.line+1, ch:0}, {className: 'styled-background'})
    this.flashCode({line: c.line, ch:0}, {line: c.line+1, ch:0})
    return s
  }

  getCurrentBlock () { // thanks to graham wakefield + gibber
    var editor = this.cm
    var pos = editor.getCursor()
    var startline = pos.line
    var endline = pos.line
    while (startline > 0 && editor.getLine(startline) !== '') {
      startline--
    }
    while (endline < editor.lineCount() && editor.getLine(endline) !== '') {
      endline++
    }
    var pos1 = {
      line: startline,
      ch: 0
    }
    var pos2 = {
      line: endline,
      ch: 0
    }
    var str = editor.getRange(pos1, pos2)

    this.flashCode(pos1, pos2)

    return {
      start: pos1,
      end: pos2,
      text: str
    }
  }

  setValue (val) {
    this.cm.setValue(val)
  }

  getValue () {
    return this.cm.getValue()
  }


  clear () {
    this.cm.setValue('\n \n // Type some code on a new line (such as "osc().out()"), and press CTRL+shift+enter')
  }

  flashCode (start, end) {
  	  if(!start) start = {line: this.cm.firstLine(), ch:0}
  		if(!end) end = {line: this.cm.lastLine() + 1, ch:0}
      var marker = this.cm.markText(start, end, {className: 'styled-background'})
      setTimeout(() =>   marker.clear(), 300)
  }

  createElement (state = {}) {
    this.local = Object.assign({}, this.local, state)
    this.textEl = html`<textarea id="editor-container" class="w-100 h-100"></textarea>`
    return html`<div class="w-100 h-100" style="">${this.textEl}</div>`
  }
}
