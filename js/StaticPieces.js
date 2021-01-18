class StaticPieces {
  x = 3;
  y = 3;
  elementRender;
  scale;
  canvas;
  context;
  rows;
  min;
  max;
  constructor(_element, _canvas, _scale) {
    this.elementRender = _element;
    this.scale = _scale;
    this.canvas = _canvas;
    this.context = _canvas.getContext("2d");
    this.rows = _canvas.height / _scale;
    this.min = _scale / 10;
    this.max = this.rows - this.min;
  }
  generateCoordinates = () => {
    let x =
      Math.floor(Math.random() * (this.max - this.min) + this.min) * this.scale;
    let y =
      Math.floor(Math.random() * (this.max - this.min) + this.min) * this.scale;

    return { x, y };
  };

  position = () => {
    let fruit = this.generateCoordinates();
    this.x = fruit.x;
    this.y = fruit.y;
    return fruit;
  };

  draw = (position) => {
    this.context.drawImage(
      this.elementRender,
      this.x || position.x,
      this.y || position.y,
      this.scale,
      this.scale
    );
  };
  drawNewPosition = () => {
    this.draw(this.position());
  };
}
