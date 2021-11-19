const html = require('choo/html')


module.exports = (content, { name, label, showPanel = true } = {}, {color0, color1} = {}, emit) => {
    const columnLayout = true
    const type = 'panels'
    // open chat even if menu is collapsed
    const hidden = showPanel
        ? 'max-height:1000px;'
        : 'max-height:0px;overflow:hidden;border:none;'
    const panel = html`
        <div class="${showPanel
            ? 'w-100 '
            : 'pv0'} panel ba flex flex-column ${columnLayout} ||
        !showPanel
        ? 'ma0'
        : 'ma0 shadow-2'}"
         style="border:1px solid ${color1};pointer-events:all;flex:${columnLayout}
        ? flex
        : '0'};${hidden};">
          <div class="flex justify-between pa1">
            <div class="ttu"> ${label}  </div>
            <i
                  class="fas fa-times self-end dim pointer pa1"
                  style="color:${color1},
                  title="close ${label}"
                  aria-hidden="true"
                  onclick=${() => {
            emit('toggle', name, type)
        }} >
            </i>
          </div>
          <div class="pa0 pt0">
            ${content}
          </div>
        </div>
      `
    // listen for panel resize events in order to calculate panel margin
    // onload(panel, () => {
    //   const resizeObserver = new ResizeObserver(entries => {
    //     for (let entry of entries) {
    //       emit('render')
    //     }
    //   })
    //   resizeObserver.observe(panel)
    // })
    return panel
}