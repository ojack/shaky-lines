const html = require('choo/html')


module.exports = (state, emit) => {
  if(state.drawSynth) {
    console.log('DRAW', state.drawSynth)
    return html`<div>${state.drawSynth.lines.map((line, i) => html`
      <div class="w2 h2" onclick=${() => emit('draw:select', i)} style="background-color:${line._strokeStyle}"></div>`)}
    </div>`

  }
  return html`<div> drawing tools willl go here</div>`
}