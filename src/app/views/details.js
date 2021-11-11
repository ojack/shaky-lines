const html = require('choo/html')

module.exports = (obj, emit) => {
  // show properties of object
  if(obj === null) return html`<div></div>`
  const input = (key, value) => {
    const handleInput = (e) => {
    //  console.log(key, e.target.value, typeof e.target.value, parseFloat(e.target.value))
      let val = typeof value === 'number' ? parseFloat(e.target.value) : e.target.value
      obj.set(key, val)
    //obj.set('top', 224)
      emit('render canvas')
    }
    let type = 'text'
    if(typeof value === 'number') type = 'number'
  //  console.log(value, typeof value)
    return html`<div>
      <div class="dib pr2 gray bg-white pv0 pl1">${key}:</div>
      <input style="border:none" class="dib w4 bg-white pv0" type=${type} id=${key} name="fname" value=${value} oninput=${handleInput}>
    </div>`
  }
  return html`<div class="pa2 overflow-y-auto" style="height:20em;">${obj.stateProperties.map((prop) => input(prop, obj[prop]))}</div>`
}
