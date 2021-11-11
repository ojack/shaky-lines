const html = require('choo/html')
const devtools = require('choo-devtools')
const choo = require('choo')
const store = require('./app/store.js')
const Fabric = require('./app/views/fabric.js')
const Pixi = require('./app/views/pixi.js')
const Hydra = require('./app/views/hydra-canvas.js')
const Editor = require('./app/views/editor.js')
const details = require('./app/views/details.js')
const toolbar = require('./app/views/toolbar.js')
const css = require('insert-css')
const keymaps = require('./app/keymaps.js')

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

// <div class="flex justify-between pa1">
//   <!--i
//         class="fas fa-times self-end dim pointer pa1 mid-gray"
//         title="close ${label}"
//         aria-hidden="true"
//         onclick=${() => {
//           emit('layout:toggleMenuItem', name, type)
//         }} >
//   </i-->
// </div>
const floating = ( content, show) => {
  return html`
        <div class="w-100 panel flex flex-column">
          <div class="pa3 pt0">
            ${content}
          </div>
        </div>
      `
}

//      <div class="w-100 h-100 absolute" id="fabric-container">${state.cache(Fabric, 'fabric').render()}</div>

  // ${state.cache(Editor, 'editor').render()}
function mainView (state, emit) {
  return html`
    <div class="w-100 h-100 absolute courier bg-black">
      <div class="w-100 h-100 absolute" id="hydra-container">${state.cache(Hydra, 'hydra').render()}</div>
      <div class="w-100 h-100 absolute" id="fabric-container">${state.cache(Pixi, 'pixi').render()}</div>
      <div class="fixed w-100 h-100 top-0 left-0 pa2" style="pointer-events:none">
        ${state.cache(Editor, 'editor').render({ show: state.panels.editor})}
      </div>
      <div class="flex flex-column fixed bottom-0 right-0 w5" style="font-size:0.7rem">
        ${floating(details(state.panels.details? state.selected:null, emit))}
      </div>
      ${toolbar(state, emit)}
    </div>
  `
}
