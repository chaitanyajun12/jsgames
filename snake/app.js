let crawlSpeed = 1000;
let canvas;	
let context;

let currDir = Directions.RIGHT;
let parts = 1;

let snakeWidth = 100;
let snakeHeight = 10;

let crawlSize = 10;

let snakeStartXCoordinate = 100;
let snakeStartYCoordinate = 300;

let crawlFunc;

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
		// DONE
		newCoords.x = prevPart.getX() - (2* crawlSize);
		newCoords.y = prevPart.getY() - crawlSize;

		prevPart.setX(prevPart.getX() - crawlSize);
		prevPart.setOffset(crawlSize);
		
	} else if (currDirection == Directions.LEFT && newDirection == Directions.UP) {
		newCoords.x = prevPart.getX() - crawlSize;
		newCoords.y = prevPart.getY() - crawlSize * (prevPart.getSize() - 1);
		
	} else if (currDirection == Directions.RIGHT && newDirection == Directions.DOWN) {		
		// DONE
		newCoords.x = prevPart.getX() + crawlSize * (prevPart.getSize() - 1);
		newCoords.y = prevPart.getY() + crawlSize;
		prevPart.setOffset(0);
		
	} else if (currDirection == Directions.LEFT && newDirection == Directions.DOWN) {
		newCoords.x = prevPart.getX() + crawlSize;
		newCoords.y = prevPart.getY() - crawlSize * (prevPart.getSize() - 1);
		prevPart.setOffset(0);
		
	} else if (currDirection == Directions.UP && newDirection == Directions.LEFT) {
		
	} else if (currDirection == Directions.DOWN && newDirection == Directions.LEFT) {
		
	} else if (currDirection == Directions.UP && newDirection == Directions.RIGHT) {
		// STARTED
		newCoords.x = prevPart.getX() + crawlSize;
		newCoords.y = prevPart.getY();
		prevPart.setOffset(0);

	} else if (currDirection == Directions.DOWN && newDirection == Directions.RIGHT) {
		
		prevPart.setOffset(0);
	}
	
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
	
	clearTimeout(crawlFunc);
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
	crawlFunc = setTimeout(crawl, crawlSpeed);	
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
}

function drawParts() {	
	var tRoot = root;
	while (tRoot != null) {

		let height, width;
		if (tRoot.getDirection() == Directions.RIGHT) {
			console.log("draw right size: " + tRoot.getSize());
			height = crawlSize;
			width = crawlSize * tRoot.getSize();

			context.translate(tRoot.getX(), tRoot.getY());			 
			context.scale(-1, 1);

			context.fillRect(0, 0, width, height);
			context.resetTransform();

		} else if (tRoot.getDirection() == Directions.LEFT) {
			height = crawlSize;
			width = crawlSize * tRoot.getSize();

		} else if (tRoot.getDirection() == Directions.UP) {
			console.log("draw up size: " + tRoot.getSize());
			width = crawlSize;
			height = crawlSize * tRoot.getSize();
			context.fillRect(tRoot.getX(), tRoot.getY(), width, height);
			context.resetTransform();

		} else if (tRoot.getDirection() == Directions.DOWN) {
			width = crawlSize;
			height = crawlSize * tRoot.getSize();
		}
		
		// context.fillRect(tRoot.getX(), tRoot.getY(), width, height);
		tRoot = tRoot.getNextPart();
	}

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

	console.log("--------------------");
}

function initSnake() {	
	
	window.addEventListener('keydown', onKeyUp, false);
	
	// context.fillStyle = "yellow";
	// context.fillRect(snakeStartXCoordinate, snakeStartYCoordinate, snakeWidth, snakeHeight);

	let snakeXCoordinate = snakeStartXCoordinate + snakeWidth;
	let snakeYCoordinate = snakeStartYCoordinate;

	// context.fillStyle = "blue";
	// context.fillRect(snakeXCoordinate, snakeYCoordinate, snakeWidth, snakeHeight);

	context.translate(snakeXCoordinate, snakeYCoordinate);

	// context.fillStyle = "red";
	// context.fillRect(0, 0, 10, 10);

	context.scale(-1, 1);
	
	context.fillStyle = "blue";
	context.fillRect(0, 0, snakeWidth, snakeHeight);

	context.resetTransform();

	var part = new Part(10, Directions.RIGHT, null, 0);
	part.setX(snakeXCoordinate);
	part.setY(snakeYCoordinate);
	
	root = part;
	rear = part;	

}

function draw() {
	initSnake();
	setTimeout(crawl, crawlSpeed);
}