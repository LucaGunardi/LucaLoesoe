let cols;
let rows;
let size = 50;
let board = [];
let food;
let head;
let dir;
let length = 1;
let score = 0;
let highScore = 0;
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0; // Initialiseer coins met de waarde uit localStorage

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.position(0, 0);
  canvas.center('horizontal');
  canvas.center('vertical');

  frameRate(5);
  cols = width / size;
  rows = height / size;

  generateGame();
}

function draw() {
  background(220);
  update();
  displayBoard();
  board[food.x][food.y] = -1;

  // Toon de score
  fill(0);
  textSize(20);
  fill(255,255,255);
  text("Score: " + score, 532, 20);
  text("Coins: " + coins, 400, 20);
  
  // Update high score indien nodig
  if (score > highScore) {
    highScore = score;
  }
  
  // Toon de high score
  text("Highscore: " + highScore, 655, 20);

  if (gameOver) {
    fill(0, 255, 0);
    rect(0, 0, width, height);
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(50);
    fill(255, 255, 255);
    text("GAME OVER", width / 2, height / 2);
    text("Score: " + score, width / 2, height / 2 + 60);
    text("Highscore: " + highScore, width / 2, height / 2 + 120);
    text("Coins: " + coins, width / 2, height / 2 - 180);
    textSize(45);
    text("Kleine tip: probeer niet dood te gaan", width / 2, height / 2 - 120);

    // Toon Replay-knop
    fill(255);
    rect(width / 2 - 50, height / 2 + 150, 100, 40);
    fill(0);
    textSize(18);
    text("Replay", width / 2, height / 2 + 170);
  }
}

function update() {
  if (!gameOver) {
    head.add(dir);

    if (dist(head.x, head.y, food.x, food.y) == 0) {
      length += 1;
      generateFood();
      // Verhoog de score en coins wanneer voedsel wordt gegeten
      score += 1;
      coins += 1;
      localStorage.setItem('coins', coins); // Bewaar coins in localStorage
    }

    if (
      head.x < 0 ||
      head.x > cols - 1 ||
      head.y < 0 ||
      head.y > rows - 1 ||
      board[head.x][head.y] > 1
    ) {
      console.log("Game Over");
      gameOver = true;
      dir.set(0, 0);
    } else {
      board[head.x][head.y] = 1 + length;
      removeTail();
    }
  }
}

function displayBoard() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] == 0) {
        fill(0); // Color the board white
      } else if (board[i][j] == -1) {
        fill(255, 0, 0); // Color the food red
      } else {
        fill("#39e75f"); // Color the snake yellow
      }
      rect(i * size, j * size, size, size);
    }
  }
}

function generateFood() {
  while (true) {
    food = createVector(int(random(0, cols - 1)), int(random(0, rows - 1)));
    if (board[food.x][food.y] == 0) {
      break;
    }
  }
}

function removeTail() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] > 0) {
        board[i][j] -= 1;
      }
    }
  }
}

function mousePressed() {
  // Controleer of er op de Replay-knop is geklikt
  if (gameOver && mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 150 && mouseY < height / 2 + 190) {
    generateGame();
    replayClicked = true;
  } else {
    replayClicked = false;
  }
}

function keyPressed() {
  if (!replayClicked) {
    if (keyCode === LEFT_ARROW && dir.x === 0) {
      dir = createVector(-1, 0);
    } else if (keyCode === RIGHT_ARROW && dir.x === 0) {
      dir = createVector(1, 0);
    } else if (keyCode === DOWN_ARROW && dir.y === 0) {
      dir = createVector(0, 1);
    } else if (keyCode === UP_ARROW && dir.y === 0) {
      dir = createVector(0, -1);
    }
  }
}

function generateGame() {
  gameOver = false;
  dir = createVector(0, 0);
  length = 1;
  score = 0;

  // Reset het bord
  for (let i = 0; i < cols; i++) {
    board[i] = [];
    for (let j = 0; j < rows; j++) {
      board[i][j] = 0;
    }
  }

  // Genereer het hoofd en voedsel
  head = createVector(int(cols / 2), int(rows / 2));
  generateFood();
}