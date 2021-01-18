class Snake {
  context;
  scale;
  canvas;
  snakeHead = { x: 0, y: 0 };
  tail = [];
  tail0 = { x: 0, y: 0 };
  totalTail = 0;

  boundaryCollision = false;

  constructor(_context, _canvas, _scale) {
    this.canvas = _canvas;
    this.context = _context;
    this.scale = _scale;
  }
  reset = () => {
    this.tail = [];
    this.totalTail = 0;
    this.snakeHead = { x: 0, y: 0 };
    this.boundaryCollision = false;
  };

  drawSnakeHead = (direction, color) => {
    this.context.beginPath();
    this.context.arc(
      this.snakeHead.x + this.scale / 2,
      this.snakeHead.y + this.scale / 2,
      this.scale / 2,
      0,
      2 * Math.PI
    );
    this.context.fillStyle = color;
    this.context.fill();
    this.context.beginPath();
    if (direction === "Up") {
      this.context.arc(
        this.snakeHead.x + this.scale / 5,
        this.snakeHead.y + this.scale / 5,
        this.scale / 8,
        0,
        2 * Math.PI
      );
      this.context.arc(
        this.snakeHead.x + this.scale - this.scale / 5,
        this.snakeHead.y + this.scale / 5,
        this.scale / 8,
        0,
        2 * Math.PI
      );
    } else if (direction === "Down") {
      this.context.arc(
        this.snakeHead.x + this.scale / 5,
        this.snakeHead.y + this.scale - this.scale / 5,
        this.scale / 8,
        0,
        2 * Math.PI
      );
      this.context.arc(
        this.snakeHead.x + this.scale - this.scale / 5,
        this.snakeHead.y + this.scale - this.scale / 5,
        this.scale / 8,
        0,
        2 * Math.PI
      );
    } else if (direction === "Left") {
      this.context.arc(
        this.snakeHead.x + this.scale / 5,
        this.snakeHead.y + this.scale / 5,
        this.scale / 8,
        0,
        2 * Math.PI
      );
      this.context.arc(
        this.snakeHead.x + this.scale / 5,
        this.snakeHead.y + this.scale - this.scale / 5,
        this.scale / 8,
        0,
        2 * Math.PI
      );
    } else {
      this.context.arc(
        this.snakeHead.x + this.scale - this.scale / 5,
        this.snakeHead.y + this.scale / 5,
        this.scale / 8,
        0,
        2 * Math.PI
      );
      this.context.arc(
        this.snakeHead.x + this.scale - this.scale / 5,
        this.snakeHead.y + this.scale - this.scale / 5,
        this.scale / 8,
        0,
        2 * Math.PI
      );
    }
    this.context.fillStyle = "black";
    this.context.fill();
  };
  drawSnakeTail = () => {
    let tailRadius = this.scale / 4;
    for (let i = 0; i < this.tail.length; i++) {
      tailRadius =
        tailRadius + (this.scale / 2 - this.scale / 4) / this.tail.length;
      this.context.beginPath();
      this.context.fillStyle = "#6c2c3a";
      this.context.arc(
        this.tail[i].x + this.scale / 2,
        this.tail[i].y + this.scale / 2,
        tailRadius,
        0,
        2 * Math.PI
      );
      this.context.fill();
    }
  };

  moveSnakeForward = (moviment) => {
    this.tail0 = this.tail[0];
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    this.tail[this.totalTail - 1] = {
      x: this.snakeHead.x,
      y: this.snakeHead.y,
    };
    this.snakeHead.x += moviment.xSpeed;
    this.snakeHead.y += moviment.ySpeed;
  };

  moveSnakeBack = (moviment) => {
    this.context.clearRect(0, 0, 500, 500);
    for (let i = this.tail.length - 1; i >= 1; i--) {
      this.tail[i] = this.tail[i - 1];
    }
    if (this.tail.length >= 1) {
      this.tail[0] = { x: this.tail0.x, x: this.tail0.y };
    }
    this.snakeHead.x -= moviment.xSpeed;
    this.snakeHead.y -= moviment.ySpeed;
    this.drawSnakeTail();
  };

  drawSnake = (direction) => {
    this.drawSnakeHead(direction, "#7d4350");
    this.drawSnakeTail();
  };

  checkCollision = (canvas, virus) => {
    let tailCollision = false,
      virusCollision = false;
    this.boundaryCollision = false;
    for (let i = 0; i < this.tail.length; i++) {
      if (
        this.snakeHead.x == this.tail[i].x &&
        this.snakeHead.y == this.tail[i].y
      ) {
        tailCollision = true;
      }
    }
    if (
      this.snakeHead.x >= canvas.width ||
      this.snakeHead.x < 0 ||
      this.snakeHead.y >= canvas.height ||
      this.snakeHead.y < 0
    ) {
      this.boundaryCollision = true;
    }
    if (this.snakeHead.x === virus.x && this.snakeHead.y === virus.y) {
      virusCollision = true;
    }
    return tailCollision || this.boundaryCollision || virusCollision;
  };
}
