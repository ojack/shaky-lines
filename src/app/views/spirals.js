const html = require('choo/html')

const Hydra = require('./hydra-canvas.js')
const Editor = require('./editor.js')
const drawTools = require('./draw-tools.js')
const CanvasExperiments = require('./draw-synth.js')

module.exports = function mainView (state, emit) {
    return html`
      <div class="w-100 h-100 fixed absolute courier flex flex-column flex-row-ns" style="background-color:${state.style.color0};color:${state.style.color1}">
        <div class="relative" style="flex-shrink:0;width:${state.style.width}px;height:${state.style.height}px">
          <div class="absolute" id="hydra-container">${state.cache(Hydra, 'hydra').render({ width: state.style.width, height: state.style.height})}</div>
          <div class=" absolute" id="fabric-container">${state.cache(CanvasExperiments, 'canvas-experiments').render({ width: state.style.width, height: state.style.height})}</div>
  
        </div>
       <!-- <div class="absolute top-0 right-0 w6 h6 ma4" style="box-shadow: 2px 2px 6px 6px rgba(40, 40, 40, 0.3);background-color:${state.style.color0}"> -->
       <div class="flex-auto flex flex-column">
          ${drawTools(state, emit)}
          ${state.cache(Editor, 'main-editor').render()}
        </div>
      </div>
    `
  }