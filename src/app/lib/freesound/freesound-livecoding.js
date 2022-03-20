const Tone = require('tone')
const util = require('./util.js')
const { query } = require('./query.js')
const audio_preview_key = 'preview-hq-mp3'

module.exports.init = (el) => {
// add functions to global scope
Object.keys(util).forEach((utilFunc) => {
    window[utilFunc] = util[utilFunc]
    window[`_${utilFunc}`] = util[utilFunc]
})
const { ftm, wrand, euclid, seq } = util
// const freesound = require('./freesound.js')

// starting to adapt code to be live codeable
// 1. Function to call from console with search term, that calls api and requests sounds
// 2. play sound in the browser
// 3. play with tonej
// 4. switch to tonejs player
// 5. define syntax

const delay =  new Tone.PingPongDelay("4n", 0.2)

const reverb = new Tone.Reverb()
reverb.wet.value = 0

delay.chain(reverb, Tone.Destination)

const master = delay

window.delay = delay
window.reverb = reverb

window.cycle = 1000

console.log('seq', seq, util)

const formatParams = (value) => {
    if (typeof value === "function") return value
    if(Array.isArray(value)) return seq(value)
    return () => value
}

class Player {
    constructor({ numSamples = 10} = {}) {
        this.samples = []
        this._index = () => 0
        this._interval = () => 1000
        this._speed = () => 1
        const self = this
        this._loop = () => {
          //  console.log('calling loop')
            setTimeout(() => {
                self._play()
            }, self._interval())
        }
        this.audioParams = {}
        this._loop()
        this.gain = new Tone.Gain(0.2).connect(delay)
        //new Array(numSamples).fill(0).map(() => new Tone.)
    }

    _play() {
       // console.log('playing')
        const index = this._index()
        const p = this.samples[index]
        if(p && p.loaded) {
            Object.entries(this.audioParams).forEach(([prop, value]) => {
                p[prop] = value()
            })
            p.start()
        }
        this._loop()
    }

    query(str = "bell"){
        query(str, (sounds) => {
            console.log('got sounds', sounds)
            sounds.results.forEach((sound, i) => {
                this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).connect(this.gain)
                //                this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).toDestination()
               // el.innerHTML += sound.name
                el.innerHTML += sound.description
                el.innerHTML += `<br><br>`
                el.scrollTop = el.scrollHeight;
                //this.samples[i].autostart = true
               // this.samples[i].start()
            })
        })
    }

    set(params = {}) {
        Object.entries(params).forEach(([method, value]) => {
            //this[method](value)
            console.log('setting', method, value)
            if(method === "query") {
                this.query(value)
            } else if (method === "interval" || method === "index") {
                this[`_${method}`] = formatParams(value)
            } else {
                this.audioParams[method] = formatParams(value)
            }
        })
    }
}

['f0', 'f1', 'f2', 'f3'].forEach((_f) => {
    window[_f] = new Player()
})
}




// seq = (arr = [], start = 0) => {
//     let i = start
//     /*arr.forEach((val, i) => {
//       if(typeof val == 'function') {
//         arr[i] = val()
//       }
//     })
//     console.log('arr', arr)*/
//     return (v) => {
//       const curr = i
//       i++
//       if(i >= arr.length) i = 0
//       let r = arr[i]
//       if(typeof r == 'function') {
//         r = r()
//       } else {
//         console.log(r, arr, i)
//         return r
//       }
//     }
//   }
//   //
//   p0.set({
//     interval: 1000,
//     trigger: seq([1, 
//                seq([2, 3, seq([8, 9, 10])]), 5])
//       //
//   })