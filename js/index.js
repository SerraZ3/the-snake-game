var canvas = document.getElementById("snakeCanvas");
var score = document.getElementById("score");
var startBtn = document.getElementById("startBtn");
var pauseBtn = document.getElementById("pauseBtn");
var resumeBtn = document.getElementById("resumeBtn");
var fruit = document.getElementById("fruit");
var virus = document.getElementById("virus");

new SnakeGame(startBtn, pauseBtn, resumeBtn, virus, fruit, score, canvas);
