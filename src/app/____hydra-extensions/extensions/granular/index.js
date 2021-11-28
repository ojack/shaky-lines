window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
var context = new AudioContext();
var Synth = require('./Synth.js')

class Granular {
  constructor () {
    var self = this
    this.context = new AudioContext()
    this.master = this.context.createGain()
    this.master.connect(this.context.destination)

    loadSound((b) => {
      self.synth = new Synth(self.context, {buffer: b, master: self.master} )
      // window.onmousedown = (e) => {
      //   console.log('mousedown')
      //   synth.offset = b.duration * e.pageX/window.innerWidth
      //   synth.spread = 2 * e.pageY/window.innerHeight
      //   synth.play()
      // }
      //
      // window.onmousemove = (e) => {
      //     synth.offset = b.duration * e.pageX/window.innerWidth
      //       synth.spread = 10 * e.pageY/window.innerHeight
      // }
      // window.onmouseup = (e) => {
      //   console.log('mouseup')
      //   synth.stop()
      // }
      window.synth = this.synth
    })
  }



}

// // load audio data
function loadSound (callback) {
  var request = new XMLHttpRequest();
  request.open('GET','/home/ojack/Documents/PROJECTS/HYDRA_SOUND/CORE/hydra-extensions/extensions/granular/audio/ozuna.mp3',true);
  request.responseType = "arraybuffer";
  request.onload = () => {
    context.decodeAudioData(request.response, callback, () => {
      console.log('loading failed');
      alert('loading failed');
    });
  }
  request.send();
}
//
// var data;
//
// //
// var buffer,buffer2; //global variables for sample files
// var master = context.createGain();
// master.connect(context.destination);
//
// loadSound((b) => {
//   var synth = new Synth(context, {buffer: b, master: master} )
//   window.onmousedown = (e) => {
//     console.log('mousedown')
//     synth.offset = b.duration * e.pageX/window.innerWidth
//     synth.spread = 2 * e.pageY/window.innerHeight
//     synth.play()
//   }
//
//   window.onmousemove = (e) => {
//       synth.offset = b.duration * e.pageX/window.innerWidth
//         synth.spread = 10 * e.pageY/window.innerHeight
//   }
//   window.onmouseup = (e) => {
//     console.log('mouseup')
//     synth.stop()
//   }
//   window.synth = synth
// })

module.exports = Granular
