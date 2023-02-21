const flokURL = 'https://flok.clic.cf/s/rarefaccio?layout=hydra&noHydra=1&bgOpacity=0'

const readOnly = false

const iframe = `<iframe src="${flokURL}${readOnly?'&readonly=1':''}" frameborder="0" class="w-100 h-100" style="margin-top:-40px;${readOnly?"pointer-events:none":''}"></iframe>`

window.onload = () => {
document.body.innerHTML = iframe
}
