const html = require('choo/html')

// property types for different properties:
// -- 'xy' : PIXI observable point
// --
// const params = [ 
//   { key: 'scale', type: 'xy' }, 
//   { key: 'skew', type: 'xy' }, 
//   { key: 'position', type: 'xy'},
//   { key: 'angle', type: 'number'},
//   { key: 'tint', type: 'number'}
// ]

//'rotation', 'width', 'height','position', 'fill']



module.exports = (obj, style, emit) => {
  // console.log('object', obj)
  // show paramerties of object
  if(obj === null) return html`<div></div>`

  console.log('selected obj', obj)

  const { params } = obj

  const showParam = (key="", value = "", handleInput=()=>{}, type="") => html`<div>
    <div class="dib pr2 pv0 pl1 w4">${key}:</div>
    <input class="dib w4 pv0" style="border:none; background-color:${style.color0};color:${style.color1}" type=${type} id=${key} name="fname" step="0.5" value=${value} oninput=${handleInput}>
   </div>`
 
const showXY = (key, point) => {
  // console.log('type', typeof point)
  return ['x', 'y'].map((i) => showParam(
  `${key}${i}`,point[i], (e) => point.set(e.target.value)
  ))
}

const showNumber = (key, val, parent) => showParam(
  key, val, (e) => { parent[key] = e.target.value}
)

const showByType = {
  xy: showXY,
  number: showNumber
}

const paramControl = ({ key="", value=()=> {}, set=()=>{}, type="", step=0.5}) => html`<div>
<div class="dib pr2 pv0 pl1 w4">${key}:</div>
<input class="dib w4 pv0" style="border:none; background-color:${style.color0};color:${style.color1}" type=${type} id=${key} name="fname" step="${step}" value=${value()} oninput=${(e)=>set(e.target.value)}>
</div>`

  // return html`<div class="pa2 overflow-y-auto" style="height:20em;">${params.map((param) => showByType[param.type](param.key, obj[param.key], obj))}</div>`

  return html`<div class="pa2 overflow-y-auto" style="height:20em;">${params.map(paramControl)}</div>`
  // const input = (key, value) => {
  //   const handleInput = (e) => {
  //   //  console.log(key, e.target.value, typeof e.target.value, parseFloat(e.target.value))
  //     let val = typeof value === 'number' ? parseFloat(e.target.value) : e.target.value
  //     obj.set(key, val)
  //   //obj.set('top', 224)
  //     emit('render canvas')
  //   }
  //   let type = 'text'
  //   if(typeof value === 'number') type = 'number'
  // //  console.log(value, typeof value)
  //   return html`<div>
  //     <div class="dib pr2 gray bg-white pv0 pl1">${key}:</div>
  //     <input style="border:none" class="dib w4 bg-white pv0" type=${type} id=${key} name="fname" value=${value} oninput=${handleInput}>
  //   </div>`
  // }
  // return html`<div class="pa2 overflow-y-auto" style="height:20em;">${obj.stateparamerties.map((param) => input(param, obj[param]))}</div>`
}
