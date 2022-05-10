
// const { getStroke } = require('perfect-freehand')

// function getSvgPathFromStroke(stroke) {
//    if (!stroke.length) return ''

//    const d = stroke.reduce(
//      (acc, [x0, y0], i, arr) => {
//        const [x1, y1] = arr[(i + 1) % arr.length]
//        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
//        return acc
//      },
//      ['M', ...stroke[0], 'Q']
//    )

//    d.push('Z')
//    return d.join(' ')
//  }
// const colorString = (color) => `rgb(${color.r}, ${color.g}, ${color.b})`
const colorString = (color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`

module.exports.CanvasRenderer = class CanvasRenderer {
    constructor({ width, height }) {
        //this.canvas = canvas
        const lineCanvas = document.createElement('canvas')
        lineCanvas.width = width
        lineCanvas.height = height
        lineCanvas.style.position = 'absolute'
        this.lineCanvas = lineCanvas
        this.lineCtx = lineCanvas.getContext('2d')
        this.lineCtx.strokeStyle = "#ed382b"
        this.lineCtx.fillStyle = "#ed382b"
        this.lineCtx.lineWidth = 3

        this.width = width
        this.height = height

        const pointCanvas = document.createElement('canvas')
        pointCanvas.width = width
        pointCanvas.height = height
        pointCanvas.style.position = 'absolute'
        this.pointCanvas = pointCanvas
        //  this.pointCanvas.style.mixBlendMode = 'lighten'
        this.pointCtx = pointCanvas.getContext('2d')
        this.pointCtx.strokeStyle = "#ed382b"
        this.pointCtx.fillStyle = "#ed382b"
        this.pointCtx.lineWidth = 2

        this.points = []

        window.strokeCanvas = lineCanvas
        window.markerCanvas = pointCanvas

        this.el = document.createElement('div')
        this.el.appendChild(lineCanvas)
        this.el.appendChild(pointCanvas)
        this.el.style.position = "absolute"
        this.el.style.width = `${width}px`
        this.el.style.height = `${height}px`
    }

    addPoint(_point) {
        const { x, y, color, _timeToNext } = _point
        const point = Object.assign({}, { x, y, color, time: _timeToNext * 2, length: _timeToNext })
        this.points.push(point)
        //console.log('points', this.points)
    }

    drawLine(line) {
        this.lineCtx.save()
        // this.lineCtx.strokeStyle = colorString(line.strokeParams.color)
        // this.lineCtx.fillStyle = `rgb(${l}, ${l}, ${l})`
        // this.lineCtx.fillStyle = line._shouldTrigger ? "#fff" :  line._strokeStyle
        // this.lineCtx.fillStyle = colorString(line.color)

        this.lineCtx.fillStyle = colorString(line.strokeParams.color)
        // console.log('drawing line', line.strokeParams.color)

        this.lineCtx.globalCompositeOperation = line.strokeParams.blending
        this.lineCtx.globalAlpha = line.strokeParams.alpha

        // const props = ['fillStyle', 'lineWidth', 'strokeStyle', 'globalCompositeOperation', 'globalAlpha']
        // props.forEach(
        //     (prop) => {

        //         if (prop in line) {
        //             this.lineCtx[prop] = line[prop]
        //             // console.log(prop, prop in line, line, this.lineCtx)
        //         }
        //     })
        //    if('fillStyle' in line) this.lineCtx.fillStyle = line.fillStyle
        //    if('lineWidth' in line) this.lineCtx.lineWidth = line.lineWidth
        // line.lines.forEach((line) => {
        line.strokes.forEach((stroke) => {
            if (stroke.points.length > 1) {
                //  const points = line.points
                //  this.lineCtx.beginPath()
                //  this.lineCtx.moveTo(points[0].x, points[0].y)
                //  points.forEach((point) => {
                //      this.lineCtx.lineTo(point.x, point.y)
                //  })
                //  this.lineCtx.stroke()
                // console.log('stroke is', line.stroke)
                this.lineCtx.fill(stroke.stroke)
              
    
            }
        })
        
        this.lineCtx.fillStyle = "rgba(0, 255, 0, 0.4)"
        this.lineCtx.restore()
    }

    drawMarker(line) {

        // this.pointCtx.fillRect(100, 100, 100, 100)
        this.pointCtx.save()
        const { width, height, lineWidth, alpha, blending, lineColor, color } = line.markerParams

        // console.log('drawing marker', line.markerParams, line.marker)
        const ctx = this.pointCtx
        // this.pointCtx.fillStyle = "#000"
        ctx.fillStyle = colorString(color)
        // line.pointCtx.fillStyle =   `rgba(${l}, ${l}, ${l}, 0)`
        const m = line.marker

        // const w = line._didTrigger ? 90 : 10               //const w = r
        // const w = 20 + line.speed * 4
        const w = width
        const h = height

        ctx.globalCompositeOperation = blending
        ctx.globalAlpha = alpha
        // console.log('drawing', line)
        ctx.fillRect(m.x - w / 2, m.y - h / 2, w, h)
        if (lineWidth > 0) {
            // console.log('line',  colorString(lineColor), lineColor)
            ctx.strokeStyle = colorString(lineColor)
            ctx.lineWidth = lineWidth
            ctx.strokeRect(m.x - w / 2, m.y - h / 2, w, h)
        }

       
        // this.ctx.stroke()
        //  }
        // })
        this.pointCtx.restore()
    }

    update(dt) {
        // this.points.forEach((point) => {
        //     const w = 20 + point.length / 15
        //     this.pointCtx.strokeStyle = colorString(point.color)
        //     //  console.log(point.x)
        //     //   this.pointCtx.strokeRect(point.x - w/2, point.y - w/2, w, w)
        //     //    this.pointCtx.beginPath();
        //     //    this.pointCtx.arc(point.x, point.y, w/2, 0, 2 * Math.PI);
        //     //    this.pointCtx.stroke();
        //     point.time -= dt
        // })
        // this.points = this.points.filter((point) => point.time >= 0)
    }

    clearLines() {
        this.lineCtx.clearRect(0, 0, this.lineCanvas.width, this.lineCanvas.height)

    }

    clear() {
        this.pointCtx.fillStyle = `rgba(0, 0, 0, 0.05)`

        // this.pointCtx.fillRect(0, 0, this.pointCanvas.width, this.pointCanvas.height)
        this.pointCtx.clearRect(0, 0, this.pointCanvas.width, this.pointCanvas.height)

    }
}

module.exports.BaseCanvas = class BaseCanvas {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d')
        this.ctx.strokeStyle = "#fff"
        this.ctx.lineWidth = 16
        this.prevPoint = null
    }

    startRecording() {
        // this.prevPoint = point
    }

    addPoint(point) {
        if (this.prevPoint !== null) {
            // console.log('prev', point, this.prevPoint)
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