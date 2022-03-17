const html = require('choo/html')
const devtools = require('choo-devtools')
const choo = require('choo')
const store = require('./app/store.js')
const mainView = require('./views/spirals.js')
// const Fabric = require('./app/views/fabric.js')
const CanvasExperiments = require('./app/views/draw-synth.js')

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


