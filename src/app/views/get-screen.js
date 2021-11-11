const { desktopCapturer } = require('electron')


module.exports = async function (index) {
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
      console.log(stream)
      return stream
      // const vid = vidFromStream(stream)
      // this.addVideo(vid)
  //    handleStream(stream)
    } catch (e) {
    //  handleError(e)
      console.log(e)
      return null
    }
  }
})
}
