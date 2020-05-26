function onLoad() {
    initSudokuBoard();
}

function getSudokuRow() {
    let sudokuRow = document.createElement('div');
    sudokuRow.className = 'sudoku-row';
    return sudokuRow;
}

function getLabel() {
    let label = document.createElement('label');
    label.className = 'number';
    return label;
}

function getSudokuBlock() {
    let sudokuBlock = document.createElement('div');
    sudokuBlock.className = 'sudoku-block';
    sudokuBlock.appendChild(getLabel());
    return sudokuBlock;
}

function initSudokuBoard() {
    let sudokuBoard = document.getElementById('game');
    for (let i = 0; i < 9; i++) {
        let sudokuRow = getSudokuRow();
        for (let j = 0; j < 9; j++) {
            sudokuRow.appendChild(getSudokuBlock());
        }

        sudokuBoard.appendChild(sudokuRow);
    }
}