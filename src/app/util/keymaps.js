module.exports = (state, emitter) => {
    window.onkeydown = (e) => {
    //  console.log(e)
      if ( e.ctrlKey === true ) {
        //console.log(e)
        if(e.code == "Digit1") {
          emitter.emit('loadCode', 0)
        } else if (e.code == "Digit2"){
          emitter.emit('loadCode', 1)
        } else if (e.code == "Digit3"){
          emitter.emit('loadCode', 2)
        } else if (e.code == "Digit4"){
          emitter.emit('loadCode', 3)
        } else if (e.code == "Digit5"){
          emitter.emit('loadCode', 4)
        }
      //  if ( e.shiftKey === true ) {
      }
    }
}

// console.log(e)
// // shift - ctrl - enter: evalAll
// if ( e.keyCode === 13) {
//   e.preventDefault()
//   emitter.emit('code:evalAll')
//   // menu.runAll()
// }
//
// // shift - ctrl - G: share sketch
// if (e.keyCode === 71) {
//   e.preventDefault()
//   emitter.emit('gallery:shareSketch')
//   // menu.shareSketch()
// }
//
// // shift - ctrl - F: format code
// if (e.keyCode === 70) {
//   e.preventDefault()
//   emitter.emit('code:formatCode')
//   //menu.formatCode()
// }
//
// // shift - ctrl - l: save to url
// if(e.keyCode === 76) {
//   e.preventDefault()
//   //gallery.saveLocally(editor.getValue())
//   emitter.emit('gallery:saveLocally')
// }
//
// // shift - ctrl - h: toggle editor
// if (e.keyCode === 72) {
//   e.preventDefault()
//   // editor.toggle()
//   // log.toggle()
//   emitter.emit('ui:hideAll')
// }
//
// // shift - ctrl - s: screencap
// if (e.keyCode === 83) {
//   e.preventDefault()
//   screencap()
// }
// } else {
// // ctrl-enter: evalLine
// if ( e.keyCode === 13) {
//   e.preventDefault()
// //  console.log('eval line')
//   //repl.eval(editor.getLine())
//   emitter.emit('code:evalLine')
// }
// }
// // ctrl - /: toggle comment
// if (e.keyCode === 191) {
// e.preventDefault()
// emitter.emit('code:toggleComment')
// //  editor.cm.toggleComment()
// }
//
// // Point Mutation Glitcher Key Commands and history commands (left and right arrows)
// // right arrow key
// if(e.keyCode === 39) {
// e.preventDefault()
// // if(e.shiftKey === true) {
// //   editor.mutator.mutate({reroll: false})
// // } else {
//   window.history.forward()
// //  }
// }
// // left arrow
// if(e.keyCode === 37) {
// e.preventDefault()
// // if(e.shiftKey === true) {
// //   console.log('redoing')
// //   editor.mutator.doUndo()
// // } else {
//   window.history.back()
// //  }
// //  editor.mutator.doUndo()
// }
// // up arrow
// if(e.keyCode === 38) {
// e.preventDefault()
// editor.mutator.doRedo()
// }
// // down arrow
// if(e.keyCode === 40)  {
// editor.mutator.mutate({reroll: true})
// //  gallery.saveLocally(editor.getValue())
// emitter.emit('gallery:saveLocally')
// }
// }
//
//
//
// if (e.altKey === true) {
// // alt - enter: evalBlock
// if ( e.keyCode === 13) {
//   e.preventDefault()
//   emitter.emit('code:evalBlock')
// //repl.eval(editor.getCurrentBlock().text)
// }
// }
