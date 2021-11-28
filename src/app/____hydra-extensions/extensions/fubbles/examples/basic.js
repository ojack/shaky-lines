shape(4, f0.x(0, 1, 1, true)).rotate(f0.y(0, 10, 1, true)).repeat().out()

shape(4).scale(f0.x(0, 1)).out()

shape(4, f0.x(-1, 1, 1, true), f2.x())
  .rotate(f0.y(0, 2, 1, true))
  .repeat()
  .color(1, f1.x(), -1)
  .hue(f1.x(0, 0.2))
  .out()
