//const sampleInfo = require('./impulseResponse.json')

class SampleLoader {
  constructor ({ctx, samples}) {
    this.ctx = ctx
    samples.forEach( (sample) => {
      if(sample.url) this.loadSample(sample)
    })
  }

  loadSample (sample ) {
    var url = sample.url
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    this.request = request;

    var asset = this;
    var self = this
    request.onload = function(req, res) {
      //  console.log(req, res, request)
        self.ctx.decodeAudioData(request.response, (buffer) => {
          self.buffer = buffer
        } );
    }

    request.send()
  }
}

module.exports = SampleLoader
