const html = require('choo/html')
const details = require('./details.js')
const toolbar = require('./toolbar.js')
const panel = require('./components/panel.js')

module.exports = function (state, emit) {
  return html`
      <div class="h-100 top-0 right-0 fixed flex flex-row-reverse-ns flex-column-reverse">
        <div class="flex flex-column flex-wrap-reverse-ns flex-wrap justify-end w6-ns w-100" style="font-size:0.7rem">
          ${panel(details(state.panels.details? state.selected:null, state.style, emit), state.style)}
        </div>
        ${toolbar(state, emit)}
      </div>
  `
}
