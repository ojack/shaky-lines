const { getStroke } = require('perfect-freehand')
const PIXI = require('pixi.js')
const Agent = require('./agent.js')

const rand = (min=0, max=1) => min + Math.random()*(max-min)

module.exports = class Drawing extends Agent{
  constructor (emit, startPoint) {
     // console.log('initing drawing', app, app.view)
    super(emit)
    //   const g = new PIXI.Graphics()
      // this.el = new PIXI.Graphics()
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
          width: 2      }
  }

  add(point) {
      this.points.push(point)
  }

  render() {
      // possible does not need to happen on every render?
      this.stroke = getStroke(this.points, this.strokeOptions).flat()
      this.g.clear()
      this.g.lineStyle(this.lineStyle)
      this.g.beginFill(0xffffff); 
      this.g.drawPolygon(this.stroke)
      this.g.endFill()

      //console.log('width', this.g.width)
      // possibly only do this on drag end?
      // this.g.pivot.set(this.g.width/2, this.g.height/2)
  }

  end () {
    // this.g.x  += this.g.width/2
    // this.g.y += this.g.height/2
    // this.g.pivot.set(this.g.width/2, this.g.height/2)
    this.updatePivot()
   // console.log('updating pivot', this.el)
  }

  
}
