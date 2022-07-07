const performance = require('./../performance/code-notes.js')
const examples = require('./examples.js')
// const repl = require('./views/editor/repl.js')
const repl = require('./views/hydra-editor-cm6/src/hydra-environment/repl.js').default

module.exports = (state, emitter) => {
  // state.selected = null
  state.flok = {
    enabled: false,
    url: "https://flok.clic.cf/s/rarefaccio?layout=hydra&noHydra=1&bgOpacity=0&readonly=1",
  }

  state.style = {
    color1: "#eee",
    color0: "#000",
    //color0: "pink",
    // color0: "#faeb15",
    // color1: "black",
    // color1: "aquamarine"
    // width: window.innerWidth < 900 ? 400 : 800,
    // height: window.innerWidth < 900 ? 400 : 800
    width: window.innerHeight,
    height: window.innerHeight
    // width: 800,
    // height: 800
  }
  // state.renderer = {
  //   drawingMode: false
  // }
  state.panels = {
    editor: true,
    details: true,
    files: true
  }

  state.sketches = {
    name: "",
    all: {},
    visible: false
  }

  // state.sketchList = {
  //   visible: true
  // }

  // state.presets = {
  //   // all: new Array(15).fill(""),
  //   // selected: 0,
  //   name: 'sketch1'
  // }

  state.emitter = emitter // hacky...pass around emitter so components can directly listen

  // emitter.on('select', (obj) => {
  //   state.selected = obj
  //   // console.log('selected', e)
  //   emitter.emit('render')
  // })

  // new functions related to drawing synth
  emitter.on('draw:select', (i) => {
    // console.log('selected', i)
    state.drawSynth.selectLine(i)
    emitter.emit('render')
  })

  emitter.on('hideAll', () => {
    state.panels.editor = !state.panels.editor
    emitter.emit('render')
  })

  emitter.on('midi:select', (i) => {
    console.log('selected midi', i)
    state.drawSynth.midi.select(parseFloat(i))
    emitter.emit('render')
  })

  emitter.on('sketches:updateName', (val) => {
    console.log('updating name', val)
    state.sketches.name = val
    emitter.emit('render')
  })

  emitter.on('sketches:toggle', () => {
    state.sketches.visible = !state.sketches.visible
    emitter.emit('render')
  })


  emitter.on('editor:evalAll', function (line) {
    // const editor = state.editor.editor
    // const code = editor.getValue()
    // repl.eval(code, (string, err) => {
    //   editor.flashCode()
    //   //  if (!err) sketches.saveLocally(code)
    // })
    repl.eval(line)
  })

  emitter.on('editor:evalLine', (line) => {
    console.log('REPL', repl)
    repl.eval(line)
  })

  emitter.on('editor:evalBlock', (block) => {
    repl.eval(block)
  })

  // emitter.on('editor:preset', (index) => {
  //   loadPreset(index)
  //   emitter.emit('render')
  // })

  emitter.on('sketches:load', (key) => {
    loadCode(key)
    state.sketches.visible = false
    emitter.emit('render')
  })


  emitter.on('editor:download', (code) => {
    screencap()
    const text = code
    const data = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a')
    a.style.display = 'none'
    let d = new Date()
    a.download = `${state.sketches.name}-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}.js`
    a.href = URL.createObjectURL(data)
    a.click()

    setTimeout(() => {
      window.URL.revokeObjectURL(a.href);
    }, 300);
  })

  emitter.on('editor:save', (code) => {
    // state.presets.all[state.presets.selected] = {
    //   code: code,
    //   name: state.presets.name
    // }
    console.log('saving to local storate', code)

    state.sketches.all[state.sketches.name] = code

    localStorage.setItem("spiral-synth", JSON.stringify(state.sketches.all))

    emitter.emit('render')
    // const p = localStorage.getItem('spiral-synth')
    // if(p) {
    //   const presets =  JSON.parse(p)
    //   console.log('got presets!', presets)
    // }

  })

  state.sketches.all = examples

  const p = localStorage.getItem('spiral-synth')
  if (p) {
    state.sketches.all = Object.assign({}, state.sketches.all, JSON.parse(p))
    //   // state.presets.all = presets
    //   // state.presets.all = presets.map((_p, i) => ({
    //   //   name: _p.name,
    //   //   code: _p.code
    //   // }))
    //   // console.log('got presets!', presets)
    //   //state.sketches = JSON.parse(p)
  }


  emitter.on('DOMContentLoaded', () => {
    console.log('dom loaded!')
    // loadPreset(0)

    state.drawSynth.midi.on('device update', (inputs, outputs) => {
      emitter.emit('render')
    })
  })

  function loadCode(key) {
    state.sketches.name = key
    console.log('loading', key, state.sketches)
    // const p = state.presets.all[state.presets.selected]
    // state.presets.name = p.name
    state.editor.editor.setValue(state.sketches.all[key])
    emitter.emit('render')
    // state.editor.eval(code)
  }
  // function loadPreset(index) {
  //   state.presets.selected = index
  //   const p = state.presets.all[state.presets.selected]
  //   state.presets.name = p.name
  //   state.editor.cm.setValue(p.code)
  //  // state.editor.eval(code)
  // }

  ///////////////////////////////
  // emitter.on('loadCode', (index) => {
  // //   const code = performance.presets[index].toString()
  // //   const innerCode = code.substring(code.indexOf("{") + 1,
  // // code.lastIndexOf("}"))
  // //   state.editor.cm.setValue(innerCode)
  // //   state.editor.eval(innerCode)
  //   emitter.emit('render')
  // })



  emitter.on('toggle', (prop, type = "panels") => {
    state[type][prop] = !state[type][prop]
    emitter.emit('render')
    if (type == "renderer") {
      emitter.emit(`renderer: toggle ${prop}`, state[type][prop])
    }
  })



  emitter.on('renderer:delete element', (el) => {
    // console.log(state.fabric.canvas.getActiveObjects())
    // state.fabric.canvas.getActiveObjects().forEach((obj) => {
    //   state.fabric.canvas.remove(obj)
    // })
    if (state.selected !== null) {
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

  /* flok loading code */
  if (state.flok.enabled === true) {
    let hasSynced = false
    let timeout = null
    // execute editor events on global context
    window.addEventListener("message", function (event) {
      //console.log('received message', event)
      if (event.data) {
        if (event.data.cmd === "evaluateCode") {
          //  console.log('evaluate', event.data.args.body)
          // editor.style.opacity = 1
          //  if(readOnly) setTimeout(() => editor.style.opacity = 1, 2000)
          //  if (event.data.args.editorId == 1) {
          //  agua.run(event.data.args.body)
          //  } else {
          eval(event.data.args.body)
          //  }

        } else if (event.data.cmd === "initialSync") {
          if (!hasSynced) {
            const editorText = event.data.args.editors
            if (editorText[0]) eval(editorText[0])
            //if(editorText[1]) agua.run(editorText[1])
          }
        }
      }

    })
  }
}
