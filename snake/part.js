var Part = function(size, direction, nextPart) {
	
	this.size = size
	this.direction = direction
	this.nextPart = nextPart;
	
	// Starting coordinates of part
	var xCoord, yCoord;
		
	function getSize() {
		return this.size;
	}
	
	function setSize(size) {
		this.size = size;
	}
	
	function getNextPart() {
		return this.nextPart;		
	}
	
	function setNextPart(nextPart) {
		this.nextPart = nextPart;
	}
	
	function getDirection() {
		return this.direction;
	}
	
	function getX() {
		return this.xCoord;		
	}
	
	function setX(xCoord) {
		this.xCoord = xCoord;
	}
	
	function getY() {
		return this.yCoord;		
	}
	
	function setY(yCoord) {
		this.yCoord = yCoord;
	}
	
	return {
		size,
		direction,
		nextPart,
		getSize,
		setSize,
		getNextPart,
		setNextPart,
		getDirection,
		getX,
		setX,
		getY,
		setY
	}
};