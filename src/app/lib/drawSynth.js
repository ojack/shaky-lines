const Line = require('./line.js')
// const Line = require('./multi-line.js')
const raf = require('raf-loop')
const Synth = require('./tone.js')
const colors = require('./colors.js')
const MidiOut = require('./midi.js')
const scale = require('./midi-scales.js')
const { CanvasRenderer, BaseCanvas } = require('./canvas-renderer.js')

const NUM_LINES = colors.length

//window.scale = Scale
const notes = scale("A3", "pentatonic", 3)

window.notes = notes
window.quantize = (val = 0, arr = []) => arr[Math.floor(val*arr.length)]
window.choose = (arr) => arr[Math.floor(Math.random()*arr.length)]
console.log('NOTES', notes)

//console.log('scale', Scale, Scale.names(), notes)

module.exports = class DrawSynth {
    constructor (state, emit, { container, width, height, input} = {} ) {
       state.drawSynth = this
        // canvas for rendering agents
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.style.position = 'absolute'

        const baseCanvas = document.createElement('canvas')
        baseCanvas.width = width 
        baseCanvas.height = height
        baseCanvas.style.position = 'absolute'

        baseCanvas.style.opacity = 0.1

        this.baseCanvas = new BaseCanvas(baseCanvas)
        let renderer = new CanvasRenderer({ width, height})
        this.renderer = renderer
        container.appendChild(baseCanvas)
        container.appendChild(renderer.el)


        console.log(input, 'input')
        const gl = input.regl._gl
        this.state = state
        this.emit = emit
        this.midi = new MidiOut()

        this.synth = new Synth()


        window.drawSynth = this
        window.notes = notes
        window.midi = this.midi

       s0.init({ src: baseCanvas })
       src(s0).out()


        // read value at point from "input" canvas
        const pixels = new Uint8Array(4*1)
        const readPixel = (x, y) => {
            gl.readPixels(x, canvas.height - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
            const red = pixels[0]/255
            const green = pixels[1]/255
            const blue = pixels[2]/255
  
            const val = (red + green + blue)/3
            return val
        }

        const bpm = 100
        const division = 2
        const interval  = 60*1000/bpm
        console.log('interval', interval)
        this.lines = new Array(NUM_LINES).fill(0).map((_, i) => new Line({
            readPixel: readPixel,
            color: { r: colors[i][0], g: colors[i][1], b: colors[i][2]},
            trigger: (v) => { 
                const { value, y, x } = v
              //  console.log('banging', v)
               // if(Math.random() < value)
              //   this.synth.trigger(1) 
              //this.midi.send(80 - i * 5)
               this.midi.note( quantize(1 - y/height, notes), 100, 100, i)

            },
            mode: "",
            //interval: interval/division // ms between checking for  each bang
            interval: interval/division
        }))
        
        this.lines.forEach((line) => {
            line.on('update line', (points) => {
                console.log('line updated')
                renderer.clearLines()
                this.lines.forEach((line) => {
                    //line.update(performance.now())
                    renderer.drawLine(line)
                })
            })

            line.on('trigger', () => {
                console.log('triggering')
                renderer.addPoint(line)
            })
        })

        this.lines.forEach((line, i) => {
            window[`p${i}`] = line})
        this.currIndex = 0

        console.log('created lines', this.lines)

        //let this.currLine = this.lines[currIndex]
        this.currLine = this.baseCanvas

        console.log('state', state)
       renderer.el.style.border = "1px solid white"
       renderer.el.style.touchAction = 'none'
       renderer.el.addEventListener('pointerdown', (e) => {
            this.synth.start()
            e.target.setPointerCapture(e.pointerId)
           // console.log('curr line', this.currLine)
            this.currLine.clear()
            this.currLine.startRecording(performance.now())
            this.currLine.addPoint({
                x: e.pageX, y: e.pageY, p: e.pressure, t: performance.now()
            })
            console.log('pointer down',e )
         })

       renderer.el.tabIndex = 0

       renderer.el.addEventListener('keydown', (e) => {
       //   console.log(e.key)
           if(isFinite(e.key)) {
                // if(e.key === "0") {
                //     this.currLine = this.baseCanvas
                //     this.currIndex = e.key
        
                // } else {
                    // this.selectLine(e.key)
                     this.emit('draw:select', e.key)
               // }
           }
        })

       renderer.el.addEventListener('pointermove', (e) => {
            // console.log('pointer move', e)
            if (e.buttons !== 1) return
            this.currLine.addPoint({
                x: e.pageX, y: e.pageY, p: e.pressure, t: performance.now()
            })
            // console.log(this.currLine)
          //  this.currDrawing.add([e.clientX, e.clientY, e.pressure])
           // this.currDrawing.render()
        })
      
       renderer.el.addEventListener('pointerup', (e) => {
            this.currLine.addPoint({
                x: e.pageX, y: e.pageY, p: e.pressure, t: performance.now()
            })
            console.log('stop', this.currLine)

            this.currLine.stopRecording()
            //console.log('on pointer up', e)
          //  if (!this.drawingMode) return
          //  this.currDrawing.end()
          //  this.emit('select', this.currDrawing)
        })
    
        const loop = raf((dt) => {
            renderer.clear()
            this.lines.forEach((line) => {
                line.update(performance.now())
                if(line.marker !== null) renderer.drawMarker(line)
            })
            renderer.update(dt)
        }).start()

         this.emit('draw:select',1)
    }

    selectLine(index) {
       // else if(isFinite(e.key)) {
            //console.log('number', e.key)
            const i = parseFloat(index)
            this.currIndex = i
            if(index == 0) {
                this.currLine = this.baseCanvas
             //   console.log('set current line to', this.baseCanvas, this.currLine)
               // this.currIndex = index
            } else {
          //  this.currIndex = index
            this.currLine = this.lines[i - 1]
            }
       // }
    }

    set({ interval }) {
        if(interval) {
            this.lines.forEach((line) => line.set({ interval: interval}))
        }
    }
}




