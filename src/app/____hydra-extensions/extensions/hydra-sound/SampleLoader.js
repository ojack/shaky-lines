// receives a folder path and loads all samples from that directory into audio buffers
var recursive = require("recursive-readdir")
var path = require('path')

const fs = require('fs')
const utils = require('./lib/audio-utils.js')

class SampleLoader {
  constructor (ctx) {
    // let samples = {}
    // var buffers = []
    // var arr = loadFiles('', '', buffers)
    // console.log(buffers, arr)
    // var self = this
    // this.loadAudioSamples(ctx, sampleFolder, (buffers) => {
    //   console.log(buffers)
    //   self.buffers = buffers
    // })
    this.ctx = ctx
  }

  generateTree(buffers) {
    var buffArray = Object.keys(buffers)
    const output = {};
    let current;

    for (const file of buffArray) {
        let parsed = path.parse(file).dir + '/' + path.parse(file).name
        current = output;
        const segments = parsed.split('/')
        for (var i = 0; i < segments.length; i++) {
            const segment = segments[i]
            if (segment !== '') {
                  if (!(segment in current)) {
                      if(i < segments.length - 1){
                        current[segment] = {};
                      } else {
                        //  current[i] = buffers[file]
                          current[segment] = buffers[file]
                      }
                  }

                current = current[segment];
            }
        }
    }
    // var alpha = Object.keys(output).sort().forEach((key, index) => {
    //   output[index] = output[key]
    // })

    // add array indexing for files in tree
    this.fileTree = output
    this.generateIndex(output)
    console.log(output)
    return output
  }

  generateIndex(obj) {
    Object.keys(obj).sort().forEach((key, index) => {
        console.log(obj[key].constructor)
        if(typeof obj[key] === 'object') {
          obj[index] = obj[key]
          if (obj[key].constructor == AudioBuffer) {

          } else {
            obj[index].name = key
            this.generateIndex(obj[key])
          }
        }
    })
  }

  // load()
  // Receives a folder on the local file system, and returns an array of audio buffers
  loadAudioSamples(basePath, callback) {
    var self = this
    let audioFileCount = 0
    let loadedCount = 0
    let errorCount = 0
    let buffers = {}
    recursive(basePath, function (err, files) {
      // `files` is an array of file paths
    //  console.log(files);
      files.forEach((file) => {
        var ext = path.extname(file).toLowerCase()
        if (ext === '.wav' || ext === '.mp3'/*|| ext === '.aif'*/) {
          audioFileCount ++
          var shortPath = file.slice(basePath.length)
          //  console.log(file)
          utils.loadSample(self.ctx, file, (buffer) => {
              console.log("loaded " +  shortPath)
            //  self.effects[effect.name].buffer = buffer
            buffers[shortPath] = buffer
            loadedCount++
            if(loadedCount >= audioFileCount) callback(buffers, loadedCount, errorCount)
          }, (e) => {
            console.log("Error decoding audio data: " + e, shortPath)
            errorCount++
            loadedCount++
            if(loadedCount >= audioFileCount) callback(buffers, loadedCount, errorCount)
          })
        }
      })
    });
  }
}

module.exports = SampleLoader
