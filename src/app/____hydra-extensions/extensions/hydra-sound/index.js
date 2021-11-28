//const Drums = require('./drum-machine.js')
//const Effects = require('./Effects.js')
const Grain = require('./grain.js')
const SampleLoader = require('./SampleLoader.js')
const sampleFolder = '/home/ojack/Music/hydra-samples'
const AudioNode = require('./AudioNode.js')

class HydraSound {
  constructor () {
    this.ctx = new AudioContext()

    if (this.ctx.createDynamicsCompressor) {
        // Create a dynamics compressor to sweeten the overall mix.
        var compressor = this.ctx.createDynamicsCompressor();
        compressor.connect(this.ctx.destination);
        this.output = compressor;
    } else {
        // No compressor available in this implementation.
        this.output = this.ctx.destination;
    }

   var samples = new SampleLoader(this.ctx)
   samples.loadAudioSamples(sampleFolder,  (buffers) => {
   //   console.log(buffers)
      //  window.buffers = buffers
        //var buffArray = Object.keys(window.buffers)
        window.buffers = samples.generateTree(buffers)
        console.log(window.buffers)
    })

   window.fx0 = new AudioNode ({ ctx: this.ctx, dest: this.output})

   window.b0 = this.ctx.createGain()
  //  this.effects = new Effects( {ctx: this.ctx})
  //  this.drums = new Drums({ ctx: this.ctx, effects: this.effects, output: this.output })

    //window.drums = this.drums

    window.grain = (opts) => {
      var buffer = window.buffers.granular.ozuna
    //  console.log(buffer, window.buffers)
     var grainOpts = Object.assign({}, {buffer: buffer, dest: window.b0}, opts)
  //  var grainOpts = Object.assign({}, {buffer: buffer, dest: this.output}, opts)
      new Grain(this.ctx, grainOpts)
    }

  //  window.grain.out = (_outputNode)
  }
}

module.exports = HydraSound
