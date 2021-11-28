// function usable with pixel triggers. Ideal syntax:

// pixel{{
//   count: 5,
//   trigger: ({i}) => s.drums[4][i].play({ gain: px.red, }).convolve('ddf'),
//   triggerThresh: 0.8,
//   //sampleSpacing:
// }}

// generic class for a sound generator that includes a gain as well as effects

class Voice {
  constructor ( {ctx, output, effects} ) {
    this.ctx = ctx
    this.effects = effects
  //  this.output = output
    // create master filter node
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 0.5 * this.ctx.sampleRate;
    this.filter.Q.value = 1;
    this.filter.connect(output);

    // Create master volume.
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0.7; // reduce overall volume to avoid clipping
    this.gain.connect(this.filter);

    // Create effect volume.
    this.effectGain = this.ctx.createGain();
    this.effectGain.gain.value = 1.0; // effect level slider controls this
    this.effectGain.connect(this.gain);

    // Create convolver for effect
    this.convolver = this.ctx.createConvolver();
    this.convolver.connect(this.effectGain);

    this.effectDryMix = 1
    this.effectWetMix = 1
    this.setEffectIndex(0)
  }

  setEffectIndex ( index ) {
    var name = this.effects.names[index]
    if (name) {
      this.setEffect(name)
    } else {
      console.log('EFFECT NOT FOUND')
    }
  }

  setEffect( name ) {

    this.effect = this.effects.effects[name]

    this.effectDryMix = this.effect.dryMix
    this.effectWetMix = this.effect.wetMix

    // this.convolver = this.ctx.createConvolver();
    // this.convolver.connect(this.effectGain);
    this.convolver = this.ctx.createConvolver();
    this.convolver.connect(this.effectGain);
    this.convolver.buffer = this.effect.buffer

  }
}

module.exports = Voice
