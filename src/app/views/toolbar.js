const html = require('choo/html')
//const { fabric } = require('fabric')



module.exports = (state, emit) => {

  const deleteItem = () => {
    emit('deleteCurrentItem')
  }

  const toggle = (prop, type="panels") => () => {
    emit('toggle', prop, type)
  }



  const addIcons = [
    { icon: "fas fa-edit", selected: state.renderer.drawingMode, onClick: toggle('drawingMode', 'renderer')},
  //   { icon: "flaticon-square-17 ml0", type: "Rect" },
  //   { icon: "flaticon-circle", type: "Circle" },
  //   { icon: "flaticon-triangle", type: "Triangle" },
  //   { icon: "fas fa-font", onClick:  state.fabric.addText.bind(state.fabric) },
  // //  { icon: "fas fa-desktop", onClick: state.fabric.addScreenshare.bind(state.fabric) },
  //    // { icon: "fas fa-desktop", onClick: state.fabric.electronScreenshare.bind(state.fabric) },
  //   { icon: "fas fa-video", onClick: state.fabric.addWebcam.bind(state.fabric) },
    { icon: "far fa-trash-alt", selected: false, onClick: deleteItem },
    { icon: "fas fa-terminal", selected: state.panels.editor, onClick: toggle('editor') },
    { icon: "fas fa-terminal", selected: state.panels.details, onClick: toggle('details')}
  ]

  const icon = ({ icon, onClick, selected }) => html`<div class="${icon} pointer dim h2 pa2" style=${selected? `background-color:${state.style.color1};color:${state.style.color0}`: ''} onclick=${onClick}></div>`
  return html`<div class="fixed top-0 right-0 w2 flex flex-column b items-center justify-center" style="color:${state.style.color1}">
  <input type="file" name="file" id="file" class="inputfile"
    accept="image/png, image/jpeg" onchange=${(e) => loadFile(e, state.fabric)}
    />
    <label for="file" class="pa2 fas fa-file-image pointer"></label>
    ${addIcons.map((obj) => icon({ icon: obj.icon, selected: obj.selected, onClick: () => {
      //  state.fabric.addScreenshare()
      if(obj.onClick) {
        obj.onClick()
      //  state.fabric.add('Triangle')
      } else {
        state.fabric.add(obj.type, obj.params)
      }
    }}))}

  </div>`
}

function loadFile(e, _fabric) {
  console.log(e)
  var file = e.target.files[0];
  console.log(file)
  if (!file) {
    return;
  }
  var reader = new FileReader();
  var fileURL = URL.createObjectURL(file)
  var image = new Image()
  image.src = fileURL
  image.onload = () => {
    const imageObj = new fabric.Image(image, { scaleX: 0.5, scaleY: 0.5 })
    _fabric.canvas.add(imageObj)
  }
  //document.body.appendChild(image)
  // reader.onload = function(e) {
  //   // var contents = e.target.result;
  //   // displayContents(contents);
  // };
  //reader.readAsText(file)
}



function vidFromStream(stream) {
  const vid = document.createElement('video')
  vid.srcObject = stream
  vid.load()
  vid.autoplay = true
  vid.loop = true
  return vid
}
