const Line = require('./line.js')
const raf = require('raf-loop')

const NUM_LINES = 10

module.exports = class DrawSynth {
    constructor (state, emit, canvas) {
        this.state = state
        this.emit = emit
        this.lines = new Array(NUM_LINES).fill(0).map(() => new Line())

        let currIndex = 0

        let currLine = this.lines[currIndex]

        let renderer = new CanvasRenderer(canvas)

        console.log('adding props to canvas', canvas)
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
        this.ctx.strokeStyle = "#fff"
        this.ctx.fillStyle = "#fff"
    }

    draw(line) {
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
            this.ctx.stroke()
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}
