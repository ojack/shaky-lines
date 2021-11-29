module.exports = class Line {
    constructor ({ interval = 100 } = {}) {
        this.interval = interval

        this._lastUpdate = 0
        this.points = []
        this.marker = null
        this.isRecording = true
        this.startTime = 0
        this.duration = 0
    }

    addPoint (_p) {
        console.log(_p.t, _p)
        const p = Object.assign({}, _p, { t: _p.t - this.startTime})
        this.points.push(p)
        this.marker = p
        this.isRecording = true
    }

    startRecording(t) {
        this.startTime = t
    }
    stopRecording() {
        const p = this.points
        this.isRecording = false
        this.duration =  p[p.length - 1].t
        console.log(this.startTime, this.duration, this)
    }

    clear() {
        this.points = []
        this.marker = null
    }

    update (t) {
        // update time to value based on t passed in
        if(!this.isRecording && this.points.length > 1) {
            const p = this.points
            // const start = p[0].t
            // const end = p[p.length - 1].t
            // const dur = end - start
            const progress = (t - this.startTime)%this.duration
            let index = 0
            let time = p[index].t
            while(progress > time && index < p.length - 1){
                index++
                time = p[index].t
            }
            this.marker = p[index]
           // console.log(progress, this.duration)
        }
    }
}