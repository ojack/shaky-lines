const Tone = require('tone')

module.exports = class ToneSynth {
    constructor() {
        // const synth = new Tone.Synth().toDestination()
        // this.synth = synth

        const synth = new Tone.MembraneSynth().toDestination();
        //synth.triggerAttackRelease("C2", "8n");
        this.synth = synth
        //this.gain = new Tone.Gain(0)
    }

    start() {
        Tone.start()

    }
    trigger(val) {
        // this.synth.volume.value = val
        console.log(val)
        this.synth.triggerAttackRelease("C2", "8n", Tone.now(), val);
    }


}