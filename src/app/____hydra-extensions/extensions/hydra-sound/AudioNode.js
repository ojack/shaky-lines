// Fore list of tuna effects, see https://github.com/Theodeus/tuna/wiki/Node-examples
const Tuna = require('./lib/tunajs')


class AudioNode {
  constructor({ ctx, dest }) {
    this.ctx = ctx
    this.tuna = new Tuna(ctx)
    this.dest = dest
    this.nodes = []
    this.dynamicArgs = [] // array containing arguments that change each update
//    this.sourceNode = this.ctx.createGain() // pass through node for effects chain
    this._resetNodes()
  //  this.out()
    window.tuna = Tuna
    var self = this
  //  window.tuna = this.tuna
    // get functions and default parameters from tuna
    Object.keys(this.tuna.__proto__).forEach((effectName) => {
      if(effectName !== 'toString' && effectName !== 'Gain') {
        var defaultArgs = this.tuna.__proto__[effectName].prototype.defaults
      //  var defaultArray = []
        //
        // Object.keys(defaults).forEach((key) => {
        //   defaultArray.push({
        //     name: key,
        //     value: defaults[key].value,
        //     props: defaults[key]
        //   })
        // })
        //  console.log('defualts', defaultArray, this.tuna.__proto__, effectName)
        const functionName = effectName.toLowerCase()
        AudioNode.prototype[functionName] = function (userArgs = {}) {
            this._appendTunaNode(effectName, userArgs, defaultArgs)
            return this
        }
      }
    })
  }

  updateHydra(dt) {
    this.dynamicArgs.forEach((func) => func(dt))
  }

  hush() {
    this._resetNodes()
  }

  _resetNodes () {
    //this.sourceNode.disconnect()
    this.nodes.forEach((node) => node.disconnect())
    this.nodes = []
    this.lastNode = null
  //  this.lastNode = this.sourceNode;
//   this.nodes.push(this.sourceNode)
    this.dynamicArgs = []
  }

  _appendNode( node ) {
    if (this.lastNode !== null) this.lastNode.connect(node)
    this.lastNode = node
    this.nodes.push(node)
  }


  /* source nodes accept no inputs or previous nodes*/
  osc (...userArgs) {
    //  frequency = 440, type = 'sine'
      this._resetNodes()
      var oscillator = this.ctx.createOscillator()
      const defaultArgs = [
        {
          name: 'frequency', value: 440, f: (node, val) => node.frequency.setValueAtTime(val, this.ctx.currentTime)
        },
        {
          name: 'type', value: 'sine', f: (node, val) => node.type = val
        }
      ]
      this._applyArgs(oscillator, userArgs, defaultArgs)
      oscillator.start()
      this._appendNode(oscillator)
      return this
  }

  src(node) {
    this._resetNodes()
    this._appendNode(node)
    return this
  }

  _applyArgs(node, userArgs, defaultArgs) {
    defaultArgs.forEach((defaultArg, index) => {
      var arg = defaultArg.value
      if(userArgs[index]) arg = userArgs[index]
      var valueFunction = arg
      if(typeof arg !== 'function') valueFunction = () => arg
      this.dynamicArgs.push( (dt) => {
        defaultArg.f(node, valueFunction())
      })
    })
  }


  /* filter nodes */
    filter ( ...userArgs) {
      var biquadFilter = this.ctx.createBiquadFilter()
      const defaultArgs = [
        {
          name: 'frequency', value: 100, f: (node, val) => node.frequency.setValueAtTime(val, this.ctx.currentTime)
        },
        {
          name: 'detune', value: 0, f: (node, val) => node.detune.setValueAtTime(val, this.ctx.currentTime)
        },
        {
          name: 'Q', value: 1, f: (node, val) => node.Q.setValueAtTime(val, this.ctx.currentTime)
        },
        {
          name: 'gain', value: 1, f: (node, val) => node.gain.setValueAtTime(val, this.ctx.currentTime)
        },
        {
          name: 'type', value: 'lowpass', f: (node, val) => node.type = val
        }
      ]
      this._applyArgs(biquadFilter, userArgs, defaultArgs)
    //  biquadFilter.gain.setValueAtTime(25, this.ctx.currentTime)
      this._appendNode(biquadFilter)
      return this
    }

    lpf(frequency = 300, detune = 0, Q = 1) {
      return this.filter(frequency, detune, Q, 1, 'lowpass')
    }

