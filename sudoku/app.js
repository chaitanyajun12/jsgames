var sudokuViewMatrix = [];

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

function getLabel(num) {
    let label = document.createElement('label');
    label.className = 'number';
    label.innerHTML = num;
    return label;
}

function isArrowKey(keyCode) {
    return keyCode == UP || keyCode == DOWN || keyCode == LEFT || keyCode == RIGHT;
}

function onKeyUp(event) {
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
    sudokuBlock.style.width = '47px';
    sudokuBlock.style.height = '47px';
    sudokuBlock.style.border = '3px solid red';
}

function unSelectSudokuBlock(sudokuBlock) {
    sudokuBlock.style.width = '50px';
    sudokuBlock.style.height = '50px';
    sudokuBlock.style.border = '';
}

function getSudokuBlockId(row, col) {
    return 'row-' + row + '-col-' + col;
}

function getSudokuBlock(row, col, num) {
    let sudokuBlock = document.createElement('div');
    sudokuBlock.className = 'sudoku-block';
    sudokuBlock.id = getSudokuBlockId(row, col);
    sudokuBlock.appendChild(getLabel(num));
    return sudokuBlock;
}

function initSudokuBoard() {
    let sudokuBoard = document.getElementById('game');
    for (let i = 0; i < 9; i++) {

        let sudokuRow = getSudokuRow();
        let sudokuRowViews = [];
        
        for (let j = 0; j < 9; j++) {
            let sudokuBlock = getSudokuBlock(i, j, j);

            if (i == 0 && j == 0) {
                sudokuBlock.style.width = '47px';
                sudokuBlock.style.height = '47px';
                sudokuBlock.style.border = '3px solid red';
            }

            sudokuRowViews.push(sudokuBlock);  
            sudokuRow.appendChild(sudokuBlock);
        }

        sudokuBoard.appendChild(sudokuRow);
        sudokuViewMatrix.push(sudokuRowViews);
    }

    window.addEventListener('keyup', onKeyUp);
}