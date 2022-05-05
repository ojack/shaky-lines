// bang as event emitter?
// trigger mode : 
 // - 'free' == white to black
 // - interval probability = sample at a specific interval, 
 // trigger at that interval with velocity corresponding to value
 // AND also probability according to the velocity
 const Bus = require('nanobus')

 const chroma = require('chroma-js')
 const util = require('./freesound/util.js')

 const { ftm, wrand, euclid, seq } = util

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

const formatParams = (value) => {
    if (typeof value === "function") return value
    if (Array.isArray(value)) return seq(value)
    return () => value
}

module.exports = class Line extends Bus {
    constructor ({ interval = 100, readPixel = () => {}, color, onUpdate = () => {},  trigger = () => {}, mode="" } = {}, i = 0) {
        super()
        this.setInterval( interval )
        this.index = i
        this.color = color
        this.strokeStyle = `rgb(${color[0], color[1], color[2]})`
        // this._strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
        this._lastUpdate = 0

        // this.strokes = [] // new object that will hold a stroke = { points: [..], stroke: ... }

        // old stroke and points
        // this.points = []
        // this.stroke = null

        this.currStroke = {
            points: [],
            stroke: null
        }

        this.smoothing = 0.96// how much to smooth speed values
        this.marker = null
        this.isRecording = true
        this._startTime = 0
        this._timeToNext = interval
        this._timeSinceBang = 10000000
        this.duration = 0
        this.muted = false

        // new container for 
        this.strokeParams = {
            dynamic: {}, // contains properties that will be continuously updated
            color: this.color,
            alpha: 1,
            blending: 'source-over',
            options:  {
                // size: 16,
                size: 30,
               //  thinning:0.8,
               thinning: 2,
                 // smoothing: 0.2,
                 // streamline: 0.0,
                 start: { cap: false },
                  end: { 
                      cap: false,
                      taper: 0 
                     },
                 // simulatePressure: false // uncomment to use with tablet
               }
        }

        this.markerParams = {
            color: [0, 0, 0],
            width: 20,
            height: 20,
            alpha: 1,
            blending: 'source-over',
            dynamic: {}, // updated on each trigger
            continuous: {} // updated continuously
        }

        // this.strokeOptions =  {
        //    // size: 16,
        //    size: 30,
        //   //  thinning:0.8,
        //   thinning: 2,
        //     // smoothing: 0.2,
        //     // streamline: 0.0,
        //     start: { cap: false },
        //      end: { 
        //          cap: false,
        //          taper: 0 
        //         },
        //     // simulatePressure: false // uncomment to use with tablet
        //   }

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
        } else if (i.constructor === Array) {
            // choose randomly
            this.interval = () => window.choose(i)     
        } else {
            this.interval = () => i
        } 
    }

    mute(b = true) {
        this.muted = b
    }



    set(props = {}){
        // console.log('setting', props)
        Object.keys(props).forEach((prop) => {
            if(prop === 'trigger') {
                this.trigger = props.trigger
            } else if(prop === 'color') {
                if(chroma.valid(props.color)) {
                    this.color = chroma(props.color).rgb()
                    // console.log('changed color to', this.color)
                    this._updateLine()
                }
            } else if(prop === 'strokeOptions') {
                this.strokeParams.options = Object.assign({}, this.strokeParams.options, props.strokeOptions)
                this._updateLine()
            } else if(prop === 'smoothing') {
                this.smoothing = props.smoothing
               // this.
            } else if(prop === 'interval') {
               this.setInterval(props.interval)
            } else if(prop === 'mode') {
                this.mode = props.mode
            } else if(prop === 'mute') {
                this.muted = props.mute
            } else {
                this[prop] = props[prop]
                // this._updateLine()
                this.emit('update line', this.currStroke.points)
            }
        })
       
        // console.log(this)
    }

    setStroke(params = {}) {
        Object.entries(params).forEach(([method, value]) => {
            if (method === "options") {
                this.strokeParams.options = Object.assign({}, this.strokeParams.options,value)
                this._updateLine()
            } else {
                this.strokeParams.dynamic[method] = formatParams(value)
            }
        })
    }

    setMarker(params = {}) {
        Object.entries(params).forEach(([method, value]) => {
            if (typeof value === "function") {
                this.markerParams.continuous[method] = value
                delete this.markerParams.dynamic[method]
            } else if (Array.isArray(value)) {
                this.markerParams.dynamic[method] = seq(value)
                delete this.markerParams.continuous[method]
            } else {
                this.markerParams.dynamic[method] = () => value
                delete this.markerParams.continuous[method]
            }
        })
    }

    addPoint (_p) {
      //  console.log(_p.t, _p, this, this.points)
        // let currStroke = this.strokes[this.strokes.length - 1]
       
        // const c
        let points = this.currStroke.points

        const p = Object.assign({}, _p, { t: _p.t - this._startTime, speed: 0})
        if(points.length > 0) {
            const prev = points[points.length - 1]
            const a = p.x - prev.x
            const b = p.y - prev.y
            const distance = Math.sqrt(a*a + b*b)
            const dt = p.t - prev.t
            const speed = distance/dt

            p.speed = prev.speed * this.smoothing + speed * (1 - this.smoothing)
            // console.log('speed', p.speed)
        }
        points.push(p)
        this.marker = p
        this.x = this.marker.x
        this.y = this.marker.y
        this.speed = this.marker.speed

        this.isRecording = true

        // console.log('adding points', points, this.strokes)
       if(points.length % 2 === 0) this._updateLine()
      // console.log(stroke, path, this.stroke)
    }

    _updateLine() {
        const stroke = getStroke(this.currStroke.points, this.strokeParams.options)
        const path = getSvgPathFromStroke(stroke)
       this.currStroke.stroke = new Path2D(path)
       this.emit('update line', this.currStroke.points)

       //this.stroke = this.currStroke.stroke
    }

    startRecording(t) {
        this._startTime = t
       // this._bangTime = this._startTime
        this.numTransforms = 0
    }

    stopRecording() {
       // console.log('points', this, this.points)
       this._updateLine()
        const p = this.currStroke.points
        this.isRecording = false
        this.duration =  p[p.length - 1].t
        // console.log(this._startTime, this.duration, this)
    }

    clear() {
        // console.log('clearing!')
        this.currStroke.points = []
        this.marker = null
        this._updateLine()
    }

    _move(t) {
        if(!this.isRecording && this.currStroke.points.length > 1) {
          
            // const start = p[0].t
            // const dur = end - start
            const progress = (t - this._startTime)%this.duration

            if(this.mode === 'wrap') {
                const numReps = Math.floor((t- this._startTime)/this.duration)
                if(numReps > this.numTransforms) this._transformPath()
            }
            const p = this.currStroke.points
            
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
            this.speed = this.marker.speed
        }
    }

    _read() {
        if(this.marker) {
            this.prevValue = this.value
            this.value = this._readPixel(this.marker.x, this.marker.y)
            Object.entries(this.markerParams.continuous).forEach(([prop, value]) => {
                if(prop === 'color') {
                    this.markerParams[prop] = chroma(value()).rgb()
                } else {
                    this.markerParams[prop] = value()
                }
                // console.log('value is ', this.strokeParams[prop])
            })
            if(!this.muted){
                if(this.mode == "lumaTrigger"){
                    if(this._shouldTrigger === false) {
                        this._shouldTrigger = this._checkLumaTrigger(this.prevValue, this.value)
                    }
                } else {
                    this._shouldTrigger = true
                // this._bangTime = 0
                // console.log('should trigger', this)
                }
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
                    const dynamicStrokeProps = Object.entries(this.strokeParams.dynamic)
                    dynamicStrokeProps.forEach(([prop, value]) => {
                        if(prop === 'color') {
                            this.strokeParams[prop] = chroma(value()).rgb()
                        } else {
                            this.strokeParams[prop] = value()
                        }
                        // console.log('value is ', this.strokeParams[prop])
                    })
                    Object.entries(this.markerParams.dynamic).forEach(([prop, value]) => {
                        if(prop === 'color') {
                            this.markerParams[prop] = chroma(value()).rgb()
                        } else {
                            this.markerParams[prop] = value()
                        }
                        // console.log('value is ', this.strokeParams[prop])
                    })
                    if(dynamicStrokeProps.length > 0) this.emit('update line', this.currStroke.points)
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
        const points = this.currStroke.points
        const end = points[points.length - 1]
        const start = points[0]

        const newPoints = this.currStroke.points.map((p) => Object.assign({}, p, {
            x: (end.x + (p.x-start.x))%800,
            y: (end.y + (p.y-start.y))%800
        }))

        this.currStroke.points = newPoints
        this.numTransforms ++
    }
}