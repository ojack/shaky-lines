const Line = require('./line.js')
const raf = require('raf-loop')

const NUM_LINES = 10

module.exports = class DrawSynth {
    constructor (state, emit, { canvas, input} = {} ) {
        console.log(input, 'input')
        const gl = input.regl._gl
        this.state = state
        this.emit = emit
       

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

        this.lines = new Array(NUM_LINES).fill(0).map(() => new Line({
            readPixel: readPixel
        }))

        let currIndex = 0

        let currLine = this.lines[currIndex]

        console.log('state', state)
        canvas.style.border = "1px solid white"

        canvas.addEventListener('pointerdown', (e) => {
            e.target.setPointerCapture(e.pointerId)
            currLine.clear()
            currLine.startRecording(performance.now())
            currLine.addPoint({
                x: e.pageX, y: e.pageY, p: e.pressure, t: performance.now()
            })
            console.log('pointer down',e )
         })

        canvas.addEventListener('pointermove', (e) => {
            // console.log('pointer event', e)
            if (e.buttons !== 1) return
            currLine.addPoint({
                x: e.pageX, y: e.pageY, p: e.pressure, t: performance.now()
            })
            // console.log(e.pressure)
          //  this.currDrawing.add([e.clientX, e.clientY, e.pressure])
           // this.currDrawing.render()
        })
      
        canvas.addEventListener('pointerup', (e) => {
            currLine.stopRecording()
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
}

class CanvasRenderer {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.ctx.strokeStyle = "#ed382b"
        this.ctx.fillStyle = "#ed382b"
        this.ctx.lineWidth =4
    }

    draw(line) {
        const l = (1 - line.value) * 255
        this.ctx.fillStyle = `rgb(${l}, ${l}, ${l})`
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
            const w = 20
            this.ctx.fillRect(m.x - w/2, m.y - w/2, w, w)
            this.ctx.strokeRect(m.x - w/2, m.y - w/2, w, w)
           // this.ctx.stroke()
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
