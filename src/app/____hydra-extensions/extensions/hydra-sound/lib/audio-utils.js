//const sampleInfo = require('./impulseResponse.json')

//const app = require('electron').remote.app
module.exports = {
  loadSample: function (ctx, url, successCallback, errorCallback)  {
  //  console.log(app.getAppPath())
    var url = url
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function(req, res) {
      //  console.log(req, res, request)
        ctx.decodeAudioData(request.response, successCallback, errorCallback);
    }

    request.send()
  }
}
