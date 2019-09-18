/**
 * Snake traversal logic
 * @author Krishna Chaitanya M
 */

// Variables used for snake traversal
let canvas;	
let context;
let parts = 1;
let crawlFunc;
let root, rear;
let isGamePaused = false;

// Variables which can be used as settings
let crawlSpeed = 100;
let currDir = Directions.RIGHT;

let snakeLength = 200;
let snakeWidth = 20;

let crawlSize = snakeWidth;

let snakeStartXCoordinate = 0;
let snakeStartYCoordinate = 0;

let foodXCoordinate;
let foodYCoordinate;

let canvasWidth = 1250;
let canvasHeight = 550;

function onLoad() {
	canvas = document.getElementById("canvas");	
	context = canvas.getContext("2d");

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
	context.fillRect(foodXCoordinate, foodYCoordinate, crawlSize, crawlSize);

	context.fillStyle = "blue";
}

function crawl() {
	updateFirstPartSize();
	updateLastPartSize();

	reDraw();

	crawlFunc = setTimeout(crawl, crawlSpeed);
}

function reDraw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	printPath();
	drawParts();
	drawFood();
}

function initSnake() {	
	
	window.addEventListener('keydown', onKeyUp, false);	
	context.fillStyle = "blue";

	let partSize = snakeLength / crawlSize;

	var part = new Part(partSize, currDir, null, 0);
	part.setX(snakeStartXCoordinate);
	part.setY(snakeStartYCoordinate);
	
	foodXCoordinate = Math.floor(Math.random() * (canvasWidth + 1));
	foodYCoordinate = Math.floor(Math.random() * (canvasHeight + 1));

	root = part;
	rear = part;
}

function draw() {
	initSnake();
	setTimeout(crawl, crawlSpeed);
}