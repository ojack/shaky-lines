const Line = require('./line.js')
const raf = require('raf-loop')
const Synth = require('./tone.js')
const colors = require('./colors.js')
const { Scale, Midi } = require('@tonaljs/tonal')
const MidiOut = require('./midi.js')

const NUM_LINES = colors.length

const SCALES = Scale.names()

const NOTES = Scale.get("A minor pentatonic").notes.map((note) => Midi.toMidi(`${note}3`))

console.log('scale', Scale, Scale.names(), NOTES)

module.exports = class DrawSynth {
    constructor (state, emit, { container, width, height, input} = {} ) {
        window.drawSynth = this
       
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

        container.appendChild(baseCanvas)
        container.appendChild(canvas)

       s0.init({ src: baseCanvas })
       src(s0).out()

        console.log(input, 'input')
        const gl = input.regl._gl
        this.state = state
        this.emit = emit
        this.midi = new MidiOut()
        this.synth = new Synth()


        let renderer = new CanvasRenderer(canvas)

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
        const division = 16
        const interval  = 60*1000/bpm
        console.log('interval', interval)
        this.lines = new Array(NUM_LINES).fill(0).map((_, i) => new Line({
            readPixel: readPixel,
            color: { r: colors[i][0], g: colors[i][1], b: colors[i][2]},
            onBang: (v) => { 
                const { value } = v
              //  console.log('banging', v)
               // if(Math.random() < value)
              //   this.synth.trigger(1) 
              //this.midi.send(80 - i * 5)
               this.midi.send(NOTES[i])

            },
            //interval: interval/division // ms between checking for  each bang
            interval: 500
        }))

        this.lines.forEach((line, i) => {
            window[`p${i}`] = line})
        this.currIndex = 0

        //let this.currLine = this.lines[currIndex]
        this.currLine = this.baseCanvas

        console.log('state', state)
        canvas.style.border = "1px solid white"

        canvas.addEventListener('pointerdown', (e) => {
            this.synth.start()
            e.target.setPointerCapture(e.pointerId)
            this.currLine.clear()
            this.currLine.startRecording(performance.now())
            this.currLine.addPoint({
                x: e.pageX, y: e.pageY, p: e.pressure, t: performance.now()
            })
            console.log('pointer down',e )
         })

        canvas.tabIndex = 0

        canvas.addEventListener('keydown', (e) => {
          console.log(e.key)
           if(isFinite(e.key)) {
                if(e.key === "0") {
                    this.currLine = this.baseCanvas
                    this.currIndex = e.key
        
                } else {
                     this.selectLine(e.key-1)
                }
           }
        })

        canvas.addEventListener('pointermove', (e) => {
            // console.log('pointer event', e)
            if (e.buttons !== 1) return
            this.currLine.addPoint({
                x: e.pageX, y: e.pageY, p: e.pressure, t: performance.now()
            })
            // console.log(e.pressure)
          //  this.currDrawing.add([e.clientX, e.clientY, e.pressure])
           // this.currDrawing.render()
        })
      
        canvas.addEventListener('pointerup', (e) => {
            this.currLine.addPoint({
                x: e.pageX, y: e.pageY, p: e.pressure, t: performance.now()
            })
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
                renderer.draw(line)
            })
        }).start()
    }

    selectLine(index) {
       // else if(isFinite(e.key)) {
            //console.log('number', e.key)
            this.currIndex = index
            this.currLine = this.lines[this.currIndex]
       // }
    }

    set({ interval }) {
        if(interval) {
            this.lines.forEach((line) => line.set({ interval: interval}))
        }
    }
}

class BaseCanvas {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d')
        this.ctx.strokeStyle = "#fff"
        this.ctx.lineWidth = 8
        this.prevPoint = null
    }

    startRecording(){
       // this.prevPoint = point
    }

    addPoint(point) {
        if(this.prevPoint !== null) {
            console.log('prev', point, this.prevPoint)
            this.ctx.beginPath()
            this.ctx.moveTo(this.prevPoint.x, this.prevPoint.y)
            this.ctx.lineTo(point.x, point.y)
            this.ctx.stroke()
        }
        this.prevPoint = point
    }

    stopRecording() {
        this.prevPoint = null
    }

    clear() {

    }
}

class CanvasRenderer {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.ctx.strokeStyle = "#ed382b"
        this.ctx.fillStyle = "#ed382b"
        this.ctx.lineWidth = 1
    }

    draw(line) {
        const l = (1 - line.value) * 255
        this.ctx.strokeStyle = line._strokeStyle
        // this.ctx.fillStyle = `rgb(${l}, ${l}, ${l})`
       // this.ctx.fillStyle = line._shouldTrigger ? "#fff" :  line._strokeStyle
       this.ctx.fillStyle =  line._strokeStyle
       if(line.points.length > 1) {
            const points = line.points
            this.ctx.beginPath()
            this.ctx.moveTo(points[0].x, points[0].y)
            points.forEach((point) => {
                this.ctx.lineTo(point.x, point.y)
            })
            this.ctx.stroke()
        }
        if(line.marker !== null) {
            const m = line.marker
            const w = line._shouldTrigger ? 100 : 20
            this.ctx.fillRect(m.x - w/2, m.y - w/2, w, w)
            this.ctx.strokeRect(m.x - w/2, m.y - w/2, w, w)
           // this.ctx.stroke()
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
