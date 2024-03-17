let cols;
let rows;
let size = 50;
let board = [];
let food;
let head;
let dir;
let length = 1;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
let shopClicked = false;
let replayClicked = false;
let colors = ['darkred', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];
let prices = [5, 10, 20, 25, 30, 35, 40];
let selectedColor = 'green'; 
let boughtColors = localStorage.getItem('boughtColors') ? JSON.parse(localStorage.getItem('boughtColors')) : [0, 0, 0, 1, 0, 0, 0]; 

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
  if (shopClicked) {
    background(0);
    fill(255);
    textAlign(CENTER, BOTTOM);
    textSize(20);
    text("Replay", width / 2, height / 2 + 170);

    
    for (let i = 0; i < colors.length; i++) {
      fill(colors[i]);
      rect(width / 2 - 150 + i * 50, height / 2 - 20, 40, 40);
    }

  
    textAlign(CENTER, CENTER);
    textSize(100);
    fill(255);
    text("Shop", width / 2, height / 2 -200);
    textSize(30);
    text("Koop een kleur voor Sander!", width / 2, height / 2 -100);
    text("Aantal coins: " + coins , width / 2, height / 2 -50);
    textSize(20);
    text("Druk nog een keer op de kleur na aankoop om hem te gebruiken.", width / 2, height / 2 + 50);
  } else {
    background(220);
    update();
    displayBoard();
    board[food.x][food.y] = -1;

    fill(0);
    textSize(20);
    fill(255, 255, 255);
    text("Score: " + score, 532, 20);
    text("Coins: " + coins, 400, 20);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }

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

      fill(255);
      rect(width / 2 - 50, height / 2 + 150, 100, 40);
      fill(0);
      textSize(18);
      text("Replay", width / 2, height / 2 + 170);

      fill(255);
      rect(width / 2 - 50, height / 2 + 200, 100, 40);
      fill(0);
      textSize(18);
      text("Shop", width / 2, height / 2 + 220);
    } 
  }
}

function update() {
  if (!gameOver) {
    head.add(dir);

    if (dist(head.x, head.y, food.x, food.y) == 0) {
      length += 1;
      generateFood();
      score += 1;
      coins += 1;
      localStorage.setItem('coins', coins);
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
        fill(0); 
      } else if (board[i][j] == -1) {
        fill(255, 0, 0); 
      } else {
        fill(selectedColor); 
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
  if (shopClicked) {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 150 && mouseY < height / 2 + 190) {
      generateGame();
      shopClicked = false;
    } else {
      for (let i = 0; i < colors.length; i++) {
        if (mouseX > width / 2 - 150 + i * 50 && mouseX < width / 2 - 110 + i * 50 && mouseY > height / 2 - 20 && mouseY < height / 2 + 20) {
          let price = prices[i];
          if (coins >= price && boughtColors[i] === 0) {
            let confirmation = confirm("Wil je " + colors[i] + " kopen voor " + price + " coins?");
            if (confirmation) {
              coins -= price;
              localStorage.setItem('coins', coins);
              boughtColors[i] = 1;
              selectedColor = colors[i];
              localStorage.setItem('boughtColors', JSON.stringify(boughtColors)); 
            }
          } else if (boughtColors[i] === 1) {
            let confirmation = confirm("Wil je " + colors[i] + " gebruiken?");
            if (confirmation) {
              selectedColor = colors[i];
            }
          } else {
            alert("Je hebt niet genoeg coins om deze kleur te kopen! De kleur " + colors[i] + " kost " + prices[i] + " coins.");
          }
          break;
        }
      }
    }
  } else if (gameOver) {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 150 && mouseY < height / 2 + 190) {
      generateGame();
      replayClicked = true;
    } else if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 200 && mouseY < height / 2 + 240) {
      shopClicked = true;
    }
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

  
  highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
  coins = localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0;
  
  boughtColors = localStorage.getItem('boughtColors') ? JSON.parse(localStorage.getItem('boughtColors')) : boughtColors;

  for (let i = 0; i < cols; i++) {
    board[i] = [];
    for (let j = 0; j < rows; j++) {
      board[i][j] = 0;
    }
  }

  head = createVector(int(cols / 2), int(rows / 2));
  generateFood();
}
