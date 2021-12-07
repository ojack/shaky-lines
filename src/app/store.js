const performance = require('./../performance/code-notes.js')

module.exports = (state, emitter) => {
  // state.selected = null
  state.style = {
    color0: "black",
    // color1: "aquamarine"
    color1: "white",
    width: 400,
    height: 400
  }
  // state.renderer = {
  //   drawingMode: false
  // }
  state.panels = {
    editor: true,
    details: true,
    files: true
  }

  state.presets = {
    all: new Array(15).fill(""),
    selected: 0
  }

  state.emitter = emitter // hacky...pass around emitter so components can directly listen

  // emitter.on('select', (obj) => {
  //   state.selected = obj
  //   // console.log('selected', e)
  //   emitter.emit('render')
  // })

  // new functions related to drawing synth
  emitter.on('draw:select', (i) => {
    console.log('selected', i)
    state.drawSynth.selectLine(i)
    emitter.emit('render')
  })

  emitter.on('editor:preset', (index) => {
    loadPreset(index)
    emitter.emit('render')
  })

  emitter.on('editor:save', (code) => {
    state.presets.all[state.presets.selected] = code
    console.log('saving to local storate', code)
    localStorage.setItem("spiral-synth", JSON.stringify(state.presets.all))
    const p = localStorage.getItem('spiral-synth')
    if(p) {
      const presets =  JSON.parse(p)
      console.log('got presets!', presets)
    }
  })

  const p = localStorage.getItem('spiral-synth')
  if(p) {
    const presets =  JSON.parse(p)
    state.presets.all = presets
    console.log('got presets!', presets)
  }

  emitter.on('DOMContentLoaded', () => {
    console.log('dom loaded!')
    loadPreset(0)

  })

  function loadPreset(index) {
    state.presets.selected = index
    const code = state.presets.all[state.presets.selected]
    state.editor.cm.setValue(code)
   // state.editor.eval(code)
  }

  ///////////////////////////////
  emitter.on('loadCode', (index) => {
    const code = performance.presets[index].toString()
    const innerCode = code.substring(code.indexOf("{") + 1,
  code.lastIndexOf("}"))
    state.editor.cm.setValue(innerCode)
    state.editor.eval(innerCode)
    emitter.emit('render')
  })



  emitter.on('toggle', (prop, type="panels") => {
    state[type][prop]  =! state[type][prop]
    emitter.emit('render')
    if(type== "renderer"){
      emitter.emit(`renderer: toggle ${prop}`, state[type][prop])
    }
  })



  emitter.on('renderer:delete element', (el) => {
    // console.log(state.fabric.canvas.getActiveObjects())
    // state.fabric.canvas.getActiveObjects().forEach((obj) => {
    //   state.fabric.canvas.remove(obj)
    // })
    if(state.selected!== null) {
      // // if camera or screenshare, stop tracks
      // if(state.selected._originalElement && state.selected._originalElement.srcObject) {
      //   if (state.selected._originalElement.srcObject.getTracks) {
      //     state.selected._originalElement.srcObject.getTracks().forEach((track) => {
      //       track.stop()
      //     })
      //   }
      // }
      // state.fabric.canvas.remove(state.selected)

      state.selected = null
      emitter.emit('render')
    }
  })
}
