/**
 * Snake traversal logic
 * @author Krishna Chaitanya M
 */

// Variables used for snake traversal
let canvas;	
let context;
let scoreArea;
let parts = 1;
let crawlFunc;
let root, rear;
let foodRadius;
let isGamePaused = false;
let stepsInCanavsWidth, stepsInCanavsHeight;
let score;

// Variables which can be used as settings
let crawlSpeed = 100;
let currDir = Directions.RIGHT;

let snakeLength = 200;
let snakeWidth = 20;

let crawlSize = snakeWidth;

let snakeStartXCoordinate = snakeWidth;
let snakeStartYCoordinate = snakeWidth;

let foodXCoordinate;
let foodYCoordinate;

let canvasWidth;
let canvasHeight;

function onLoad() {
	canvas = document.getElementById("canvas");	
	context = canvas.getContext("2d");
	scoreArea = document.getElementById("infoarea");

	canvas.width = document.body.clientWidth - (document.body.clientWidth % snakeWidth);
	canvas.height = document.body.clientHeight - (document.body.clientHeight % snakeWidth) - snakeWidth;
	scoreArea.height = (document.body.clientHeight % snakeWidth) - snakeWidth;

	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	stepsInCanavsWidth = canvasWidth / crawlSize;
	stepsInCanavsHeight = canvasHeight / crawlSize;

	draw();
}

function getNewPartCoordinates(newDirection, prevPart) {
	
	let currDirection = prevPart.getDirection();
	let newCoords = {};
	
	if (currDirection == Directions.RIGHT && newDirection == Directions.UP) {
		newCoords.x = prevPart.getX() - (2* crawlSize);
		newCoords.y = prevPart.getY() - crawlSize;

		prevPart.setX(prevPart.getX() - crawlSize);
		
	} else if (currDirection == Directions.LEFT && newDirection == Directions.UP) {

		newCoords.x = prevPart.getX();
		newCoords.y = prevPart.getY() - crawlSize;
		
	} else if (currDirection == Directions.RIGHT && newDirection == Directions.DOWN) {		

		newCoords.x = prevPart.getX() - (2* crawlSize);
		newCoords.y = prevPart.getY() + (2 * crawlSize);

		prevPart.setX(prevPart.getX() - crawlSize);
		
	} else if (currDirection == Directions.LEFT && newDirection == Directions.DOWN) {

		newCoords.x = prevPart.getX();
		newCoords.y = prevPart.getY() + (2 * crawlSize);
		
	} else if (currDirection == Directions.UP && newDirection == Directions.LEFT) {

		newCoords.x = prevPart.getX() - crawlSize;
		newCoords.y = prevPart.getY();

	} else if (currDirection == Directions.DOWN && newDirection == Directions.LEFT) {

		newCoords.x = prevPart.getX() - crawlSize;
		newCoords.y = prevPart.getY() - crawlSize;
		
	} else if (currDirection == Directions.UP && newDirection == Directions.RIGHT) {
		newCoords.x = prevPart.getX() + (2 * crawlSize);
		newCoords.y = prevPart.getY();
		prevPart.setOffset(crawlSize);

	} else if (currDirection == Directions.DOWN && newDirection == Directions.RIGHT) {

		newCoords.x = prevPart.getX() + (2 * crawlSize);
		newCoords.y = prevPart.getY() - crawlSize;
	}
	
	prevPart.setOffset(crawlSize);

	return newCoords;
}

function updateLastPartSize() {

	var tRoot = rear;		
	if (tRoot.getNextPart() == null) {		
		tRoot.setSize(tRoot.getSize() + 1);
		rear = tRoot;
	}	

	if (parts > 1) {
		let newCoords = computeXY(rear.getDirection(), rear.getX(), rear.getY(), rear.getOffset());
		rear.setX(newCoords.x);
		rear.setY(newCoords.y);
	}
}

