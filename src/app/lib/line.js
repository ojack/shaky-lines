// bang as event emitter?
// trigger mode : 
 // - 'free' == white to black
 // - interval probability = sample at a specific interval, 
 // trigger at that interval with velocity corresponding to value
 // AND also probability according to the velocity
 const Bus = require('nanobus')

 const { getStroke } = require('perfect-freehand')

 function getSvgPathFromStroke(stroke) {
    if (!stroke.length) return ''
  
    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length]
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
        return acc
      },
      ['M', ...stroke[0], 'Q']
    )
  
    d.push('Z')
    return d.join(' ')
  }

module.exports = class Line extends Bus {
    constructor ({ interval = 100, readPixel = () => {}, color, onUpdate = () => {},  trigger = () => {}, mode="" } = {}, i = 0) {
        super()
        this.setInterval( interval )
        this.index = i
        this.color = color
        // this._strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
        this._lastUpdate = 0
        this.points = []
        this.marker = null
        this.isRecording = true
        this._startTime = 0
        this._timeToNext = interval
        this._timeSinceBang = 10000000
        this.duration = 0
        this.stroke = null

        this.strokeOptions =  {
            size: 12,
            thinning: 1.5,
            // smoothing: 0.2,
            // streamline: 0.0,
            start: { cap: false },
             end: { 
                 cap: false,
                 taper: 0 
                },
            // simulatePressure: false // uncomment to use with tablet
          }

        // trigger mode
        this.mode = mode
        this._shouldTrigger = false
        this._didTrigger = false // used for rendering

        this._checkLumaTrigger = (prev, curr) => {
            if(prev < 0.5 && curr > 0.5)  return true
            return false
        }

        this.numTransforms = 0 // number of times the path has been moved 
       // this.mode = 'wrap'

       this._bangTime = 0

       this.prevValue = 0
       this.value = 0
        this._readPixel = readPixel

        this.trigger = trigger

        // add marker properties to overall object
        this.x = 0
        this.y = 0
        
    }

    setInterval(i) {
        if (typeof i === 'function') {
            this.interval = i
        } else {
            this.interval = () => i
        }
    }

    set(props = {}){
        console.log('setting', props)
        if('trigger' in props) {
            this.trigger = props.trigger
        }
        if('interval' in props) {
           this.setInterval(props.interval)
        }
        if('mode' in props) {
            this.mode = props.mode
        }
        console.log(this)
    }

    addPoint (_p) {
      //  console.log(_p.t, _p, this, this.points)
        const p = Object.assign({}, _p, { t: _p.t - this._startTime})
        this.points.push(p)
        this.marker = p
        this.x = this.marker.x
        this.y = this.marker.y
        this.isRecording = true
        const stroke = getStroke(this.points, this.strokeOptions)
        const path = getSvgPathFromStroke(stroke)
       this.stroke = new Path2D(path)
       this.emit('update line', this.points)
      // console.log(stroke, path, this.stroke)
    }

    startRecording(t) {
        this._startTime = t
       // this._bangTime = this._startTime
        this.numTransforms = 0
    }
    stopRecording() {
       // console.log('points', this, this.points)
        const p = this.points
        this.isRecording = false
        this.duration =  p[p.length - 1].t
        console.log(this._startTime, this.duration, this)
    }

    clear() {
        this.points = []
        this.marker = null
    }

    _move(t) {
        if(!this.isRecording && this.points.length > 1) {
          
            // const start = p[0].t
            // const dur = end - start
            const progress = (t - this._startTime)%this.duration

            if(this.mode === 'wrap') {
                const numReps = Math.floor((t- this._startTime)/this.duration)
                if(numReps > this.numTransforms) this._transformPath()
            }
            const p = this.points
            
            let index = 0
            let time = p[index].t
            while(progress > time && index < p.length - 1){
                index++
                time = p[index].t
            }
            const point = p[index]
            this.marker = point
            this.x = this.marker.x
            this.y = this.marker.y
        }
    }

    _read() {
        if(this.marker) {
            this.prevValue = this.value
            this.value = this._readPixel(this.marker.x, this.marker.y)
            if(this.mode == "lumaTrigger"){
                if(this._shouldTrigger === false) {
                    this._shouldTrigger = this._checkLumaTrigger(this.prevValue, this.value)
                }
            } else {
                this._shouldTrigger = true
               // this._bangTime = 0
               // console.log('should trigger', this)
            }
            // this._shouldTrigger = true
        }
    }

    _trigger(t) {
      //  console.log(t, this._bangTime, this.interval)
      this._didTrigger = false
      if(this.marker) {
        if(this._bangTime !== null) {
           
            if(t - this._bangTime >= this._timeToNext) {
               if(this._shouldTrigger) {
                    this.trigger(this)
                    this._didTrigger = true
                    this._shouldTrigger = false
                    this._timeToNext = this.interval(this)
                    this.emit('trigger', this)
                }
                this._bangTime = t
            }
        }
        }
    }


    update (t) {
       this._move(t)
       this._read()
       this._trigger(t)
    }

    // for continuous animation, update point when reaches end
    _transformPath() {
        const points = this.points
        const end = points[points.length - 1]
        const start = points[0]

        const newPoints = this.points.map((p) => Object.assign({}, p, {
            x: (end.x + (p.x-start.x))%800,
            y: (end.y + (p.y-start.y))%800
        }))

        this.points = newPoints
        this.numTransforms ++
    }
}