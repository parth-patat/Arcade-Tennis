var canvas;
var canvasDraw;
var ballX = 50;
var ballSpeedX = 15;
var ballY = 50;
var ballSpeedY = 7;
var paddle_Left_Ycoordinates = 315;
var paddle_Right_Ycoordinates = 315;
const PADDLE_HEIGHT = 125;
const PADDLE_THICKNESS = 10;
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var showWinScreen = false;
var popSound = new Audio('Assets/pop.mp3');

function mousePosition(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function handleMouseClick(evt) {
    if (showWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showWinScreen = false;
    }
}

window.onload = function () {
    // getting the gameCanvas that we declared earlier into the variable "canvas"
    canvas = document.getElementById("gameCanvas");
    // declaring a 2d canvas onto the screen and putting it into the varible "canvasDraw"
    canvasDraw = canvas.getContext("2d");

    var fps = 30;
    setInterval(callMoveDraw, 1000 / fps); // putting interval of 1000/30 seconds

    canvas.addEventListener('mousedown', handleMouseClick); //for click funtion in win screen

    canvas.addEventListener("mousemove",
        function (evt) {
            var mousePos = mousePosition(evt);
            paddle_Left_Ycoordinates = mousePos.y - PADDLE_HEIGHT / 2;
        }
    ); // for moving left paddle according to the mouse movement
}

function callMoveDraw() {
    moveEverything();
    drawEverything();
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showWinScreen = true;   
    }
    ballSpeedX = - ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;    
}

function moveRightPaddle() {
    paddleRightCenter = paddle_Right_Ycoordinates + (PADDLE_HEIGHT/2);
    if (ballY + 50 < paddleRightCenter) {
        paddle_Right_Ycoordinates = paddle_Right_Ycoordinates - 18;
    }
    else if (ballY - 50 > paddleRightCenter) {
        paddle_Right_Ycoordinates = paddle_Right_Ycoordinates + 18;
    }
}

function moveEverything() {  
    
    if (showWinScreen) {
        return;
    }
    
    moveRightPaddle();
    
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    if (ballX <= 0) {
        if (ballY > paddle_Left_Ycoordinates && ballY < paddle_Left_Ycoordinates + PADDLE_HEIGHT) {
            popSound.play();
            ballSpeedX = - ballSpeedX;
            var deltaY = ballY - (paddle_Left_Ycoordinates + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.3;
        }
        else {
            player2Score = player2Score + 1; //must be before ballreset();
            ballReset();
        }
    }
    if (ballX >= canvas.width) {
        if (ballY > paddle_Right_Ycoordinates && ballY < paddle_Right_Ycoordinates + PADDLE_HEIGHT) {
            popSound.play();
            ballSpeedX = - ballSpeedX;
            var deltaY = ballY - (paddle_Right_Ycoordinates + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.3;
        }
        else {
            player1Score = player1Score + 1;
            ballReset();
        }      
    }

    if (ballY <= 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function helpDrawRect(xCord, yCord, width, height, rectColor) {
    // fillstyle for the color
    // fillRect for the coordinates and size
    canvasDraw.fillStyle = rectColor;
    canvasDraw.fillRect(xCord, yCord, width, height);
}

function helpDrawCircle(centerX, centerY, radius, circleColor) {
    canvasDraw.fillStyle = circleColor;
    canvasDraw.beginPath();
    canvasDraw.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasDraw.fill();
}

function helpWrite(text, textXcord, textYcord, textColor) {
    canvasDraw.fillStyle = textColor;
    canvasDraw.fillText(text, textXcord, textYcord);
}

function helpDrawNet() {
    for(var i=0; i<canvas.height; i=i+30) {
        helpDrawRect((canvas.width/2)-1, i, 2, 15, 'white');
    }
}

function drawEverything() {
    helpDrawRect(0, 0, canvas.width, canvas.height, "black");
    
    if (showWinScreen) {
        helpDrawRect((canvas.width/3)-50, canvas.height/3, 10, 200, 'red'); //left side
        helpDrawRect((canvas.width/3)-50, canvas.height/3, 550, 10, 'red'); //top side
        helpDrawRect((canvas.width/3)-50, (canvas.height/3)+200, 550, 10, 'red'); //bottom side
        helpDrawRect((canvas.width/3)-50+550, canvas.height/3, 10, 210, 'red'); //right side
    
        canvasDraw.font = '20px Arial';
        if (player1Score >= WINNING_SCORE) {
            helpWrite("Player 1 Won !!", canvas.width/2 - 65, canvas.height/2 - 30, "white");     
        }
        else if (player2Score >= WINNING_SCORE) {
            helpWrite("Computer Won !!", canvas.width/2 - 65, canvas.height/2 - 30, "white");     
        }
        canvasDraw.font = '30px Arial';
        helpWrite("Click here to Continue", canvas.width/3 + 90, canvas.height/2 + 20, "white");
        return;
    }
    
    helpDrawNet();
    
    helpDrawCircle(ballX, ballY, 10, "white");
    
    helpDrawRect(0, paddle_Left_Ycoordinates, PADDLE_THICKNESS, PADDLE_HEIGHT, "red");
    helpDrawRect(canvas.width - PADDLE_THICKNESS, paddle_Right_Ycoordinates, PADDLE_THICKNESS, PADDLE_HEIGHT, "blue");

    helpWrite(player1Score, (canvas.width/4), (canvas.height/4), "white");
    helpWrite(player2Score, canvas.width-(canvas.width/4), (canvas.height/4), "white");
}

var musicButton = document.getElementById("canvas-button-music");
// var menuButton = document.getElementById("playButton");
var backgroundScore = document.getElementById("background-score");

// menuButton.addEventListener("click", function(){
//     backgroundScore.play();
// });

musicButton.addEventListener("click", function(){
    backgroundScore.loop = true;
    if(backgroundScore.paused) {
        backgroundScore.play();
        musicButton.innerHTML = "Music Off";
    } else {
        backgroundScore.pause();
        musicButton.innerHTML = "Music On";
    }
});