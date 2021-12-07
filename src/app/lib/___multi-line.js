const Line = require('./line.js')

module.exports = class MultiLine {
    constructor(props, num = 3) {
        this.lines = new Array(num).fill(0).map((_, i) => new Line(props, i))

        const { color } = props
        this.color = color
        this._strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`

        // apply function to all individual lines
        const funcs =  ['set', 'startRecording', 'stopRecording', 'clear', 'update']
       funcs.forEach((f) => {
            this[f] = (...props) => {
                this.lines.forEach((line, i) => { 
                   // console.log(line, i)
                    line[f](...props) 
                })
            }
        })
    }

    // set(props) {
    //     this.lines.forEach((line) => line.set(props))
    // }

    addPoint(_p) {
        this.lines.forEach((line, i) => {
            const p = Object.assign({}, _p, { y: _p.y + i*80})
            line.addPoint(p)
        })
    }


}