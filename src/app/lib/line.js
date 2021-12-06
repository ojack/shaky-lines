// bang as event emitter?
// trigger mode : 
 // - 'free' == white to black
 // - interval probability = sample at a specific interval, 
 // trigger at that interval with velocity corresponding to value
 // AND also probability according to the velocity

module.exports = class Line {
    constructor ({ interval = 100, readPixel = () => {}, color, onBang = () => {}, mode="lumaTrigger" } = {}) {
        this.interval = interval
        this.color = color
        this._strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
        this._lastUpdate = 0
        this.points = []
        this.marker = null
        this.isRecording = true
        this._startTime = 0
        this.duration = 0

        // trigger mode
        this.mode = mode
        this._shouldTrigger = false
        this._checkLumaTrigger = (prev, curr) => {
            if(prev < 0.5 && curr > 0.5)  return true
            return false
        }

        this.numTransforms = 0 // number of times the path has been moved 
       // this.mode = 'wrap'

       this._bangTime = null

       this.prevValue = 0
       this.value = 0
        this._readPixel = readPixel

        this.onBang = onBang

        // add marker properties to overall object
        this.x = 0
        this.y = 0
        
    }

    set(props = {}){
        if(props.onBang) {
            this.onBang = props.onBang
        }
        if(props.interval) {
            this.interval = props.interval
        }
    }

    addPoint (_p) {
        console.log(_p.t, _p)
        const p = Object.assign({}, _p, { t: _p.t - this._startTime})
        this.points.push(p)
        this.marker = p
        this.x = this.marker.x
        this.y = this.marker.y
        this.isRecording = true
    }

    startRecording(t) {
        this._startTime = t
        this._bangTime = this._startTime
        this.numTransforms = 0
    }
    stopRecording() {
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
            if(this.mode == "lumaTrigger" && this._shouldTrigger === false) {
               
                this._shouldTrigger = this._checkLumaTrigger(this.prevValue, this.value)
              //  console.log('checking', this._shouldTrigger, this.prevValue, this.value)
            } else {
                this._shouldTrigger = true
            }
        }
    }

    _trigger(t) {
      //  console.log(t, this._bangTime, this.interval)
        if(this._bangTime !== null) {
           
            if(t - this._bangTime >= this.interval) {
                if(this._shouldTrigger) {
                    this.onBang(this)
                    this._shouldTrigger = false
                }
                this._bangTime = t
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