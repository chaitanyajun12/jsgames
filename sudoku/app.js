const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;
const BACKSPACE = 8;
const DELETE = 46;

const Easy = 'easy';
const Medium = 'medium';
const Hard = 'hard';

var sudokuMatrix = [];
var currX = 0, currY = 0;
var errorSudokuBlocks = [];

function initSudokoGame() {
    initOptions();
    initSudokuBoard(Easy);
}

function getSudokuRow() {
    let sudokuRow = document.createElement('div');
    sudokuRow.className = 'sudoku-row';
    return sudokuRow;
}

function getLabelId(row, col, isInput) {
    let input = isInput ? '-input' : '';
    return 'label-row-' + row + '-col-' + col + input;
}

function getLabel(row, col, num) {
    let label = document.createElement('label');
    let isInput = num != 0;
    label.id = getLabelId(row, col, isInput);
    label.className = 'number';
    label.innerHTML = num;
    return label;
}

function resetErrorSudokoBlocks(row, col) {
    for (let i = 0; i < errorSudokuBlocks.length; i++) {
        let block = document.getElementById(getSudokuBlockId(errorSudokuBlocks[i].row, errorSudokuBlocks[i].col));
        if (errorSudokuBlocks[i].row == row && errorSudokuBlocks[i].col == col) {
            selectSudokuBlock(block);
            continue;
        }

        unSelectSudokuBlock(block);
    }

    errorSudokuBlocks = [];
}

function setLabel(row, col, num) {
    let label = document.getElementById(getLabelId(row, col, false));
    label.className = 'user-input';
    label.innerHTML = num;

    sudokuMatrix[row][col] = {
        input: false,
        num: parseInt(num)
    };

    resetErrorSudokoBlocks(row, col);
    errorSudokuBlocks = Sudoku.getErrorSudokuBlocks(sudokuMatrix, currX, currY);
    if (errorSudokuBlocks && errorSudokuBlocks.length > 0) {
        for (let i = 0; i < errorSudokuBlocks.length; i++) {
            let id = getSudokuBlockId(errorSudokuBlocks[i].row, errorSudokuBlocks[i].col);
            let block = document.getElementById(id);
            block.style.backgroundColor = 'pink';
        }
        label.className = 'error-input';
    } else {
        label.className = 'user-input';
    }

    Sudoku.isValidSudokuMatrix(sudokuMatrix);
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

function setSudokuBlockValue(row, col, data, isInput) {
    if (isInput)
        return;

    setLabel(row, col, data, isInput);
}

function onKeyUp(event) {
    let sudokuBlock = document.getElementById(getSudokuBlockId(currX, currY));
    let label = sudokuBlock.firstElementChild.id;
    let isInput = label.indexOf('input') >= 0;

    if (isSudokuNumKey(event.keyCode)) {
        setSudokuBlockValue(currX, currY, String.fromCharCode(event.keyCode), isInput);
        return;
    }

    if (isBackspaceOrDelete(event.keyCode)) {
        setSudokuBlockValue(currX, currY, '', isInput);
        return;
    }

    if (!isArrowKey(event.keyCode))
        return;

    if (!isSudokuErrorBlock(sudokuBlock)) {
        unSelectSudokuBlock(sudokuBlock);
    }

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
    sudokuBlock.style.backgroundColor = '#87CEFA';
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

function isSudokuErrorBlock(sudokuBlock) {
    let rowcol = getRowColFromSudokuBlockId(sudokuBlock.id);
    for (let i = 0; i < errorSudokuBlocks.length; i++) {
        if (rowcol.row == errorSudokuBlocks[i].row && rowcol.col == errorSudokuBlocks[i].col) {
            return true;
        }
    }
    return false;
}

function unSelectSudokuBlock(sudokuBlock) {
    sudokuBlock.style.backgroundColor = 'aliceblue';
    drawBordersBasedOnRowAndCols(sudokuBlock);
}

function getRowColFromSudokuBlockId(id) {
    let tokens = id.split('-');
    return {
        row: parseInt(tokens[1]),
        col: parseInt(tokens[3])
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

    let sudokuBlock = document.getElementById(getSudokuBlockId(currX, currY));
    if (!isSudokuErrorBlock(sudokuBlock)) {
        unSelectSudokuBlock(sudokuBlock);
    }
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
            sudokuMatrix[i][j] = {
                input: false,
                num: 0
            };
        }
    }
}

function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getDifficultyRange(gameDifficulty) {
    // Easy - 3 to 8 filled
    // Medium - 2 to 5 filled
    // Hard - 1 to 3 filled
    if (gameDifficulty == Easy) {
        return { minRange: 3, maxRange: 8, minNum: 3 };
    } else if (gameDifficulty == Medium) {
        return { minRange: 2, maxRange: 5, minNum: 2};
    } else if (gameDifficulty == Hard) {
        return { minRange: 1, maxRange: 3, minNum: 0};
    }
}

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
        let minCount = 0;

        while (minCount < range.minNum || j < noOfItemsInGrid) {
            let num = getRandomNumberInRange(1, 9);

            let range = indices[i];
            let row = getRandomNumberInRange(range.row[0], range.row[1] + 1);
            let col = getRandomNumberInRange(range.col[0], range.col[1] + 1);
            
            if (Sudoku.isValidPlacement(rows, cols, grids, row, col, i, num)) {
                rows[row].push(num);
                cols[col].push(num);
                grids[i].push(num);
                sudokuMatrix[row][col] = {
                    input: true,
                    num: num
                };  
                minCount += 1;              
            }

            j += 1;
        }
    }
}

function initOptions() {
    let options = document.getElementById('options');
    options.onclick = (event) => {
        let optionsDialog = document.getElementById('options-dialog');
        let closeOptionsDialog = document.getElementById('options-dialog-close');
        closeOptionsDialog.onclick = (event) => {
            optionsDialog.style.visibility = 'hidden';
            options.style.visibility = 'visible';
            gameDifficulty.style.display = 'none';
        };

        optionsDialog.style.visibility = 'visible';
        options.style.visibility = 'hidden';
        
        let newgame = document.getElementById('newgame');
        let gameDifficulty = document.getElementById('difficulty');
        newgame.onclick = (event) => {
            gameDifficulty.style.display = 'block';
        };

        gameDifficulty.onchange = (event) => {
            document.getElementById('game').innerHTML = '';
            initSudokuBoard(event.target[event.target.selectedIndex].id);
            closeOptionsDialog.click();
        }
    };
}

function initSudokuBoard(gameDifficulty) {
    let sudokuBoard = document.getElementById('game');
    generateSudokuMatrix(gameDifficulty);

    for (let i = 0; i < 9; i++) {

        let sudokuRow = getSudokuRow();
        for (let j = 0; j < 9; j++) {
        
            let data = sudokuMatrix[i][j].num == 0 ? '' : sudokuMatrix[i][j].num;
            let sudokuBlock = getSudokuBlock(i, j, data);
            sudokuRow.appendChild(sudokuBlock);

            if (i == 0 && j == 0) {
                selectSudokuBlock(sudokuBlock);
            }
        }

        sudokuBoard.appendChild(sudokuRow);
    }

    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('selectstart', event => event.preventDefault());
}