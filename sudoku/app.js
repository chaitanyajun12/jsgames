const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39

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
    label.id = getLabelId(row, col)
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

function isNumKey(keyCode) {
    return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);
}

function onKeyUp(event) {
    if (isNumKey(event.keyCode)) {
        setLabel(currX, currY, String.fromCharCode(event.keyCode));
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
    sudokuBlock.style.width = '46px';
    sudokuBlock.style.height = '46px';
    sudokuBlock.style.border = '3px solid blue';
}

function unSelectSudokuBlock(sudokuBlock) {
    sudokuBlock.style.width = '50px';
    sudokuBlock.style.height = '50px';
    sudokuBlock.style.border = '';
}

function getSudokuBlockId(row, col) {
    return 'row-' + row + '-col-' + col;
}

function getSudokuBlock(row, col) {
    let sudokuBlock = document.createElement('div');
    sudokuBlock.className = 'sudoku-block';
    sudokuBlock.id = getSudokuBlockId(row, col);
    sudokuBlock.appendChild(getLabel(row, col));
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