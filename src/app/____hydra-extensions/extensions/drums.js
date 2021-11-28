// gets pixels colors from a canvas and uses to control values
//var PixelController = require('./PixelController.js')
const AudioContext = window.AudioContext || window.webkitAudioContext;


class PixelSynth {
  constructor ({ gl, ctx}) {
   this.audioCtx = new AudioContext()
   this.drawCtx = ctx
   this.gl = gl
   this.oscillators = []

   // init

    this.pixelArray = new Uint8Array(4*this.gl.drawingBufferHeight)


   // this.generateFrequencies({
   //   number: this.numFrequencies,
   //   numOctaves: 2,
   //   baseFrequency: 160
   // })

   this.init()

   this.elapsedFrames = 0
  }

  init({
    speed = 0,
    startX = 300,
    numFrequencies = 10,
    numOctaves = 10,
    baseFrequency = 1.34,
    updateInterval = 1,
    fadeTime = 0.05,
    ratio = 3/2
  } = {}) {
    this.x = startX
    this.speed = speed
    this.numFrequencies = numFrequencies
    this.pixelDownsample = Math.floor(this.gl.drawingBufferHeight/this.numFrequencies)
    this.updateInterval = updateInterval
    this.fadeTime = fadeTime

    // this.frequencies = this.generateFrequencies({
    //   number: numFrequencies,
    //   numOctaves: numOctaves,
    //   baseFrequency: baseFrequency
    // })

    this.frequencies = this.generateFrequenciesByRatio({
      number: numFrequencies,
      ratio: ratio,
      baseFrequency: baseFrequency
    })

    console.log('frequencies', this.frequencies)
    this.createOscillators()
  }

  // @todo: explore other ways of determining frequencies
  // from https://github.com/grz0zrg/fs/blob/master/js/audio.js
  generateFrequencies({
    number, numOctaves, baseFrequency
  }) {
    console.log('FREQ', this.frequencies)
    var octaveLength = number / numOctaves
    // from https://stackoverflow.com/questions/4364823/how-do-i-obtain-the-frequencies-of-each-value-in-an-fft
    return new Array(number).fill(0).map((val, index) => baseFrequency * Math.pow(2, index / octaveLength))
  }

  generateFrequenciesByRatio ({ ratio, number, baseFrequency}) {
    return new Array(number).fill(0).map((val, index) => baseFrequency * Math.pow(ratio, index))
  }

  updateHydra() {
    this.x +=this.speed
    if(this.x >= this.gl.drawingBufferWidth) this.x = 0
    //console.log(this)
    //
    this.elapsedFrames++
     if(this.elapsedFrames%this.updateInterval == 0) {
        this.gl.readPixels(this.x, 0, 1, this.gl.drawingBufferHeight, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.pixelArray);

       this.drawCtx.clearRect(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight)

    //   this.drawCtx.fillRect(this.x, 0, 20, this.gl.drawingBufferHeight)
      this.draw()
     }
  }

  createOscillators() {
    var compressor = this.audioCtx.createDynamicsCompressor();
    compressor.connect(this.audioCtx.destination)

    this.disconnectAll()

    var oscillators = []
    this.frequencies.forEach((frequency, index) => {
      var oscillator = this.audioCtx.createOscillator()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime) // value in hertz

      var gainNode = this.audioCtx.createGain()
      gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)

      gainNode.connect(compressor)
    //  gainNode.connect(this.audioCtx.destination)

      oscillator.connect(gainNode)
      oscillators[index] = {
        gain: gainNode,
        osc: oscillator
      }

      oscillator.start(this.audioCtx.currentTime + Math.random()*this.fadeTime*2)
    })
    this.oscillators = oscillators
    // create Oscillator node

  }

  disconnectAll () {
    var stopTime = this.audioCtx.currentTime + this.fadeTime
    this.oscillators.forEach( (osc) => {
      osc.gain.gain.linearRampToValueAtTime(0, stopTime)
      osc.osc.stop(stopTime + 0.01)
    })
    this.oscillators = []
  }

  draw() {
  //  console.log(this.pixelArray)
    for (var i = 0; i < this.gl.drawingBufferHeight; i++) {
    //  this.drawCtx.fillStyle = '#32a8a4'
       this.drawCtx.fillStyle = '#fff'
      this.drawCtx.fillRect(this.x, this.gl.drawingBufferHeight - i, 1 + this.pixelArray[i*4], 1)
    //  this.gains[i].gain.cancelScheduledValues(this.audioCtx.currentTime);

      // var oscIndex = Math.floor(i/this.pixelDownsample)
      // if(oscIndex < this.gains.length) this.gains[oscIndex].gain.linearRampToValueAtTime((this.pixelArray[i*4]/255)/(this.gains.length/20), this.audioCtx.currentTime+0.01)
    }

    for (var i = 0; i < this.oscillators.length; i++) {
      var bufferIndex = Math.floor(i* this.pixelDownsample*4)
      this.oscillators[i].gain.gain.linearRampToValueAtTime((this.pixelArray[bufferIndex]/255)/(this.oscillators.length), this.audioCtx.currentTime+ this.fadeTime)
    }
  }
  //
  // read() {
  // //  this.gl.readPixels(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.pixels);
  //
  // //  this.gl.readPixels(0, 0, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.pixels)
  // //  console.log(this.pixels); // Uint8Array
  // }
}

module.exports = PixelSynth
