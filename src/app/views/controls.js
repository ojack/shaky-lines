const html = require('choo/html')
const toolbar = require('./toolbar.js')
const panel = require('./components/panel.js')

// individual panel renderers
const details = require('./details.js')
const Files = require('./files.js')

module.exports = function (state, emit) {
  const files = (props = {}) => state.cache(Files, 'files').render(props)

  const showPanel = (key, component, props) => panel(component(props, state.style, emit), {
    name: key,
    label: key,
    showPanel: state.panels[key]
  }, state.style, emit)
  return html`
      <div style="pointer-events:none" class="h-100 top-0 right-0 fixed flex flex-row-reverse-ns flex-column-reverse">
         ${toolbar(state, emit)}

        <div style="pointer-events:none;" class="flex flex-column flex-wrap-reverse-ns flex-wrap justify-end w6-ns w-100" style="font-size:0.7rem">
          ${showPanel('details', details, state.selected)}
          ${showPanel('files', files, {})}

        </div>
      </div>
  `
}


// panel(details(state.panels.details? state.selected:null, state.style, emit),{
//   name: 'details',
//   label: 'params',
//   showPanel: state.panels.details && state.selected !== null
// }, state.style, emit)