var indices = [
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

class Sudoku {
    static isValidSudokuMatrix(sudokuMatrix) {
        if (!sudokuMatrix) {
            return false;
        }

        let rows = [];
        let cols = [];
        let grids = [];

        for (let i = 0; i < 9; i++) {
            rows[i] = [];
            cols[i] = [];
            grids[i] = [];
        }

        for (let i = 0; i < 9; i++) {

            let range = indices[i];
            for (let row = range.row[0]; row <= range.row[1]; row++) {
                for (let col = range.col[0]; col <= range.col[1]; col++) {

                    let block = sudokuMatrix[row][col];
                    if (block.num == 0) {
                        return false;
                    }

                    if (!this.isValidPlacement(rows, cols, grids, row, col, i, block.num)) {
                        return false;
                    }

                    rows[row].push(block.num);
                    cols[col].push(block.num);
                    grids[i].push(block.num);
                }
            }
        }
    }

    static isValidPlacement(rows, cols, grids, row, col, gridNum, num) {
        if (rows[row] && rows[row].indexOf(num) >= 0) return false;
        if (cols[col] && cols[col].indexOf(num) >= 0) return false;
        if (grids[gridNum] && grids[gridNum].indexOf(num) >= 0) return false;
        return true;
    }
    
    static solveSudokuMatrix(sudokuMatrix) {
    
    }

    static getSudokuGridCoordinates(row, col) {
        for (let i = 0; i < indices.length; i++) {
            let coordinates = indices[i];
            if (row >= coordinates.row[0] && row <= coordinates.row[1] 
                && col >= coordinates.col[0] && col <= coordinates.col[1]) {
                return coordinates;
            }
        }
    }

    static getErrorSudokuBlocks(sudokuMatrix, currRow, currCol) {
        let block = sudokuMatrix[currRow][currCol];
        let num = block.num;
        let rowBlock, colBlock;
        let errorBlocks = [];

        for (let i = 0; i < 9; i++) {
            rowBlock = sudokuMatrix[i][currCol];
            colBlock = sudokuMatrix[currRow][i];

            if (rowBlock.num == num) {
                errorBlocks.push({
                    row: parseInt(i),
                    col: parseInt(currCol)
                });
            }

            if (colBlock.num == num) {
                errorBlocks.push({
                    row: parseInt(currRow),
                    col: parseInt(i)
                });
            }
        }

        let gridCoordinates = this.getSudokuGridCoordinates(currRow, currCol);
        for (let i = gridCoordinates.row[0]; i <= gridCoordinates.row[1]; i++) {
            for (let j = gridCoordinates.col[0]; j <= gridCoordinates.col[1]; j++) {
                if (sudokuMatrix[i][j].num == num) {
                    errorBlocks.push({
                        row: parseInt(i),
                        col: parseInt(j)
                    });
                }
            }
        }

        return errorBlocks;
    }

    static getHint(sudokuMatrix) {

    }
}