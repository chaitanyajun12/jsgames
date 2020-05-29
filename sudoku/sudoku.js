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

    static getHint(sudokuMatrix) {

    }
}