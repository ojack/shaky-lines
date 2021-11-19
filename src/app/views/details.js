const html = require('choo/html')

module.exports = (obj, style, emit) => {
  // console.log('object', obj)
  // show paramerties of object
  if(obj === null) return html`<div></div>`

  const { params } = obj

const paramControl = ({ key="", get=()=> {}, set=()=>{}, update=()=>{}, baseValue, code="", type="", step=0.5}) => html`<div>
<div class="dib pr2 pv0 pl1 w3">${key}</div>
<input class="dib w3 pv0 courier" style="border:none; background-color:${style.color0};color:${style.color1}" type=${type} id=${key} name="fname" step="${step}" value=${baseValue} oninput=${(e)=>set(e.target.value)}>
<input class="w4 courier" style="background-color:${style.color0};color:${style.color1};border:none" type="text" value=${code} oninput=${(e)=>{update(e.target.value)}}></input>
</div>`

  return html`<div class="pa2 overflow-y-auto" style="height:20em;">${params.map(paramControl)}</div>`
 
}
