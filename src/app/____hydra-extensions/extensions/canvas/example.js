canvas.ctx.clearRect(0, 0, 2000, 2000)

s0.init({src: canvas.canvas})
src(s0).repeat().out()
canvas.update = ({ctx}) => {
  console.log(mouse.x)
  ctx.fillRect(mouse.x, mouse.y, 4, 4)
}
