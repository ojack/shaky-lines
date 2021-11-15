const performance = require('./../performance/code-notes.js')

module.exports = (state, emitter) => {
  state.selected = null
  state.style = {
    color0: "salmon",
    color1: "black"
  }
  state.renderer = {
    drawingMode: true
  }
  state.panels = {
    editor: false,
    details: true
  }

  state.emitter = emitter // hacky...pass around emitter so components can directly listen

  emitter.on('select', (obj) => {
    state.selected = obj
    // console.log('selected', e)
    emitter.emit('render')
  })

  emitter.on('loadCode', (index) => {
    const code = performance.presets[index].toString()
    const innerCode = code.substring(code.indexOf("{") + 1,
  code.lastIndexOf("}"))
    state.editor.cm.setValue(innerCode)
    state.editor.eval(innerCode)
    emitter.emit('render')
  })

  emitter.on('render canvas', () => {
    state.fabric.canvas.requestRenderAll()
  })

  emitter.on('toggle', (prop, type="panels") => {
    state[type][prop]  =! state[type][prop]
    emitter.emit('render')
    if(type== "renderer"){
      emitter.emit(`renderer: toggle ${prop}`, state[type][prop])
    }
  })



  emitter.on('deleteCurrentItem', () => {
    console.log(state.fabric.canvas.getActiveObjects())
    state.fabric.canvas.getActiveObjects().forEach((obj) => {
      state.fabric.canvas.remove(obj)
    })
    if(state.selected!== null) {
      // if camera or screenshare, stop tracks
      if(state.selected._originalElement && state.selected._originalElement.srcObject) {
        if (state.selected._originalElement.srcObject.getTracks) {
          state.selected._originalElement.srcObject.getTracks().forEach((track) => {
            track.stop()
          })
        }
      }
      state.fabric.canvas.remove(state.selected)

      state.selected = null
      emitter.emit('render')
    }
  })
}
