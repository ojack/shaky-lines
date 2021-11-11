// hydra component
// @todo: remove patch bay from thie (add to config)
const html = require('choo/html')
const Component = require('choo/component')
const HydraSynth = require('hydra-synth')
const loop = require('raf-loop')

const { desktopCapturer } = require('electron')


// only in electron
// const { desktopCapturer } = require('electron')

// const PatchBay = require('./../src/pb-live.js')

module.exports = class HydraCanvas extends Component {

  constructor (id, state, emit) {
    super(id)

    this.local = state.components[id] = {}
  }

  load (element) {
    let isIOS =
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream;

    let precisionValue = isIOS ? 'highp' : 'mediump'

    var hydra = new HydraSynth({ canvas: element, autoLoop: false,  precision: precisionValue})
  //  osc(4, 0.1, 0.9).out()
    addScreenshare(hydra)
    s0.init({src:window.fabricCanvas})
    var engine = loop(function(dt) {
      hydra.tick(dt)
    }).start()
  }

  update (center) {
    // if (center.join() !== this.local.center.join()) {
    //   this.map.setCenter(center)
    // }
    return false
  }

  createElement ({
    width = window.innerWidth,
    height = window.innerHeight
  } = {}) {
    // this.local.center = center
    this.canvas = html`<canvas
      style="width:100%;height:100%;" width=${width} height=${height}
      ></canvas>`
    return this.canvas
  }
}

function addScreenshare(hydra) {
  hydra.s.forEach((source) => {
    source.initVideo = (url = '') => {
    // const self = this
    const vid = document.createElement('video')
    vid.crossOrigin = 'anonymous'
    vid.autoplay = true
    vid.loop = true
    vid.addEventListener('canplay', () => {
      source.src = vid
      vid.play()
  //    document.body.appendChild(vid)
      source.tex = source.regl.texture(source.src)
      source.dynamic = true
    })
    vid.src = url
  }
    source.initScreen = (index = 0) => desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      console.log('sources', sources)
      if (sources.length > index) {
  //  if (source.name === 'Electron') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[index].id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
        })
        console.log('got stream', stream)
        const video = document.createElement('video')
              video.srcObject = stream
              video.addEventListener('loadedmetadata', () => {
                video.play().then(() => {
                  source.src = video
                  source.tex = source.regl.texture(source.src)
                })
              })
    //    handleStream(stream)
      } catch (e) {
      //  handleError(e)
        console.log(e)
      }
    }
  })
  })
}

function vidFromStream(stream) {
  const vid = document.createElement('video')
  vid.srcObject = stream
  vid.load()
  vid.autoplay = true
  vid.loop = true
  return vid
}