function updateFirstPartSize() {

	var tRoot = root;
	var newSize = tRoot.getSize() - 1;
	if (newSize == 0) {
		root = tRoot.getNextPart();
		tRoot = null;
		parts -= 1;
		
		if (parts > 1) {
			root.setOffset(crawlSize);
		}

	} else {
		tRoot.setSize(newSize);
		root = tRoot;
	}
	
	let newCoords = computeXY(root.getDirection(), root.getX(), root.getY(), root.getOffset());
	root.setX(newCoords.x);
	root.setY(newCoords.y);
}

function computeXY(direction, x, y, offset)
{
	let newCoords = {};
	switch(direction)
	{
		case Directions.RIGHT:
			newCoords.x = x + crawlSize - offset;
			newCoords.y = y;
			break;			
		case Directions.UP:
			newCoords.x = x;
			newCoords.y = y - crawlSize + offset;
			break;
		case Directions.DOWN:
			newCoords.x = x;
			newCoords.y = y + crawlSize - offset;
			break;
		case Directions.LEFT:
			newCoords.x = x - crawlSize + offset;
			newCoords.y = y;
			break;
	}
	
	return newCoords;
}

function createNewPart(direction) {
	
	console.log("--" + direction + "--");
	currDir = direction;
	
	var newPart = new Part(1, direction, null, 0);
	rear.setNextPart(newPart);
		
	parts += 1;
	
	updateFirstPartSize();
	
	let newCoords = getNewPartCoordinates(direction, rear);
	newPart.setX(newCoords.x);
	newPart.setY(newCoords.y);
	
	rear = newPart;
	
	reDraw();
}

function onKeyUp(event) {
	if (event.keyCode == KeyCodes.SPACE) {
		if (isGamePaused) {
			crawlFunc = setTimeout(crawl, crawlSpeed);
			isGamePaused = false;
		} else {
			clearTimeout(crawlFunc);
			isGamePaused = true;
		}
	}
	
	if (isGamePaused)
		return;

	if (currDir == Directions.RIGHT || currDir == Directions.LEFT) {
		if (event.keyCode == KeyCodes.UP) {
			createNewPart(Directions.UP);

		} else if (event.keyCode == KeyCodes.DOWN) {
			createNewPart(Directions.DOWN);
		}

	} else if (currDir == Directions.UP || currDir == Directions.DOWN) {
		if (event.keyCode == KeyCodes.LEFT) {
			createNewPart(Directions.LEFT);

		} else if (event.keyCode == KeyCodes.RIGHT) {
			createNewPart(Directions.RIGHT);
		}
	}
}

function printPath() {
	var tRoot = root;
	while(tRoot != null) {	
		console.log("size:" + tRoot.getSize() + ", dir: " + tRoot.getDirection() + ", x: " + tRoot.getX() + ", y: " + tRoot.getY());
		tRoot = tRoot.getNextPart();
	}
	console.log("----------------------");
}

function drawParts() {
	context.fillStyle = "blue";

	var tRoot = root;
	while (tRoot != null) {

		let height, width;
		if (tRoot.getDirection() == Directions.RIGHT) {

			height = snakeWidth;
			width = crawlSize * tRoot.getSize();

			// This transformation is to reflect from right to left
			context.translate(tRoot.getX(), tRoot.getY());			 
			context.scale(-1, 1);

			context.fillRect(0, 0, width, height);

		} else if (tRoot.getDirection() == Directions.LEFT) {

			height = snakeWidth;
			width = crawlSize * tRoot.getSize();
			context.fillRect(tRoot.getX(), tRoot.getY(), width, height);

		} else if (tRoot.getDirection() == Directions.UP) {

			width = snakeWidth;
			height = crawlSize * tRoot.getSize();
			context.fillRect(tRoot.getX(), tRoot.getY(), width, height);

		} else if (tRoot.getDirection() == Directions.DOWN) {

			width = snakeWidth;
			height = crawlSize * tRoot.getSize();

			// This transformation is to reflect from down to up
			context.translate(tRoot.getX(), tRoot.getY());			 
			context.scale(1, -1);

			context.fillRect(0, 0, width, height);
		}
		
		context.resetTransform();
		tRoot = tRoot.getNextPart();
	}
}

