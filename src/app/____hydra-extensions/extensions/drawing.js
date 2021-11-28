var tidalPattern = ''
var p = Pattern('3 4 <5 4> 10')
var cyclePosition = 0
var cps = 1
var isDrawing = false
var drawingPattern = []

var xPattern = []
var yPattern = []

var mousePosition = {}
var samplesPerCycle = 16
var timeSinceLastSample = 0
var sampleInterval = 1000/(cps*samplesPerCycle)
console.log(sampleInterval)

module.exports = {
  init: () => {
    // configure osc
    msg.setPort(5050)// local report
    msg.IP = 'stanage.local'
    msg.outgoingPort = 5051

    ctx = window.canvas.ctx
    ctx.lineWidth = 3
    ctx.strokeStyle = '#fff'

    window.canvas.update = () => {}

    // interval at which to get new drawing data points
    //sampleInterval = (cps/samplesPerCycle)/1000

    // get cycle position from tidal
    msg.on('/pattern', (args) => {
      console.log(args)
      tidalPattern = args[0].value
      console.log(tidalPattern)
      try {
    	p = Pattern(tidalPattern)
      } catch (e) {
        console.log(e)
      }
      cps = args[1].value
      cyclePosition = args[2].value
      sampleInterval = 1000/(cps*samplesPerCycle)
    })

    // capture window drawing events
    window.onmousedown = (e) => {
      canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      canvas.ctx.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height)
      mousePosition = e
      isDrawing = true
      drawingPattern = []
    }

    window.onmousemove = (e) => {
      if(isDrawing) {
        ctx.beginPath()
        ctx.moveTo(mousePosition.clientX, mousePosition.clientY)
        ctx.lineTo(e.clientX, e.clientY)
        ctx.stroke()
        mousePosition = e
      }
    }

    window.onmouseup = (e) => {
      mousePosition = e
      isDrawing = false
      ctx.lineTo(e.clientX, e.clientY)
      ctx.stroke()
      console.log(drawingPattern)
      var args =  drawingPattern.map((val) => ({ type: 'float', value: val}))
      msg.send({ address: '/drawing', args: args})
    }
  },

  updateHydra: (dt) => {
    cyclePosition += (dt/1000)*cps
  //  console.log(cyclePosition, sampleInterval, timeSinceLastSample)
    if(isDrawing) {
      timeSinceLastSample += dt
      if(timeSinceLastSample >= sampleInterval) {
        sampleDrawing()
      }
    }
//     ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(300, 150);
// ctx.stroke();
    //console.log(cyclePosition)
  }
}

function sampleDrawing() {
  console.log(cyclePosition, sampleInterval, timeSinceLastSample)
  drawingPattern.push(mousePosition.clientX/window.innerWidth)
  drawingPattern.push(mousePosition.clientY/window.innerHeight)
  drawingPattern.push(cyclePosition)
  ctx.beginPath();
ctx.arc(mousePosition.clientX, mousePosition.clientY, 10, 0, 2 * Math.PI);
ctx.stroke();
  // drawingPattern.push({
  //   x: mousePosition.clientX,
  //   y: mousePosition.clientY,
  //   cyclePosition: cyclePosition
  // })
  timeSinceLastSample = 0
}
