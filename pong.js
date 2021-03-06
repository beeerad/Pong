var canvasDimension; 
var gameCanvas;
var ballCoordX = 50;
var ballCoordY = 50;
var ballVelocityX = -10;
var ballVelocityY = 4;
var paddle1Y = 250;
var paddle2Y = 250;
var player1Score = 0;
var player2Score = 0;
var player1Round = false;
var player2Round = false;
const WINNING_SCORE = 5;
const PADDLE_HEIGHT = 100;

var showWinScreen = false;
//Loads the game
window.onload = function() {
	console.log("Pong loaded!");
	gameCanvas = document.getElementById('pong');
	canvasDimension = gameCanvas.getContext('2d');

	var framesPerSecond = 30;

	setInterval(function(){
		moveElements();
		drawBoard();
	}, 1000 / framesPerSecond);

	gameCanvas.addEventListener('mousedown', handleMouseClick);

	gameCanvas.addEventListener('mousemove', 
		function(event) {
		var mousePos = getMousePos(event);
		//This will make the paddle center on the user's mouse
		paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
	});

	ballReset();
}

//Helper function for making paddles and game canvas
function makeRect(leftX, topY, width, height, scolor){
	canvasDimension.fillStyle = scolor;
	canvasDimension.fillRect(leftX, topY, width, height);
}

//Helper function for making the game ball(s)
function makeCircle(xCoord, yCoord, radius, color){
	canvasDimension.fillStyle = color;
	canvasDimension.beginPath();
	canvasDimension.arc(ballCoordX, ballCoordY, 10, 0, Math.PI * 2, true);
	canvasDimension.fill();
}

//Draws the board
function drawBoard(){
	//Canvas for the game
	makeRect(0, 0, gameCanvas.width, gameCanvas.height, 'black');
	if (showWinScreen){
		canvasDimension.fillStyle = 'white';
		canvasDimension.fillText("Click to continue", 350, 500);
		if (player1Score >= WINNING_SCORE){
			canvasDimension.fillText("Player 1 wins!", 350, 200);
		}
		else {
			canvasDimension.fillText("Player 2 wins!", 350, 200);
		}
		return;
	}
	//Makes 2 white paddles of 10x100 pixels
	makeRect(0, paddle1Y, 10, PADDLE_HEIGHT, 'white');
	makeRect(gameCanvas.width - 10, paddle2Y, 10, PADDLE_HEIGHT, 'white');
	//Draws the net
	for (let i = 0; i < gameCanvas.height; i += 40){
		makeRect(gameCanvas.width/2-1, i, 2, 20, 'white');
	}
	//Makes the ball
	makeCircle(ballCoordX, ballCoordY, 10, 'white');

	//Makes scoreboard
	canvasDimension.fillText(player1Score, 100, 100);
	canvasDimension.fillText(player2Score, gameCanvas.width - 100, 100);

}

//Updates the elements of the board
function moveElements(){
	if (showWinScreen){
		return;
	}
	ballCoordY += ballVelocityY;
	ballCoordX += ballVelocityX;
	aiMove();
	//When the ball goes off the L/R sides of screen
	if(ballCoordX < 0) {
		if(ballCoordY > paddle1Y &&
			ballCoordY < paddle1Y+PADDLE_HEIGHT) {
			ballVelocityX *= -1;
			var deltaY = ballCoordY - (paddle1Y + PADDLE_HEIGHT / 2);
			ballVelocityY = deltaY * 0.35;
		} 
		else {
			++player2Score;
			player2Round = true;
			if (player2Score === WINNING_SCORE){
				showWinScreen = true;
			}	
			ballReset();
		}
	}
	if(ballCoordX > gameCanvas.width) {
		if(ballCoordY > paddle2Y &&
			ballCoordY < paddle2Y+PADDLE_HEIGHT) {
			ballVelocityX *= -1;
			var deltaY = ballCoordY - (paddle2Y + PADDLE_HEIGHT / 2);
			ballVelocityY = deltaY * 0.35;
		} else {
			++player1Score;
			player1Round = true;
			if (player1Score === WINNING_SCORE){
				showWinScreen = true;
			}
			ballReset();	
		}
	}
	//When the ball goes off the bottom side of the screen
	if (ballCoordY >= gameCanvas.height){
		ballVelocityY *= -1;
	}
	//When the ball goes off the top side of the screen
	if (ballCoordY <= 0){
		ballVelocityY *= -1;
	}
}

function getMousePos(event){
	var rect = gameCanvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseXPos = event.clientX - rect.left - root.scrollLeft;
	var mouseYPos = event.clientY - rect.top - root.scrollTop;
	return {
		x: mouseXPos,
		y: mouseYPos
	};
}

function handleMouseClick(event){
	if(showWinScreen){
		player1Score = 0;
		player2Score = 0;
		showWinScreen = false;
	}
}

function ballReset(){
	if (player1Round){
		ballVelocityX = 10;
		ballVelocityY = -2;
		player1Round = false;
	}
	else {
		ballVelocityX = -10;
		ballVelocityY = -2;
		player2Round = false;
	}
	ballCoordX = gameCanvas.width / 2;
	ballCoordY = gameCanvas.height / 2;
}

function aiMove(){
	if ((paddle2Y + (PADDLE_HEIGHT/2)) < (ballCoordY + 10)){
		paddle2Y += 6;
	}
	else if (paddle2Y > (ballCoordY + 10)){
		paddle2Y -= 6;
	}
}
