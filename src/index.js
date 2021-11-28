const html = require('choo/html')
const devtools = require('choo-devtools')
const choo = require('choo')
const store = require('./app/store.js')
// const Fabric = require('./app/views/fabric.js')
const CanvasExperiments = require('./app/views/canvas-experiments.js')
const Hydra = require('./app/views/hydra-canvas.js')
const Editor = require('./app/views/editor.js')
const controls = require('./app/views/controls.js')
const css = require('insert-css')
const keymaps = require('./app/util/keymaps.js')

css(`.styled-background {
  /* background-color: #f00 !important; */
  background: rgba(0, 255, 255, 0.5) !important;
  mix-blend-mode: difference;
}

.CodeMirror-line span {
  pointer-events: all;
  background: #fff;
  padding: 2px;
}
  `)

const app = choo()
app.use(devtools())
app.use(store)
app.use(keymaps)
app.route('/', mainView)
//app.mount('body')
app.mount('#choo')


function mainView (state, emit) {
  return html`
    <div class="w-100 h-100 fixed absolute courier" style="background-color:${state.style.color0};color:${state.style.color1}">
      <div class="w-100 h-100">
        <div class="w-100 h-100 absolute" id="hydra-container">${state.cache(Hydra, 'hydra').render()}</div>
        <div class="w-100 h-100 absolute" id="fabric-container">${state.cache(CanvasExperiments, 'canvas-experiments').render()}</div>
        <div class="fixed w-100 h-100 top-0 left-0 pa2" style="pointer-events:none">
          ${state.cache(Editor, 'editor').render({ show: state.panels.editor})}
        </div>
      </div>
      ${controls(state, emit)}
    </div>
  `
}
