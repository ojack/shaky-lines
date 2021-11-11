const html = require('choo/html')
const Component = require('choo/component')
const CodeFlask = require('codeflask')

module.exports = class Editor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
  }

  load() {
    const flask = new CodeFlask(this.textEl, { language: 'js' })
  }

  update() {
    return false
  }

  createElement() {
    this.textEl = html`<div id="editor-container" class="w-100 h-100"></div>`
    return html`<div class="w4 h-100 pa3">${this.textEl}</div>`
  }
}
