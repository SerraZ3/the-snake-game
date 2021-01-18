class SnakeGame {
  elementHTML = {
    start: null,
    pause: null,
    resume: null,
  };
  canvas;
  context;
  play = false;
  gameStarted = false;

  scale = 20;
  intervalDuration = 150;
  minDuration = 75;
  gameInterval;
  virusInterval;

  moviment = {
    direction: "Right",
    speed: 1,
    xSpeed: 0,
    ySpeed: 0,
    previousDir: "Right",
  };

  virus;
  fruit;
  snake;

  constructor(
    _startHTML,
    _pauseHTML,
    _resumeHTML,
    _virusHTML,
    _fruitHTML,
    _scoreHTML,
    _canvas
  ) {
    this.elementHTML = {
      start: _startHTML,
      pause: _pauseHTML,
      resume: _resumeHTML,
      score: _scoreHTML,
    };
    this.canvas = _canvas;
    this.context = _canvas.getContext("2d");

    this.virus = new StaticPieces(_virusHTML, this.canvas, this.scale);
    this.fruit = new StaticPieces(_fruitHTML, this.canvas, this.scale);
    this.snake = new Snake(this.context, this.canvas, this.scale);

    _startHTML.addEventListener("click", this.start);
    _pauseHTML.addEventListener("click", this.pause);
    _resumeHTML.addEventListener("click", this.resume);
    window.addEventListener("keydown", this.pressedKey);
    console.log(this);
  }
  start = () => {
    this.reset();
    this.gameStarted = true;
    this.playing = true;
    this.fruit.drawNewPosition();
    this.virus.drawNewPosition();
    this.run();
  };

  pause = () => {
    if (this.gameStarted) {
      clearInterval(this.gameInterval);
      clearInterval(this.virusInterval);
      this.elementHTML.pause.style.backgroundColor = "#ccc";
      this.elementHTML.resume.style.backgroundColor = "#fff";
      this.playing = false;
    }
  };

  resume = () => {
    if (this.gameStarted) {
      this.run();
      this.elementHTML.pause.style.backgroundColor = "#fff";
      this.elementHTML.resume.style.backgroundColor = "#ccc";
      this.playing = true;
    }
  };

  pressedKey = (event) => {
    if (event.keyCode === 32) {
      if (this.gameStarted) {
        if (this.playing) {
          this.pause();
        } else {
          this.resume();
        }
      } else {
        this.start();
      }
    } else {
      this.changeDirection(event.key.replace("Arrow", ""));
    }
  };

  run = () => {
    this.virusInterval = window.setInterval(this.virus.position, 10000);
    this.gameInterval = window.setInterval(() => {
      this.context.clearRect(0, 0, 500, 500);
      this.checkSamePosition();
      this.virus.draw();
      this.fruit.draw();

      this.snake.moveSnakeForward(this.moviment);
      this.snake.drawSnake(this.moviment.direction);

      if (this.snake.checkCollision(this.canvas, this.virus)) {
        this.handleCollision();
      }
      if (
        this.snake.snakeHead.x === this.fruit.x &&
        this.snake.snakeHead.y === this.fruit.y
      ) {
        this.snake.totalTail++;
        if (
          this.snake.totalTail % 20 === 0 &&
          this.intervalDuration > this.minDuration
        ) {
          clearInterval(this.gameInterval);
          clearInterval(this.virusInterval);
          this.intervalDuration = this.intervalDuration - 10;
          this.run();
        }
        this.fruit.drawNewPosition();
      }
      this.elementHTML.score.innerText = this.snake.totalTail;
    }, this.intervalDuration);
  };
  reset = () => {
    clearInterval(this.gameInterval);
    clearInterval(this.virusInterval);
    this.intervalDuration = 150;
    this.minDuration = 75;

    this.snake.reset();

    this.moviment.direction = "Right";
    this.moviment.previousDir = "Right";
    this.moviment.xSpeed = this.scale * this.moviment.speed;
    this.moviment.ySpeed = 0;

    this.elementHTML.pause.style.backgroundColor = "#fff";
    this.elementHTML.resume.style.backgroundColor = "#fff";
    this.playing = false;
    this.gameStarted = false;
  };
  checkSamePosition = () => {
    if (this.fruit.x == this.virus.x && this.fruit.y == this.virus.y) {
      this.virus.position();
    }
    for (let i = 0; i < this.snake.tail.length; i++) {
      if (
        this.virus.x === this.snake.tail[i].x &&
        this.virus.y === this.snake.tail[i].y
      ) {
        this.virus.position();
        break;
      }
    }
    for (let i = 0; i < this.snake.tail.length; i++) {
      if (
        this.fruit.x === this.snake.tail[i].x &&
        this.fruit.y === this.snake.tail[i].y
      ) {
        this.fruit.position();
        break;
      }
    }
  };

  changeDirection = (direc) => {
    this.moviment.previousDir = this.moviment.direction;
    switch (direc) {
      case "Up":
        if (this.moviment.previousDir !== "Down") {
          this.moviment.direction = direc;
          this.moviment.xSpeed = 0;
          this.moviment.ySpeed = this.scale * -this.moviment.speed;
        }
        break;

      case "Down":
        if (this.moviment.previousDir !== "Up") {
          this.moviment.direction = direc;
          this.moviment.xSpeed = 0;
          this.moviment.ySpeed = this.scale * this.moviment.speed;
        }
        break;

      case "Left":
        if (this.moviment.previousDir !== "Right") {
          this.moviment.direction = direc;
          this.moviment.xSpeed = this.scale * -this.moviment.speed;
          this.moviment.ySpeed = 0;
        }
        break;

      case "Right":
        if (this.moviment.previousDir !== "Left") {
          this.moviment.direction = direc;
          this.moviment.xSpeed = this.scale * this.moviment.speed;
          this.moviment.ySpeed = 0;
        }
        break;
    }
  };
  handleCollision = () => {
    clearInterval(this.gameInterval);
    clearInterval(this.virusInterval);
    if (this.snake.boundaryCollision) {
      this.snake.moveSnakeBack(this.moviment);
      this.virus.drawNewPosition();
      this.fruit.drawNewPosition();
    }
    this.snake.drawSnakeHead(this.moviment.direction, "red");

    setTimeout(() => {
      document.getElementById("scoreModal").innerText = this.snake.totalTail;
      $("#alertModal").modal("show");
      $("#alertModal").on("shown.bs.modal", function () {
        window.removeEventListener("keydown", this.pressedKey);
      });
      let _this = this;
      $("#alertModal").on("hidden.bs.modal", function () {
        _this.context.clearRect(0, 0, 500, 500);
        _this.elementHTML.score.innerText = 0;
        window.addEventListener("keydown", this.pressedKey);
        _this.reset();
      });
    }, 1000);
  };
}
