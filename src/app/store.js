const performance = require('./../performance/code-notes.js')

module.exports = (state, emitter) => {
  state.selected = null
  state.panels = {
    editor: false,
    details: true
  }
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

  emitter.on('togglePanel', (panel) => {
    state.panels[panel]  =! state.panels[panel]
    emitter.emit('render')
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