    hpf(frequency = 500, detune = 0, Q = 1) {
      return this.filter(frequency, detune, Q, 1, 'highpass')
    }

    /* TUNA JS nodes */
    // chorus(...userArgs) {
    //   let defaultArgs = [
    //     { name: 'rate', value: 1.5 },
    //     { name: 'feedback', value: 0.2 },
    //     { name: 'delay', value: 0.0045}
    //   ]
    //   this._appendTunaNode('Chorus', userArgs, defaultArgs)
    //   return this
    // }
    //
    // delay(...userArgs) {
    //   let defaultArgs = [
    //     { name: 'feedback', value: 0.45 },
    //     { name: 'delayTime', value: 150 },
    //     { name: 'wetLevel', value: 0.25},
    //     { name: 'dryLevel', value: 1},
    //     { name: 'cutoff', value: 2000}
    //   ]
    //   this._appendTunaNode('Delay', userArgs, defaultArgs)
    //   return this
    // }
    //
    // phaser(...userArgs) {
    //   let defaultArgs = [
    //     { name: 'rate', value: 1.2 },
    //     { name: 'depth', value: 0.3 },
    //     { name: 'feedback', value: 0.2},
    //     { name: 'stereoPhase', value: 30},
    //     { name: 'baseModulationFrequency', value: 700}
    //   ]
    //   this._appendTunaNode('Phaser', userArgs, defaultArgs)
    //   return this
    // }
    //
    // overdrive(...userArgs) {
    //   let defaultArgs = [
    //     { name: 'drive', value: 0.7 },
    //     { name: 'curveAmount', value: 1 },
    //     { name: 'algorithmIndex', value:0},
    //     { name: 'outputGain', value: 0}
    //   ]
    //   this._appendTunaNode('Overdrive', userArgs, defaultArgs)
    //   return this
    // }
    //
    // compressor(...userArgs) {
    //   let defaultArgs = [
    //     { name: 'threshold', value: -1 },
    //     { name: 'makeupGain', value: 1 },
    //     { name: 'attack', value: 1},
    //     { name: 'release', value: 0},
    //     { name: 'ratio', value: 4},
    //     { name: 'knee', value: 5},
    //     { name: 'automakeup', value: true}
    //   ]
    //   this._appendTunaNode('Compressor', userArgs, defaultArgs)
    //   return this
    // }
    //
    // tremolo (...userArgs) {
    //   let defaultArgs = [
    //     { name: 'intensity', value: 0.3 },
    //     { name: 'rate', value: 4 },
    //     { name: 'stereoPhase', value: 0}
    //   ]
    //   this._appendTunaNode('Tremolo', userArgs, defaultArgs)
    //   return this
    // }

// expecting parameter OBJECTS rather than arrays
    _appendTunaNode(nodeName, userArgs, defaultArgs) {
      let tunaNode = new this.tuna[nodeName]
      Object.keys(defaultArgs).forEach((key) => {
        var defaultArg = defaultArgs[key]
        var arg = defaultArg.value
        if(userArgs[key]) arg = userArgs[key]
        var valueFunction = arg
        if(typeof arg !== 'function') valueFunction = () => arg
        this.dynamicArgs.push( (dt) => {
          tunaNode[key]  = valueFunction()
        })
      })
      this._appendNode(tunaNode)
    }
    //
    // delay(...userArgs) {
    //   var delay = this.ctx.createDelay()
    //   const defaultArgs = [
    //     {
    //       name: 'delayTime', value: 1, f: (node, val) => node.delayTime.setValueAtTime(val, this.ctx.currentTime)
    //     }
    //   ]
    //   this._applyArgs(delay, userArgs, defaultArgs)
    // //  biquadFilter.gain.setValueAtTime(25, this.ctx.currentTime)
    //   this._appendNode(delay)
    //   return this
    // }

    gain (...userArgs) {
      const defaultArgs = [
        {
          name: 'gain', value: 1, f: (node, val) => node.gain.setValueAtTime(val, this.ctx.currentTime)
        }
      ]
      var gain = this.ctx.createGain()
      this._applyArgs(gain, userArgs, defaultArgs)
      this._appendNode(gain)
      return this
    }

    out (dest = this.dest) {
      console.log(this.nodes)
      this.lastNode.connect(dest)
    }
}

// function formatArgs(args) {
//   var newArgs = {}
//   Object.keys(args).forEach((arg) => {
//     if(typeof args[index] === 'function')
//   })
// }

module.exports = AudioNode
