const effectInfo = require('./effects.json')
//const SampleLoader = require('./SampleLoader.js')
const utils = require('./audio-utils.js')
const baseUrl = '/home/ojack/Documents/PROJECTS/HYDRA_SOUND/CORE/hydra-extensions/extensions/hydra-sound/'

class Effects  {
  constructor ({ctx}) {
    this.effects = {}
    this.names = []

    var self = this
    effectInfo.forEach((effect, index) => {
      this.effects[effect.name] = effect
      this.names.push(effect.name)
      if(effect.url) {
        utils.loadSample(ctx, baseUrl+effect.url, (buffer) => {
          self.effects[effect.name].buffer = buffer
        })
      }
    })
  }


}

module.exports = Effects
