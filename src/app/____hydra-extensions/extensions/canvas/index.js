

var Canvas = function ({ gl }) {
  var canvas = document.createElement('canvas')
  canvas.width = gl.drawingBufferWidth
  canvas.height = gl.drawingBufferHeight
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.background = 'rgba(0, 0, 0, 0)'
  // canvas.style.zIndex = 100
  canvas.style.position = 'absolute'
  canvas.style.top = '0px'
  canvas.style.left = '0px'

  var ctx = canvas.getContext('2d')

  ctx.fillStyle = "rgb(255, 255, 255)"

  this.canvas = canvas
  this.ctx = ctx
  this.update = ({ ctx }) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
  this.show()
}

Canvas.prototype.show = function () {
  this.canvas.style.zIndex = 10
}

Canvas.prototype.hide = function () {
  this.canvas.style.zIndex = -10
}

Canvas.prototype.toggle = function () {
  if(this.canvas.style.zIndex == 10) {
    this.canvas.style.zIndex = -10
  } else {
    this.canvas.style.zIndex = 10
  }
}

Canvas.prototype.updateHydra = function ( dt ) {
  this.update({ ctx: this.ctx, dt: dt })
}

module.exports = Canvas
