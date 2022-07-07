const html = require('choo/html')

module.exports = (state, emit) => {
    if(state.flok.enabled === true) {
        return html`<iframe src="${state.flok.url}" frameborder="0" class="w-100 h-100" style="margin-top:-40px;pointer-events:none;display:none"></iframe>`
    } else {
        return ''
    }
}