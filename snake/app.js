let v1Left = 10;
let hOffSet = 2;
let crawlSpeed = 10;
let canvas;	
let context;

const Directions = {
	RIGHT: 1,
	LEFT: 2,
	UP: 3,
	DOWN: 4
};

const KeyCodes = {	
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
}

let currDir = Directions.RIGHT;
let snakeWidth = 100;
let snakeHeight = 10;

let snakeMultiPartSize = 10;

let snakePath = ["10,1"];

function onLoad() {
	canvas = document.getElementById("canvas");	
	context = canvas.getContext("2d");
	 
	window.addEventListener('resize', resizeCanvas, false);
	
	draw();
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	draw();
}

function onKeyUp(event) {

	if (currDir == Directions.RIGHT || currDir == Directions.LEFT) {
		if (event.keyCode == KeyCodes.UP) {
			console.log("--UP--");
			snakePath.push("1,3");
			

		} else if (event.keyCode == KeyCodes.DOWN) {
			console.log("--DOWN--");

		}

	} else if (currDir == Directions.UP || currDir == Directions.DOWN) {
		if (event.keyCode == KeyCodes.LEFT) {
			console.log("--LEFT--");

		} else if (event.keyCode == KeyCodes.RIGHT) {
			console.log("--RIGHT--");

		}

	}
}

function crawl() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	v1Left = v1Left + hOffSet;
	
	context.fillRect(v1Left, 240, snakeWidth, snakeHeight);
	setTimeout(crawl, crawlSpeed);
}

function initSnake() {	
	
	console.log("Height: " + canvas.height);
	console.log("Width: " + canvas.width);
	
	window.addEventListener('keydown', onKeyUp, false);
	
	context.fillStyle = "blue";
	context.fillRect(v1Left, 240, snakeWidth, snakeHeight);

	context.fillRect(300, 310, 10, 10);
}

function draw() {
	initSnake();
	setTimeout(crawl, crawlSpeed);
}