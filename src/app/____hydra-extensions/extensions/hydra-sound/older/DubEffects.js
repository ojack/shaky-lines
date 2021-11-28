class AudioNode {
  constructor({ ctx, dest }) {
    this.ctx = ctx
    this.dest = dest
    this.nodes = []
    this.dynamicArgs = [] // array containing arguments that change each update
//    this.sourceNode = this.ctx.createGain() // pass through node for effects chain
    this._resetNodes()
  //  this.out()
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

    delay(...userArgs) {
      var delay = this.ctx.createDelay()
      const defaultArgs = [
        {
          name: 'delayTime', value: 1, f: (node, val) => node.delayTime.setValueAtTime(val, this.ctx.currentTime)
        }
      ]
      this._applyArgs(delay, userArgs, defaultArgs)
    //  biquadFilter.gain.setValueAtTime(25, this.ctx.currentTime)
      this._appendNode(delay)
      return this
    }

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
