const Tone = require('tone')
const util = require('./util.js')
const { query, loadSimilar } = require('./query.js')
const audio_preview_key = 'preview-hq-mp3'

module.exports.init = (el) => {
    // add functions to global scope
    console.log('INITIALIZING')
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

    const delay = new Tone.PingPongDelay("4n", 0.2)

    const reverb = new Tone.Reverb()
    reverb.wet.value = 0
    delay.wet.value = 0

    delay.chain(reverb, Tone.Destination)

    const master = delay

    window.delay = delay
    window.reverb = reverb

    window.cycle = 1000

    // console.log('seq', seq, util)

    const formatParams = (value) => {
        if (typeof value === "function") return value
        if (Array.isArray(value)) return seq(value)
        return () => value
    }


    class ToneInstrument {
        constructor({ numSamples = 10 } = {}) {
            this.samples = []
            this.sounds = []
            this._index = () => 0
            this._interval = () => 800
            this._currInterval = this._interval()
            this._speed = () => 1
            this._gain = () => 1
            this._mutate = () => 0  // mutation probability over / 100
            
            const self = this
            this._loop = () => {
                //  console.log('calling loop')
                this._currInterval = this._interval()
                setTimeout(() => {
                    self._play()
                }, self._currInterval)
            }
            this.audioParams = {}
            // this.instrumentParams = {
            //     gain: 1,
            //     mutation: 0,
            //     duration: null
            // }
            this._loop()
            // this.mode = 
            this.gain = new Tone.Gain(0.7).connect(delay)
            this.active = true
            //new Array(numSamples).fill(0).map(() => new Tone.)
        }

        _play() {
           this._trigger()
            this._loop()
        }

        _trigger() {
            // p.start()
        }

        query(str = "bell", duration = [0.05, 0.5], pageSize = 5) {
            query({ query: str, minDuration: duration[0], maxDuration: duration[1], pageSize: pageSize }, (sounds) => {
                console.log('got sounds', sounds)
                //,sounds.results[0].id )
                el.innerHTML += `loaded ${str} sounds`
                const testSound = sounds.getSound(0)
                // console.log('got test sound', testSound)
                window.test = testSound
                this.soundCollection = sounds

                this._initInstrument(sounds)
            })
        }

        loadSimilar(i, duration = [0.05, 0.5], pageSize = 2 ) {
            // const s = this.soundCollection.getSound(i)
            loadSimilar({ sound: this.sounds[i], minDuration: duration[0], maxDuration: duration[1], pageSize: pageSize },
                (sounds) => {
                console.log('got', sounds, sounds.results.length)
                if(sounds.results.length > 0) {
                    const randSound = Math.floor(Math.random() * sounds.results.length)
                    const sound = sounds.results[randSound]
                    this.sounds[i] = sounds.getSound(1)
                    this.samples[i].stop()
                    this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).connect(this.gain)
                //                this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).toDestination()
                // el.innerHTML += sound.name
                el.innerHTML += `[${i}] ${sound.name} - ${sound.description}`
                el.innerHTML += `<br><br>`
                el.scrollTop = el.scrollHeight;
                }
            }, (err) => {
                console.log('error getting sounds', err)
            })
        }

        _initInstrument(sounds) {
            sounds.results.forEach((sound, i) => {
                this.sounds[i] = sounds.getSound(i)
                this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).connect(this.gain)
                //                this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).toDestination()
                // el.innerHTML += sound.name
                el.innerHTML += `[${i}] ${sound.name} - ${sound.description}`
                el.innerHTML += `<br><br>`
                el.scrollTop = el.scrollHeight;
                //this.samples[i].autostart = true
                // this.samples[i].start()
            })
            // sounds.results.forEach((sound, i) => {
            //     this.sounds[i] = sound
            //     this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).connect(this.gain)
            // })
        }

       
        set(params = {}) {
            let shouldQuery = false
            Object.entries(params).forEach(([method, value]) => {
                //this[method](value)
                // console.log('setting', method, value)
                if (method === "query") {
                    shouldQuery = true
                    // this.query(value)
                } else if (method === "interval" || method === "index" || method === "notes" || method === "duration" || method === "gain" || method === "mutate") {
                    this[`_${method}`] = formatParams(value)
                } else {
                    this.audioParams[method] = formatParams(value)
                }
            })
            if(shouldQuery) this.query(params.query)
        }
    }


    class Player extends ToneInstrument {
        constructor (opts) {
            super(opts)
        }

        _initInstrument(sounds) {
            sounds.results.forEach((sound, i) => {
                this.sounds[i] = sounds.getSound(i)
                this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).connect(this.gain)
            })
        }

        _trigger() {
             const index = this._index()
             const p = this.samples[index]
            
             if (this.active && p && p.loaded) {
                // mutate one sample (load similar sounds)
                if(Math.random() < this._mutate()/100) {
                    const mutateIndex = Math.floor(Math.random()*this.samples.length)
                    this.loadSimilar(mutateIndex)
                }
               // console.log('playing', p)
                 Object.entries(this.audioParams).forEach(([prop, value]) => {
                    // console.log(prop, value)
                     p[prop] = value()
                 })
                 const gainValue = this._gain()
                 if(!isNaN(gainValue)) this.gain.gain.rampTo(gainValue, 0.01)
                 p.start()
                // this._trigger(p)
                //${/*this.sounds[index].analysis.lowlevel.pitch.mean*/}
                // console.log(this.sounds[index].name, p.buffer.duration.toFixed(2))
                el.innerHTML += `playing [${index}] ${this.sounds[index].name}. ${p.buffer.duration.toFixed(2)} .}  `
                 el.scrollTop = el.scrollHeight;
             }
            
        }
    }

    class Sampler extends ToneInstrument {
        constructor (opts) {
            super(opts)
            this._notes = () => ["C1", "E1", "G1", "B1"]
        }

        _initInstrument(sounds) {
            // sounds.results.forEach((sound, i) => {
            //     this.sounds[i] = sound
            //     this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).connect(this.gain)
            // })
              const urls = {}
                sounds.results.forEach((sound) => {
                    const midi = Math.floor(ftm(sound.analysis.lowlevel.pitch.mean))
                    urls[midi] = sound.previews[audio_preview_key]
                })
                // console.log('urls', urls)
                const sampler = new Tone.Sampler({
                    urls,
                    baseUrl: "",
                    onload: () => {
                        sampler.triggerAttackRelease(this._notes(), this._currInterval);
                    }
                }).connect(this.gain)
                this.sampler = sampler
                console.log('init ')
        }

        _trigger() {
            if(this.sampler && this.sampler.loaded){
                // console.log('playing', this.notes)
                Object.entries(this.audioParams).forEach(([prop, value]) => {
                    console.log(prop, value)
                    this.sampler[prop] = value()
                })
              this.sampler.triggerAttackRelease(this._notes(), this._currInterval);
            }
        }
    }

    ['f0', 'f1', 'f2', 'f3'].forEach((_f) => {
       window[_f] = new Player()
        // window[_f] = new Sampler()
    })

   const players =  ['g0', 'g1', 'g2', 'g3']
   players.forEach((_g) => {
        // window[_g] = new Player()
       // console.log(_g)
       window[_g] = new Sampler()
        // window[_g] = new Player()
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