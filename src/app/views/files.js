const html = require('choo/html')
const Component = require('choo/component')
// import { directoryOpen, supported } from 'browser-fs-access'

import { directoryOpen, fileOpen, supported } from './../util/browser-fs-access'

// import { showDirectoryPicker, showOpenFilePicker } from 'native-file-system-adapter'


// const getFiles = async () => {

// }


module.exports = class LocalFiles extends Component {
  constructor (id, state, emit) {
    super(id)
  //  console.log("DESKTOP CAPTURER", desktopCapturer, systemPreferences)
    this.local = state.components[id] = {}
   
    this.emit = emit
   
    this.state = state
   this.supported = true
  //  this.files = []
    this.images = []
    this.videos = []
  //  this.supported = supported
    // this.agents = []
    // window.agents = this.agents
    //  console.log('supported', supported)
    //  if (supported) {
    //   console.log('Using the File System Access API.');
    // } else {
    //   console.log('Using the fallback implementation.');
    // }
    // (async () => {
     


    
    //   // const blobsInDirectory = await directoryOpen({
    //   //   recursive: true,
    //   // });
    //   // console.log(blobsInDirectory)
    // })()
  }



  load (element) {
    
  }

  

  update () {
    // console.log('updating')
    return false
  }

  
  // https://web.dev/file-system-access/
  async openFiles() {
    // to do later -- implement aving to directory
    // const dirHandle = await window.showDirectoryPicker();
    // for await (const entry of dirHandle.values()) {
    //   console.log(entry.kind, entry.name);
    // }
      // Open multiple files.
  const blobs = await fileOpen({
    mimeTypes: ['image/*', 'video/*'],
    multiple: true,
  });
  // this.files = blobs
  this.images = blobs.map((blob) => {
    console.log(blob)
    let el
    if(blob.type.includes("video")){
      el = document.createElement('video')
      el.src = URL.createObjectURL(blob)
      el.style.objectFit = 'cover'
      el.autoplay = true
      el.muted = true
      el.loop = true
    } else {
    el = document.createElement('img')
    el.src = URL.createObjectURL(blob)
    // img.style.width = '80px'
    // img.style.height = '80px'
    el.style.objectFit = 'cover'
    }

   el.style.width = '80px'
    // img.style.height = '80px'
    // img.onload = img.onerror = () => URL.revokeObjectURL(img.src)
    return {
      blob: blob,
      el: el
    }
  })
  this.rerender()
    // function readDirectory(directory) {
    //   let dirReader = directory.createReader();
    //   let entries = [];
    
    //   let getEntries = function() {
    //     dirReader.readEntries(function(results) {
    //       if (results.length) {
    //         entries = entries.concat(toArray(results));
    //         getEntries();
    //       }
    //     }, function(error) {
    //       /* handle error -- error is a FileError object */
    //     });
    //   };
    
    //   getEntries();
    //   return entries;
    // }
    // console.log('click!!')
    // var FileSystemDirectoryHandle = window.showDirectoryPicker();

    // console.log('dir', FileSystemDirectoryHandle)

    // const entries = readDirectory(FileSystemDirectoryHandle)
    // console.log(entries)
    // const dirHandle = await showDirectoryPicker()
    // console.log(dirHandle)
      // Open a file.
      // const blob = await fileOpen({
      //   mimeTypes: ['image/*'],
      // });
    // const directories = await directoryOpen({ recursive: true})
    // console.log('directories', directories)
  }


  createElement (state) {
    console.log(this, this.files)
    return html`<div>
      <div class="pointer dim" onclick=${this.openFiles.bind(this)}>load files</div>
      <div class="flex flex-wrap">
      ${this.images.map((file) => html`<div class="" style="width:80px" onclick=${() => this.emit('renderer:load image', file.el)}>
      ${file.blob.name}${file.el}</div>`)}
      </div>
     </div>`
  }
}

