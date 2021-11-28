// function usable with pixel triggers. Ideal syntax:

// pixel{{
//   count: 5,
//   trigger: ({i}) => s.drums[4][i].play({ gain: px.red, }).convolve('ddf'),
//   triggerThresh: 0.8,
//   //sampleSpacing:
// }}
const baseUrl = '/home/ojack/Documents/PROJECTS/HYDRA_SOUND/CORE/hydra-extensions/extensions/hydra-sound/'
const Voice = require('./Voice.js')
const utils = require('./audio-utils.js')

const drumKits = [
    "R8",
    "CR78",
    "KPR77",
    "LINN",
    "Kit3",
    "Kit8",
    "Techno",
    "Stark",
    "breakbeat8",
    "breakbeat9",
    "breakbeat13",
    "acoustic-kit",
    "4OP-FM",
    "TheCheebacabra1",
    "TheCheebacabra2"
  ]

const instruments = [ 'tom1', 'tom2', 'tom3', 'hihat', 'snare', 'kick']


class DrumMachine extends Voice {
  constructor (opts) {
    super(opts)

    this.ctx = opts.ctx

    this.kits = drumKits.map ( (name) => [] )

    var self = this
    drumKits.forEach ( (kit, kitIndex) => {
      instruments.forEach ( (instrument, instrumentIndex) => {
        var path = baseUrl+`sounds/drum-samples/${kit}/${instrument}.wav`
        utils.loadSample(self.ctx, path, (buffer) => self.kits[kitIndex][instrumentIndex] = buffer)
      })
    })
  }

  play(kit, instrument, gain = 1, rate = 1) {
  //  console.log('playing', kit, instrument)
    this.playNote(this.kits[kit][instrument], true, 0,0,-2, 0.5, gain, rate, 1.0)
  }

  playNote(buffer, pan, x, y, z, sendGain, mainGain, playbackRate, noteTime) {
      // Create the note
    //  console.log(buffer, pan)
      var voice = this.ctx.createBufferSource();
      voice.buffer = buffer;
      voice.playbackRate.value = playbackRate;

      //voice.connect( this.ctx.destination)
      // Optionally, connect to a panner
      var finalNode;
      if (pan) {
          var panner = this.ctx.createPanner();
          panner.panningModel = "HRTF";
          panner.setPosition(x, y, z);
          voice.connect(panner);
          finalNode = panner;
      } else {
          finalNode = voice;
      }

      // Connect to dry mix
      var dryGainNode = this.ctx.createGain();
      dryGainNode.gain.value = mainGain * this.effectDryMix;
      finalNode.connect(dryGainNode);
      dryGainNode.connect(this.gain);

      // Connect to wet mix
      var wetGainNode = this.ctx.createGain();
      wetGainNode.gain.value = sendGain;
      finalNode.connect(wetGainNode);
      wetGainNode.connect(this.convolver);



      voice.start(noteTime);
  }
}

module.exports = DrumMachine
