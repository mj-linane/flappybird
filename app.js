
//board
let board;
let boardWidth = 350;
let boardHeight = 640;
let context;

//bird 
let birdWidth = 32; //width/height ratio = 408/228 = 17/12
let birdHeight = 64;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}
//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = ⅛
let pipeHeight = 512;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw bird
    context.fillStyle = "transparent";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdImg = new Image();
    birdImg.src = "./bird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 secs
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, boardWidth, board.birdHeight);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y, limit bird to screen or smt
    // context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, 500, 0, pipe.width, pipe.height);
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 bcs there are 2 pipes so .5*2  = 1, 1 for each pipe
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipesArray.shift(); //removes first element from the array
    }
    //score
    context.fillstyle = "white";
    context.font = "45px sans - serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillStyle = "white";
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    console.log("placing pipes")
    if (gameOver) {
        return;
    }
    //(0-1) * pipeHeight/2
    // 0 -> -126 (placeHeight/4)
    // 1 -> -128 - 256 (placeHeight/4 - placeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        Img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}
function moveBird(e) {
    if (e.code = "Space" || e.code == "ArrowUp" || "keyX") {
        //jump
        velocityY = -6;


    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}