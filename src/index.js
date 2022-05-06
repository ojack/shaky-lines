const html = require('choo/html')
const devtools = require('choo-devtools')
const choo = require('choo')
const store = require('./app/store.js')
const mainView = require('./app/views/spirals.js')
const algo10 = require('./app/views/algo10.js')
// const Fabric = require('./app/views/fabric.js')

// const controls = require('./app/views/controls.js')
const css = require('insert-css')
const keymaps = require('./app/util/keymaps.js')

css(`.styled-background {
  background-color: #f00 !important;
  background: rgba(0, 255, 255, 0.5) !important;
  mix-blend-mode: difference;
}

.CodeMirror-scroll {
  max-height: 650px;
}

.CodeMirror-line span {
  pointer-events: all;
  background: #fff;
  padding: 2px;
}
  `)


const app = choo({ hash: true })
app.use(devtools())
app.use(store)
app.use(keymaps)
app.route('/', mainView)
app.route('/spirals', mainView)
app.route('/algo10', algo10)
app.route('/#algo10', algo10)

app.route('/spirals/algo10', algo10)
app.route('*', mainView)




//app.mount('body')
app.mount('#choo')

//       ${state.cache(Editor, 'editor').render({ show: state.panels.editor})}
//      ${controls(state, emit)}