function drawFood() {
	context.fillStyle = "red";
	context.fillRect(foodXCoordinate, foodYCoordinate, snakeWidth, snakeWidth);
}

function crawl() {
	updateFirstPartSize();
	updateLastPartSize();

	reDraw();

	crawlFunc = setTimeout(crawl, crawlSpeed);
}

function isSnakeEatingFood() {
	if (currDir == Directions.RIGHT) {
		if (rear.getX() >= foodXCoordinate && rear.getX() <= foodXCoordinate + snakeWidth && foodYCoordinate == rear.getY()) {
			return true;
		}
	} else if (currDir == Directions.UP) {
		if (foodXCoordinate == rear.getX() && rear.getY() >= foodYCoordinate && rear.getY() <= foodYCoordinate + snakeWidth) {
			return true;
		}
	} else if (currDir == Directions.LEFT) {
		if (rear.getX() >= foodXCoordinate && rear.getX() <= foodXCoordinate + snakeWidth && foodYCoordinate == rear.getY()) {
			return true;
		}
	} else if (currDir == Directions.DOWN) {
		if (rear.getX() == foodXCoordinate && rear.getY() >= foodYCoordinate && rear.getY() <= foodYCoordinate + snakeWidth) {
			return true;
		}
	}

	return false;
}

function createNewPartOnBoundaryCrossing(direction, x, y) {
	currDir = direction;

	var newPart = new Part(1, direction, null, 0);
	rear.setNextPart(newPart);
		
	parts += 1;
	
	updateFirstPartSize();

	newPart.setX(x);
	newPart.setY(y);
	
	rear = newPart;
}

function processOnBoundaryCrossing() {

	if (rear.getX() >= canvasWidth) {
		createNewPartOnBoundaryCrossing(currDir, snakeWidth, rear.getY());

	} else if (rear.getX() <= 0) {
		createNewPartOnBoundaryCrossing(currDir, canvasWidth - snakeWidth, rear.getY());
	}

	if (rear.getY() >= canvasHeight) {
		createNewPartOnBoundaryCrossing(currDir, rear.getX(), snakeWidth);

	} else if (rear.getY() <= 0) {
		createNewPartOnBoundaryCrossing(currDir, rear.getX(), canvasHeight - snakeWidth);
	}
}

function updateScore() {
	score += 1;
	scoreArea.textContent = "Score: " + score;
}

function reDraw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	printPath();
	drawParts();
	drawFood();

	if (isSnakeEatingFood()) {
		updateScore();
		root.setSize(root.getSize() + 1);
		generateFoodCoordinates();
	}

	processOnBoundaryCrossing();
}

function resizeCanvas() {
	clearTimeout(crawlFunc);
	onLoad();
}

function generateFoodCoordinates() {
	foodXCoordinate = Math.floor(Math.random() * (stepsInCanavsWidth - 1)) * crawlSize;
	foodYCoordinate = Math.floor(Math.random() * (stepsInCanavsHeight - 1)) * crawlSize;
}

function initSnake() {	
	
	window.addEventListener('resize', resizeCanvas, false);
	window.addEventListener('keydown', onKeyUp, false);
	context.fillStyle = "blue";

	let partSize = snakeLength / crawlSize;
	foodRadius = snakeWidth / 2;

	var part = new Part(partSize, currDir, null, 0);
	part.setX(snakeStartXCoordinate);
	part.setY(snakeStartYCoordinate);

	generateFoodCoordinates();

	root = part;
	rear = part;

	score = 0;
}

function draw() {
	initSnake();
	crawlFunc = setTimeout(crawl, crawlSpeed);
}