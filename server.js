// Game Constants & Variables
let direction = { x: 0, y: 0 };
let inputDir = { x: 0, y: 0 };
let speed = 3;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

let foodSound = new Audio('music/food.mp3');
let gameOverSound = new Audio('music/gameover.mp3');
let moveSound = new Audio('music/move.mp3');
let musicSound = new Audio('music/music.mp3');

// DOM References
const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const hiscoreBox = document.getElementById("hiscoreBox");

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // Collide with self
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    // Collide with wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    // 1. Update the snake & check for collisions
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        speed = 3;
        musicSound.play();
    }

    // 2. If food eaten
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > hiscore) {
            hiscore = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscore));
            hiscoreBox.innerHTML = "High Score: " + hiscore;
        }
        scoreBox.innerHTML = "Score: " + score;

        // Add new segment to snake
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });

        // Increase speed slightly
        speed += 0.5;

        // Re-generate food
        let a = 2, b = 16;
        food = {
            x: Math.floor(a + Math.random() * (b - a)),
            y: Math.floor(a + Math.random() * (b - a))
        };
    }

    // 3. Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // 4. Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add("head");
        } else {
            snakeElement.classList.add("snake");
        }
        board.appendChild(snakeElement);
    });

    // 5. Display the food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

// High Score Handling
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscore = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscore));
} else {
    hiscore = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "High Score: " + hiscore;
}

// Start the game loop
window.requestAnimationFrame(main);

// Input Listener
window.addEventListener("keydown", e => {
    inputDir = { x: 0, y: 1 }; // Start game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
