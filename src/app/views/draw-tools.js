const html = require('choo/html')

//     <div class="w2 h2 pa2"><div class="w1 h1 bg-white"></div></div>
const colorString = (color) => {
  console.log('color', color)
  // return color == null ? '#000' : `rgb(${color.r}, ${color.g}, ${color.b})`
  return color == null ? '#000' : `rgb(${color[0]}, ${color[1]}, ${color[2]})`

}

module.exports = (state, emit) => {
  if (state.drawSynth) {
    console.log('DRAW', state.drawSynth)
    const lines = [{}].concat(state.drawSynth.lines)
    const fileName = html`
    <div class="w4 z-4" onblur="${() => emit('sketches:close')}">
    <input class="bg-black ba white b--white h2 w4" value=${state.sketches.name} oninput=${(e) => emit('sketches:updateName', e.target.value)} type="text" id="file-name" name="file-name"/>
    ${state.sketches.visible ? html`
    <div 
      class="overflow-y-auto h4 ba b--white" 
      onfocusout="${() => emit('sketches:close')}">
      ${Object.keys(state.sketches.all).reverse().map((key) => html`<div class="white bg-black dim pointer" onclick=${(e) => emit('sketches:load', key)}>${key}</div>`)}</div>` : ''}
    </div>
    <div class="tc w2 f6 pa0 pv2 dim pointer ba b--white" onclick=${() => emit('sketches:toggle')}>${state.sketches.visible ? '^' : '...'}</div>
    `

    const lineButtons = html`<div class="flex h2"> 
    <div class="flex"> 
      ${lines.map((line, i) => html`
      <div class=" w2 h2 pa2 b--white ${state.drawSynth.currIndex === i ? "ba" : ""}" onclick=${() => emit('draw:select', i)} style="background-color:${colorString(line.color)}">
        ${i == 0 ? html`<div class="w1 h1 bg-white"></div>` : ''}
      </div>`)}
    </div>
    ${fileName}
    </div>`




    // const presetButtons = html`<div class="flex">${state.presets.all.map((p, i) => html`
    //   <div class="w2 h2 pa2 b--white ${state.presets.selected === i? "ba" : ""}" onclick=${() => emit('editor:preset', i)}>
    //   ${i}</div>`)}
    // </div>`

    const presetButtons = ''

    const midi = state.drawSynth.midi
    const midiDropdown = html`<select onchange=${(e) => emit('midi:select', e.target.value)} class="white bg-black courier h2" name="midi">
     ${midi.outputs.map((m, i) => html`<option value=${i} ${i == midi.currDevice ? "selected" : ""}>${m.name}</option>`)}</select>`


    return html`<div>
    ${lineButtons}
    ${midiDropdown}
    ${presetButtons}
    </div>`

  }
  return html`<div> drawing tools willl go here</div>`
}