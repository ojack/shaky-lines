const html = require('choo/html')
const { fabric } = require('fabric')
const Component = require('choo/component')
var loop = require('raf-loop')
// const { desktopCapturer } = require('electron')
const notes = require('./../../performance/code-notes.js')

// const screenshare = require('./get-screen.js')

const expose = (func, context, name) => context[name] = func

const text = require("./base-text.js")
const words = text.split(" ")
const colors = ['red', 'green', 'red', 'white', 'black', 'orange', 'gray', 'blue']

const randomParams = (width, height) => ({
  width: Math.random()*width/2 + 10,
  height: Math.random() * height/3 + 10,
  fill: colors[Math.floor(Math.random() * colors.length)],
  left: Math.random()*width/2,
  top: height - Math.random()*height/1.1,
  fontSize: Math.random() * 100 + 10,
  borderColor: 'rgba(100, 100, 100, 0.5)',
  cornerStrokeColor: 'rgba(100, 100, 100, 0.5)',
  cornerColor: 'rgba(100, 100, 100, 0.5)'
})

const randomWord = () => (words[Math.floor(Math.random() * words.length)])



module.exports = class Fabric extends Component {
  constructor (id, state, emit) {
    super(id)
  //  console.log("DESKTOP CAPTURER", desktopCapturer, systemPreferences)
    this.local = state.components[id] = {}
    this.fabric = fabric
    // hacky way to add this element to state and trigger events
    state.fabric = this
    this.emit = emit

    this.add = this.add.bind(this)

   expose(this.addScreenshare.bind(this), window, "screen")
  // expose(this.electronScreenshare.bind(this), window, "screen")
    expose(this.addWebcam.bind(this), window, "cam")
    expose(this.addText.bind(this), window, "text")
    expose(this.loadVideoFromFile.bind(this), window, "video")
    expose(this.addImage.bind(this), window, "image")
    expose(this.toggleDrawing.bind(this), window, "draw")
    expose(this.repeatLast.bind(this), window, "repeat")
  }

  repeatLast(params = {}) {
    console.log('repeating')
    const objects = this.canvas.getObjects()
    if(objects.length > 0) {
      const last = objects[objects.length - 1]
      last.clone((newObj) => {
        console.log(newObj)
        newObj.set({ top: newObj.top += 50})
        newObj.set(params)
        console.log(' adding new object', newObj)
        this.canvas.add(newObj)
      })

    }
  }

  toggleDrawing() {
    this.canvas.freeDrawingBrush.color = colors[Math.floor(Math.random() * colors.length)]
//    this.canvas.freeDrawingBrush.width = Math.random() * 100 + 1
    this.canvas.freeDrawingBrush.width = 1
    this.canvas.freeDrawingBrush.strokeLineCap = 'square'
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode
  }

  load (element) {
    console.log('loading')
    this.canvas = new fabric.Canvas(this._canvas)

    window.fc = this.canvas
    window.fabricCanvas = this._canvas

    let isDragging = false
    const self = this

    self.canvas.on('selection:updated', (e) => {
    //  console.log('select', e)
      self.emit('select', e)
    })
    self.canvas.on('selection:created', (e) => {
    //  console.log('selection creates', e)
      self.emit('select', e)
    })

    self.canvas.on('selection:cleared', (e) => {
      console.log('selection cleared', e)
      self.emit('select', {target:null})
    })

    const objEvents = ['object:moving', 'object:scaling', 'object:rotating', 'object:skewing']
    objEvents.forEach((_e) => {
      self.canvas.on(_e, (e) => {  self.emit('render')})
    })

    fabric.util.requestAnimFrame(function render() {
  //    console.log('rendering')
  const objects = self.canvas.getObjects()
  objects.forEach((obj) => {
  //  console.log(obj, obj.update)
    if(obj.update) {
      obj.update()
      obj.setCoords()
    }
  })
  self.canvas.renderAll();
  fabric.util.requestAnimFrame(render);
});
  notes.startup()
  }

  // @todo: randomize initial parameters
  add(type, _params = {}) {
    const params = Object.assign({}, randomParams(this.canvas.width, this.canvas.height), _params)
    console.log('adding', params)
  //  var el = new fabric[type](params)
    let el
    if(type === 'Textbox') {
      el = new fabric[type]('hellooooo', params)
      this.canvas.add(el)
      //.setActiveObject(el)
    } else {
       el = new fabric[type](params)
       this.canvas.add(el)
    }
    el.on('selection:created', (e) => {
      console.log('select el', e)
    })
    return el
  //  this.canvas.add(el)
    console.log('called add')
  }

  addText(text = randomWord(), _params = {}) {
    if(text.length === 0) text = randomWord()
    console.log('text', text)
    const params = Object.assign({},
      randomParams(this.canvas.width, this.canvas.height)
    , _params)
    const el = new fabric.Textbox(text, params)
    this.canvas.add(el)
    return el
  }

  loadVideoFromFile(file, params) {
    const vid = document.createElement('video')
    vid.src = file
    vid.load()
    vid.autoplay = true
    vid.loop = true
  //  vid.volume = 0
  window.vid = vid
    return this.addVideo(vid, params)
  }

  addImage(file, _params = {}) {
    var image = new Image()
    image.src = file
    const params = Object.assign({},
      randomParams(this.canvas.width, this.canvas.height),
      { scaleX: 0.15, scaleY: 0.15, width: null, height: null },
      _params
    )
    image.onload = () => {
      const imageObj = new fabric.Image(image, params)
      this.canvas.add(imageObj)
      return imageObj
    }
  }

  // @todo check whether metadata already loaded
  addVideo(vidEl, _params = {}) {
    vidEl.addEventListener('loadedmetadata', () => {
      vidEl.width = vidEl.videoWidth
      vidEl.height = vidEl.videoHeight
      const params = Object.assign({},
        randomParams(this.canvas.width, this.canvas.height),
        { width: vidEl.width, height: vidEl.height, originX: 'center', originY: 'center', objectCaching: false, scaleX: 0.25, scaleY: 0.25},
        _params
      )
      const vid = new fabric.Image(vidEl, params)
      this.canvas.add(vid)
      return vid
    })
  }

  update () {
    // if (center.join() !== this.local.center.join()) {
    //   this.map.setCenter(center)
    // }
    console.log('updating')
    return false
  }

  async electronScreenshare(index = 0) {
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
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
      //  console.log(streamm, this)
        const vid = vidFromStream(stream)
        this.addVideo(vid)
    //    handleStream(stream)
      } catch (e) {
      //  handleError(e)
        console.log(e)
      }
    }
  })
  }

  async addScreenshare () {
      let stream = null
      try {
        stream = await navigator.mediaDevices.getDisplayMedia(
          { video: { width: 800, height: 600}}
        )
      const vid = vidFromStream(stream)
      this.addVideo(vid)

      } catch (err) {
        console.log(err)
      }
      return stream
    }



  addWebcam () {
    console.log(this)
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
  .then((stream) => {
    /* use the stream */
    const vid = vidFromStream(stream)
    this.addVideo(vid)
  })
  .catch((err) => {
    console.log(err)
    /* handle the error */
  });
  }

  createElement ({
    width = window.innerWidth,
    height = window.innerHeight
  } = {}) {
  //  this.local.center = center
  this._canvas = html`<canvas
    style="width:100%;height:100%;" width=${width} height=${height}
    ></canvas>`
  //  this._canvas = el
    return html`<div class="w-100 h-100">${this._canvas}</div>`
  }
}

function vidFromStream(stream) {
  const vid = document.createElement('video')
  vid.srcObject = stream
  vid.load()
  vid.autoplay = true
  vid.loop = true
  return vid
}
