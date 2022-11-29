const Tone = require('tone')

// apply effects to each individual sample
// gain, 
// how to handle situatio
class Sampler {
    constructor ({ destination } = {}) {
        this.gain = new Tone.Gain(1)
        this.sample = null
        this.gain.connect(destination)
    }

    loadSound (sound) {
        this.sample = new Tone.Player(sound)
        this.sample.connect(this.gain)
    }
}