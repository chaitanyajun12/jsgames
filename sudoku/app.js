const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;
const BACKSPACE = 8;
const DELETE = 46;

var sudokuMatrix = [];
var currX = 0, currY = 0;

function onLoad() {
    initSudokuBoard();
}

function getSudokuRow() {
    let sudokuRow = document.createElement('div');
    sudokuRow.className = 'sudoku-row';
    return sudokuRow;
}

function getLabelId(row, col) {
    return 'label-row-' + row + '-col-' + col;
}

function getLabel(row, col, num) {
    let label = document.createElement('label');
    label.id = getLabelId(row, col);
    label.className = 'number';
    label.innerHTML = num;
    return label;
}

function setLabel(row, col, num) {
    let label = document.getElementById(getLabelId(row, col));
    label.innerHTML = num;
}

function isArrowKey(keyCode) {
    return keyCode == UP || keyCode == DOWN || keyCode == LEFT || keyCode == RIGHT;
}

function isSudokuNumKey(keyCode) {
    return (keyCode > 48 && keyCode <= 57) || (keyCode > 96 && keyCode <= 105);
}

function isBackspaceOrDelete(keyCode) {
    return keyCode == BACKSPACE || keyCode == DELETE;
}

function onKeyUp(event) {
    if (isSudokuNumKey(event.keyCode)) {
        setLabel(currX, currY, String.fromCharCode(event.keyCode));
        return;
    }

    if (isBackspaceOrDelete(event.keyCode)) {
        setLabel(currX, currY, '');
        return;
    }

    if (!isArrowKey(event.keyCode))
        return;

    let sudokuBlock = document.getElementById(getSudokuBlockId(currX, currY));
    unSelectSudokuBlock(sudokuBlock);

    if (event.keyCode == UP) {
        currX = currX - 1;
    } else if (event.keyCode == DOWN) {
        currX = currX + 1;
    } else if (event.keyCode == LEFT) {
        currY = currY - 1;
    } else if (event.keyCode == RIGHT) {
        currY = currY + 1;
    }

    currX = currX < 0 ? 8 : currX;
    currY = currY < 0 ? 8 : currY; 

    currX = currX % 9;
    currY = currY % 9;

    sudokuBlock = document.getElementById(getSudokuBlockId(currX, currY));
    selectSudokuBlock(sudokuBlock);
}

function selectSudokuBlock(sudokuBlock) {
    sudokuBlock.style.backgroundColor = 'lightgrey';
}

function drawBordersBasedOnRowAndCols(sudokuBlock) {

    let id = sudokuBlock.id;
    let rowCol = getRowColFromSudokuBlockId(id);
    
    let row = rowCol.row;
    let col = rowCol.col;
    let gridBorder = '1.5px solid';
    
    if (col == 2 || col == 5) {
        sudokuBlock.style.borderRight = gridBorder;
    }

    if (row == 2 || row == 5) {
        sudokuBlock.style.borderBottom = gridBorder;
    }

    if (row == 3 || row == 6) {
        sudokuBlock.style.borderTop = gridBorder;
    }

    if (col == 3 || col == 6) {
        sudokuBlock.style.borderLeft = gridBorder;
    }
}

function unSelectSudokuBlock(sudokuBlock) {
    sudokuBlock.style.backgroundColor = 'aliceblue';
    drawBordersBasedOnRowAndCols(sudokuBlock);
}

function getRowColFromSudokuBlockId(id) {
    let tokens = id.split('-');
    return {
        row: tokens[1],
        col: tokens[3]
    };
}

function getSudokuBlockId(row, col) {
    return 'row-' + row + '-col-' + col;
}

function onSudokuBlockClick(event) {
    let id = event.target.id;
    if (id.indexOf('label') >= 0) {
        id = event.target.parentElement.id;
    }

    let rowCol = getRowColFromSudokuBlockId(id);
    if (currX == rowCol.row && currY == rowCol.col)
        return;

    unSelectSudokuBlock(document.getElementById(getSudokuBlockId(currX, currY)));
    selectSudokuBlock(document.getElementById(id));

    currX = rowCol.row;
    currY = rowCol.col;
}

