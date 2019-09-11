let crawlSpeed = 1000;
let canvas;	
let context;

let currDir = Directions.RIGHT;
let parts = 1;

let snakeWidth = 100;
let snakeHeight = 10;

let crawlSize = 5;
let partSize = 10;

let snakeXCoordinate = 100;
let snakeYCoordinate = 300;

let root, rear;

function onLoad() {
	canvas = document.getElementById("canvas");	
	context = canvas.getContext("2d");

	draw();
}

function getNewPartCoordinates(newDirection, prevPart) {
	
	let currDirection = prevPart.getDirection();
	let newCoords = {};
	
	if (currDirection == Directions.RIGHT && newDirection == Directions.UP) {
		newCoords.x = prevPart.getX() + crawlSize * (prevPart.getSize() - 1);
		newCoords.y = prevPart.getY() - crawlSize;
		
	} else if (currDirection == Directions.LEFT && newDirection == Directions.UP) {
		newCoords.x = prevPart.getX() - crawlSize;
		newCoords.y = prevPart.getY() - crawlSize * (prevPart.getSize() - 1);
		
	} else if (currDirection == Directions.RIGHT && newDirection == Directions.DOWN) {
		newCoords.x = prevPart.getX() + crawlSize;
		newCoords.y = prevPart.getY() + crawlSize * (prevPart.getSize() - 1);
		
	} else if (currDirection == Directions.LEFT && newDirection == Directions.DOWN) {
		newCoords.x = prevPart.getX() + crawlSize;
		newCoords.y = prevPart.getY() - crawlSize * (prevPart.getSize() - 1);
		
	} else if (currDirection == Directions.UP && newDirection == Directions.LEFT) {
		
	} else if (currDirection == Directions.DOWN && newDirection == Directions.LEFT) {
		
	} else if (currDirection == Directions.UP && newDirection == Directions.RIGHT) {
		
	} else if (currDirection == Directions.DOWN && newDirection == Directions.RIGHT) {
		
	}
	
	return newCoords;
}


function updateLastPartSize() {

	var tRoot = rear;		
	if (tRoot.getNextPart() == null) {		
		tRoot.setSize(tRoot.getSize() + 1);
		rear = tRoot;
	}
	
}

function updateFirstPartSize() {	

	var tRoot = root;
	var newSize = tRoot.getSize() - 1;
	if (newSize == 0) {
		root = tRoot.getNextPart();
		tRoot = null;
		parts -= 1;
	} else {
		tRoot.setSize(newSize);
		root = tRoot;
	}
	
	let newCoords = computeXY(root.getDirection(), root.getX(), root.getY());
	root.setX(newCoords.x);
	root.setY(newCoords.y);
}

function computeXY(direction, x, y)
{
	let newCoords = {};
	switch(direction)
	{
		case Directions.RIGHT:
			newCoords.x = x + crawlSize;
			newCoords.y = y;
			break;			
		case Directions.UP:
			newCoords.x = x;
			newCoords.y = y - crawlSize;
			break;
		case Directions.DOWN:
			newCoords.x = x;
			newCoords.y = y + crawlSize;
			break;
		case Directions.LEFT:
			newCoords.x = x - crawlSize;
			newCoords.y = y;
			break;
	}
	
	return newCoords;
}

function createNewPart(direction) {
	
	currDir = direction;
	
	var newPart = new Part(1, direction, null);
	rear.setNextPart(newPart);
		
	parts += 1;
	
	updateFirstPartSize();
	
	let newCoords = getNewPartCoordinates(direction, rear);
	newPart.setX(newCoords.x);
	newPart.setY(newCoords.y);
	
	rear = newPart;
	
	printPath();
}


function onKeyUp(event) {

	if (currDir == Directions.RIGHT || currDir == Directions.LEFT) {
		if (event.keyCode == KeyCodes.UP) {
			console.log("--UP--");
			createNewPart(Directions.UP);

		} else if (event.keyCode == KeyCodes.DOWN) {
			console.log("--DOWN--");
			createNewPart(Directions.DOWN);
		}

	} else if (currDir == Directions.UP || currDir == Directions.DOWN) {
		if (event.keyCode == KeyCodes.LEFT) {
			console.log("--LEFT--");
			createNewPart(Directions.LEFT);

		} else if (event.keyCode == KeyCodes.RIGHT) {
			console.log("--RIGHT--");
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
	
	console.log("--------------------");
}

function drawParts() {	
	var tRoot = root;
	while (tRoot != null) {

		let height, width;
		if (tRoot.getDirection() == Directions.RIGHT) {
			height = 10;
			width = partSize * tRoot.getSize();
		} else if (tRoot.getDirection() == Directions.LEFT) {
			height = 10;
			width = partSize * tRoot.getSize();

		} else if (tRoot.getDirection() == Directions.UP) {
			width = 10;
			height = partSize * tRoot.getSize();
		} else if (tRoot.getDirection() == Directions.DOWN) {
			width = 10;
			height = partSize * tRoot.getSize();
		}
		
		context.fillRect(tRoot.getX(), tRoot.getY(), width, height);
		tRoot = tRoot.getNextPart();
	}

}

function crawl() {
	context.clearRect(0, 0, canvas.width, canvas.height);
		
	updateFirstPartSize();
	updateLastPartSize();

	printPath();
	drawParts();

	setTimeout(crawl, crawlSpeed);
}

function initSnake() {	
	
	window.addEventListener('keydown', onKeyUp, false);
	
	context.fillStyle = "blue";
	context.fillRect(snakeXCoordinate, snakeYCoordinate, snakeWidth, snakeHeight);
	
	var part = new Part(10, Directions.RIGHT, null);
	part.setX(snakeXCoordinate);
	part.setY(snakeYCoordinate);
	
	root = part;
	rear = part;	
}

function draw() {
	initSnake();
	setTimeout(crawl, crawlSpeed);
}