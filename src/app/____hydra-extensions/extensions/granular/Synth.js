const Grain = require('./Grain.js')

class Synth {
  constructor(context, {density = 0.85, buffer, master}) {
    this.context = context
    this.buffer = buffer
    this.grains = []
  	this.grainCount = 0
    this.maxGrains = 20,
    this.master = master

    this.density = 0.6
    this.offset = 0.3
    this.spread = 0.2
    this.trans = 1
    this.attack = 0.20,
    this.release = 0.40,
    this.gain = 0.4
  }

  play (opts) {
    var g = new Grain(this.context, {
      buffer: this.buffer,
      master: this.master,

      offset: this.offset,
      spread: this.spread,
      density: this.density,
      trans: this.trans,
      attack: this.attack,
      release: this.release,
      gain: this.gain
    });


		//push to the array
		this.grains[this.grainCount] = g;
		this.grainCount++;

		if(this.grainCount > this.maxGrains){
			this.grainCount = 0;
		}

    this.interval = ((1 -this.density) * 500) + 70;
    this.timeout = setTimeout(this.play.bind(this),this.interval);
  }

  stop () {
    clearTimeout(this.timeout)
  }
}

module.exports = Synth