function getSudokuBlock(row, col, num) {
    let sudokuBlock = document.createElement('div');
    
    sudokuBlock.className = 'sudoku-block';
    sudokuBlock.id = getSudokuBlockId(row, col);
    sudokuBlock.onclick = onSudokuBlockClick;
    sudokuBlock.appendChild(getLabel(row, col, num));

    drawBordersBasedOnRowAndCols(sudokuBlock);
    return sudokuBlock;
}

function initSudokuMatrix() {
    for (let i = 0; i < 9; i++) {
        sudokuMatrix[i] = [] 
        for (let j = 0; j < 9; j++) {
            sudokuMatrix[i][j] = 0;
        }
    }
}

function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getDifficultyRange(gameDifficulty) {
    if (gameDifficulty == 'easy') {
        return { minRange: 3, maxRange: 8, minNum: 3 };
    } else if (gameDifficulty == 'medium') {
        return { minRange: 2, maxRange: 5, minNum: 2};
    } else if (gameDifficulty == 'hard') {
        return { minRange: 1, maxRange: 3, minNum: 0};
    }
}

// Easy - 3 to 8 filled
// Medium - 2 to 5 filled
// Hard - 1 to 3 filled
function generateSudokuMatrix(gameDifficulty) {
    initSudokuMatrix();

    let range = getDifficultyRange(gameDifficulty);

    let rows = [];
    let cols = [];
    let grids = [];

    for (let i = 0; i < 9; i++) {
        rows[i] = [];
        cols[i] = [];
        grids[i] = [];
    }

    let indices = [
        {row: [0, 2], col: [0, 2]},
        {row: [0, 2], col: [3, 5]},
        {row: [0, 2], col: [6, 8]},
        {row: [3, 5], col: [0, 2]},
        {row: [3, 5], col: [3, 5]},
        {row: [3, 5], col: [6, 8]},
        {row: [6, 8], col: [0, 2]},
        {row: [6, 8], col: [3, 5]},
        {row: [6, 8], col: [6, 8]},
    ];

    for (let i = 0; i < 9; i++) {

        let noOfItemsInGrid = getRandomNumberInRange(range.minRange, range.maxRange + 1);
        let j = 0;
        while (j < noOfItemsInGrid) {
            let num = getRandomNumberInRange(1, 9);

            let range = indices[i];
            let row = getRandomNumberInRange(range.row[0], range.row[1] + 1);
            let col = getRandomNumberInRange(range.col[0], range.col[1] + 1);
            
            if (isValidPlacement(rows, cols, grids, row, col, i, num)) {
                rows[row].push(num);
                cols[col].push(num);
                grids[i].push(num);
                sudokuMatrix[row][col] = num;                
            }

            j += 1;
        }
    }
}

function isValidPlacement(rows, cols, grids, row, col, gridNum, num) {
    if (rows[row] && rows[row].indexOf(num) >= 0) return false;
    if (cols[col] && cols[col].indexOf(num) >= 0) return false;
    if (grids[gridNum] && grids[gridNum].indexOf(num) >= 0) return false;
    return true;
}

function initSudokuBoard() {
    let sudokuBoard = document.getElementById('game');
    generateSudokuMatrix('easy');

    for (let i = 0; i < 9; i++) {

        let sudokuRow = getSudokuRow();
        for (let j = 0; j < 9; j++) {
        
            let data = sudokuMatrix[i][j] == 0 ? '' : sudokuMatrix[i][j];
            let sudokuBlock = getSudokuBlock(i, j, data);
            sudokuRow.appendChild(sudokuBlock);

            if (i == 0 && j == 0) {
                selectSudokuBlock(sudokuBlock);
            }
        }

        sudokuBoard.appendChild(sudokuRow);
    }

    window.addEventListener('keyup', onKeyUp);
}