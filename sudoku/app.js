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

function getLabel(row, col) {
    let label = document.createElement('label');
    label.id = getLabelId(row, col);
    label.className = 'number';
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

function getSudokuBlock(row, col) {
    let sudokuBlock = document.createElement('div');
    
    sudokuBlock.className = 'sudoku-block';
    sudokuBlock.id = getSudokuBlockId(row, col);
    sudokuBlock.onclick = onSudokuBlockClick;
    sudokuBlock.appendChild(getLabel(row, col));

    drawBordersBasedOnRowAndCols(sudokuBlock);
    return sudokuBlock;
}

function initSudokuBoard() {
    let sudokuBoard = document.getElementById('game');
    for (let i = 0; i < 9; i++) {

        let sudokuRow = getSudokuRow();
        for (let j = 0; j < 9; j++) {
            let sudokuBlock = getSudokuBlock(i, j);
            sudokuRow.appendChild(sudokuBlock);

            if (i == 0 && j == 0) {
                selectSudokuBlock(sudokuBlock);
            }
        }

        sudokuBoard.appendChild(sudokuRow);
    }

    window.addEventListener('keyup', onKeyUp);
}