const html = require('choo/html')

//     <div class="w2 h2 pa2"><div class="w1 h1 bg-white"></div></div>

module.exports = (state, emit) => {
  if(state.drawSynth) {
    console.log('DRAW', state.drawSynth)
    const lines = [{}].concat(state.drawSynth.lines)
    const lineButtons = lines.map((line, i) => html`
    <div class="w2 h2 pa2 b--white ${state.drawSynth.currIndex === i? "ba" : ""}" onclick=${() => emit('draw:select', i)} style="background-color:${line._strokeStyle}">
      ${i == 0?html`<div class="w1 h1 bg-white"></div>`: ''}
    </div>`)

    const presetButtons = html`<div class="flex">${state.presets.all.map((p, i) => html`
      <div class="w2 h2 pa2 b--white ${state.presets.selected === i? "ba" : ""}" onclick=${() => emit('editor:preset', i)}>
      ${i}</div>`)}
    </div>`
    
   
    return html`<div>
    ${lineButtons}
    ${presetButtons}
    </div>`

  }
  return html`<div> drawing tools willl go here</div>`
}