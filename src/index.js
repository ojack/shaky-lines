const html = require('choo/html')
const devtools = require('choo-devtools')
const choo = require('choo')
const store = require('./app/store.js')
// const Fabric = require('./app/views/fabric.js')
const CanvasExperiments = require('./app/views/draw-synth.js')
const Hydra = require('./app/views/hydra-canvas.js')
const Editor = require('./app/views/editor.js')
const drawTools = require('./app/views/draw-tools.js')
// const controls = require('./app/views/controls.js')
const css = require('insert-css')
const keymaps = require('./app/util/keymaps.js')

css(`.styled-background {
  /* background-color: #f00 !important; */
  background: rgba(0, 255, 255, 0.5) !important;
  mix-blend-mode: difference;
}

.CodeMirror-line span {
  pointer-events: all;
  /*background: #fff;*/
  padding: 2px;
}
  `)


const app = choo()
app.use(devtools())
app.use(store)
app.use(keymaps)
app.route('/', mainView)
app.route('/spirals', mainView)
app.route('*', mainView)


//app.mount('body')
app.mount('#choo')

//       ${state.cache(Editor, 'editor').render({ show: state.panels.editor})}
//      ${controls(state, emit)}

function mainView (state, emit) {
  return html`
    <div class="w-100 h-100 fixed absolute courier flex flex-column flex-row-ns" style="background-color:${state.style.color0};color:${state.style.color1}">
      <div class="relative" style="flex-shrink:0;width:${state.style.width}px;height:${state.style.width}px">
        <div class="absolute" id="hydra-container">${state.cache(Hydra, 'hydra').render({ width: state.style.width, height: state.style.width})}</div>
        <div class=" absolute" id="fabric-container">${state.cache(CanvasExperiments, 'canvas-experiments').render({ width: state.style.width, height: state.style.width})}</div>

      </div>
      <div class="flex-auto">
        ${drawTools(state, emit)}
        ${state.cache(Editor, 'main-editor').render()}

      </div>
    </div>
  `
}
