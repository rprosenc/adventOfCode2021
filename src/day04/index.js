import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(s => s.trim());

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const numbers = input[0].split(',').map(Number);

    const boards = [];
    let board, row;

    // read in boards. for each board, store both, the list of rows and the list of cols
    for (let i = 1; i < input.length; i++) {
        // initialize new board
        if (input[i] === '') {
            board = {cols: [], rows: []};
            boards.push(board);
            continue;
        }
        // split by repeating whitespaces as input is right aligned
        row = input[i].split(/ +/).map(Number);
        board.rows.push(row);
        // push each number to corresponding col
        for (let j = 0; j < row.length; j++) {
            if (board.cols.length === j) {
                board.cols.push([]);
            }
            board.cols[j].push(row[j]);
        }
    }

    let drawn, winner;
    let remainingSum = 0;
    // apply drawn numbers
    for (let n = 0; n < numbers.length; n++) {
        drawn = numbers[n];
        // remove number from every board
        for (let b = 0; b < boards.length; b++) {
            winner = false;
            boards[b].rows.forEach((r, i) => {
                boards[b].rows[i] = r.filter(v => v != drawn);
                if (!boards[b].rows[i].length) {
                    winner = true;
                }
            });

            boards[b].cols.forEach((r, i) => {
                boards[b].cols[i] = r.filter(v => v != drawn);
                if (!boards[b].cols[i].length) {
                    winner = true;
                }
            });

            // test winning condition
            if (winner) {
                remainingSum = 0;
                // somebody just reached length === 0
                boards[b].rows.forEach(r => {
                    r.forEach(p => {
                        remainingSum += p;
                    });
                });
                return remainingSum * drawn;
            }
        }

    }


    exit;
    return 12;
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);

    return;
};

run({
    part1: {
        tests: [
            {
                input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

      22 13 17 11  0
       8  2 23  4 24
      21  9 14 16  7
       6 10  3 18  5
       1 12 20 15 19
      
       3 15  0  2 22
       9 18 13 17  5
      19  8  7 25 23
      20 11 10 24  4
      14 21 16 12  6
      
      14 21 17 24  4
      10 16 15  9 19
      18  8 23 26 20
      22 11 13  6  5
       2  0 12  3  7`, expected: 4512
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            // { input: ``, expected: "" },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
