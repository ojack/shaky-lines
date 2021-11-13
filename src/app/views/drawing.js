const { getStroke } = require('perfect-freehand')
const PIXI = require('pixi.js')


module.exports = class Drawing {
  constructor (startPoint) {
     // console.log('initing drawing', app, app.view)

    //   const g = new PIXI.Graphics()
      this.el = new PIXI.Graphics()
     // app.stage.addChild(g)

      this.points = []
      this.points.push(startPoint)
      this.stroke = [] // outline of current points
      this.strokeOptions =  {
        size: 16,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5
      }

      this.fillStyle = 0x00ff00
      this.lineStyle = {
          color: 0xff0000,
          width: 2
      }
  }

  add(point) {
      this.points.push(point)
  }

  render() {
      // possible does not need to happen on every render?
      this.stroke = getStroke(this.points, this.strokeOptions).flat()
      this.el.clear()
      this.el.lineStyle(this.lineStyle)
      this.el.beginFill(0xffffff); 
      this.el.drawPolygon(this.stroke)
      this.el.endFill()
  }

  
}
