// starting to adapt code to be live codeable
// 1. Function to call from console with search term, that calls api and requests sounds
// 2. play sound in the browser
// 3. play with tonejs
// 4. switch to tonejs player
// 5. define syntax

var filter = "duration:[0%20TO%201.5]";
var page_size = 5 //10;
// available fields: https://freesound.org/docs/api/resources_apiv2.html#sound-instance-response
var fields = "id,name,previews,license,username,description,created,analysis";
var descriptors = "lowlevel.spectral_centroid.mean,lowlevel.pitch.mean";
var audio_preview_key = 'preview-hq-mp3';

freesound.setToken("d31c795be3f70f7f04b21aeca4c5b48a599db6e9");

window.cycle = 1000

//calculate a euclidean rhythm
function euclid(steps,  pulses){
    const storedRhythm = []; //empty array which stores the rhythm.
    //the length of the array is equal to the number of steps
    //a value of 1 for each array element indicates a pulse

    var bucket = 0; //out variable to add pulses together for each step

    //fill array with rhythm
    for( var i=0 ; i < steps ; i++){ 
        bucket += pulses; 
            if(bucket >= steps) {
            bucket -= steps;
            storedRhythm.push(1); //'1' indicates a pulse on this beat
        } else {
            storedRhythm.push(0); //'0' indicates no pulse on this beat
        }
    }
    const pat = storedRhythm.reverse()
    console.log('pattern', pat)
    const dur = []
    let curr = 0
    let chunk = window.cycle / pat.length
    pat.forEach((val, i) => {
       
        if(val === 1 && i != 0) {
            dur.push(curr)
            curr = 0
        } 
        curr += chunk
    })
    dur.push(curr)
    console.log(dur)
    return dur
}

window.euclid = euclid

function rotateSeq(seq, rotate){
    var output = new Array(seq.length); //new array to store shifted rhythm
    var val = seq.length - rotate;

    for( var i=0; i < seq.length ; i++){
        output[i] = seq[ Math.abs( (i+val) % seq.length) ];
    }

    return output;
}

// trans liberation / frequency to midi
const ftm = (freq = 440) => 69 + 12 * Math.log2(freq / 440)

const seq = (arr = []) => {
    let i = 0
    return (v) => {
      const curr = i
      i++
      if(i >= arr.length) i = 0
      return arr[curr]
    }
  }

const wrand = (outcomes = [], probabilities = []) => {
    const sum = probabilities.reduce((a, b) => a + b, 0)
    const scaledProbs = probabilities.map((p) => p/sum)
    const r = Math.random()
    let index = outcomes.length - 1
    let thresh = 0
    scaledProbs.forEach((p, i) => {
        if( r < p + thresh && i < index) {
            index = i
        }
        thresh += p
    })
    return outcomes[index]
}

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
                this.samples[i] = new Tone.Player(sound.previews[audio_preview_key]).toDestination()
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

window.p0 = new Player()

// @todo: add pitch, duration, etc.
function query(q = "bell", callback) {
    console.log('querying', q)
    freesound.textSearch(q, {page:1, filter:filter, 
        fields:fields, descriptors: descriptors, 
         page_size:page_size, group_by_pack:1},
         callback
         ,function(err){ console.log("Error while searching...", err)}
     );
}

window.search = (query = "hello") => {
    console.log('searching', query)
    freesound.textSearch(query, {page:1, filter:filter, 
       fields:fields, descriptors: descriptors, 
        page_size:page_size, group_by_pack:1},
        function(sounds){
            console.log('got sounds', sounds)
            // sounds.results = shuffle(sounds.results); // randomize
                for (var i in sounds.results){
                    const sound = sounds.results[i]
                    const audioEl = document.createElement('audio')
                    document.body.appendChild(audioEl)
                    audioEl.src = sound.previews[audio_preview_key]
                    audioEl.play()
                }
                const urls = {}
                sounds.results.forEach((sound) => {
                    const midi = Math.floor(ftm(sound.analysis.lowlevel.pitch.mean))
                    urls[midi] = sound.previews[audio_preview_key]
                })
                console.log('urls', urls)
                const sampler = new Tone.Sampler({
                    urls,
                    baseUrl: "",
                    onload: () => {
                        sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
                    }
                }).toDestination()
                window.sampler = sampler
            //     if (i < 16){
            //         var sound = sounds.results[i];
            //         NEW_TRIGGERS_SOUND_INFORMATION.push({'id':sound.id,
            //                                          'preview': sound.previews[audio_preview_key],
            //                                          'name':sound.name,
            //                                          'license':sound.license,
            //                                          'username':sound.username,
            //                                          'description':sound.description,
            //                                          'created':sound.created
            //         });
            //         load_sound(i, sound.previews[audio_preview_key]); 
            //     }
            // }
            // TRIGGERS_SOUND_INFORMATION = NEW_TRIGGERS_SOUND_INFORMATION;
            // destroy_popovers();
            // for (var i = 0; i < 16; i++) {
            //     set_popover_content("trigger_" + i);
            // }
            // set_progress_bar_value(100);

        },function(err){ console.log("Error while searching...", err)}
    );
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