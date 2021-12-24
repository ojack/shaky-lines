const html = require('choo/html')

//     <div class="w2 h2 pa2"><div class="w1 h1 bg-white"></div></div>
const colorString = (color) => {
  console.log('color', color)
  return color == null ? '#000' : `rgb(${color.r}, ${color.g}, ${color.b})`
}

module.exports = (state, emit) => {
  if(state.drawSynth) {
    console.log('DRAW', state.drawSynth)
    const lines = [{}].concat(state.drawSynth.lines)
    const lineButtons = html`<div class="flex"> ${lines.map((line, i) => html`
    <div class=" w2 h2 pa2 b--white ${state.drawSynth.currIndex === i? "ba" : ""}" onclick=${() => emit('draw:select', i)} style="background-color:${colorString(line.color)}">
      ${i == 0?html`<div class="w1 h1 bg-white"></div>`: ''}
    </div>`)}</div>`

    const presetButtons = html`<div class="flex">${state.presets.all.map((p, i) => html`
      <div class="w2 h2 pa2 b--white ${state.presets.selected === i? "ba" : ""}" onclick=${() => emit('editor:preset', i)}>
      ${i}</div>`)}
    </div>`

    const midi = state.drawSynth.midi
    const midiDropdown = html`<select onchange=${(e) => emit('midi:select', e.target.value)} class="white bg-black courier h2" name="midi">
     ${midi.outputs.map((m, i) => html`<option value=${i} ${i==midi.currDevice?"selected":""}>${m.name}</option>`)}</select>`
    
   
    return html`<div>
    ${lineButtons}
    ${midiDropdown}
    ${presetButtons}
    </div>`

  }
  return html`<div> drawing tools willl go here</div>`
}