import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(l => l.split('').map(Number));

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    //console.log(input);
    let surroundings;
    let localMinimum = [];
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            surroundings = [];
            if (i > 0) {
                // above
                surroundings.push(input[i - 1][j]);
            }
            if (j > 0) {
                // left
                surroundings.push(input[i][j - 1]);
            }
            if (j < (input[i].length - 1)) {
                // right
                surroundings.push(input[i][j + 1]);
            }
            if (i < (input.length - 1)) {
                // below
                surroundings.push(input[i + 1][j]);
            }

            surroundings.sort();
            if (input[i][j] < surroundings[0]) {
                localMinimum.push(input[i][j]);
            }
        }
    }

    return localMinimum.map(n => n + 1).reduce((prev, curr) => prev + curr);
};

const findBasin = (input, x, y, exclude, found) => {
    const targets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    targets.forEach(v => {
        const i = x + v[0];
        const j = y + v[1];

        if (exclude[i + '_' + j]) return;
        if (i < 0 || j < 0) return;
        if (i >= input.length || j >= input[i].length) return;
        exclude[i + '_' + j] = true;

        if (input[i][j] !== 9) {
            found.push(input[i][j]);
            //console.log({x,y,i,j, input:input[i][j], found:found.join('')});
            findBasin(input, i, j, exclude, found)
        }
    })

    // for (let i = x-1; i <= x+1; i++) {
    //     for (let j = y-1; j <= y + 1; j++) {
    //         //console.log(i,j);
    //         if (exclude[i+'_'+j]) continue;
    //         if (i<0 || j<0) continue;
    //         if (i>=input.length || j>=input[i].length) continue;
    //         exclude[i+'_'+j] = true;
    //         if (input[i][j] !== 9) {
    //             found.push(input[i][j]);
    //             console.log({x,y,i,j, input:input[i][j], found:found.join('')});
    //             findBasin(input, i,j, exclude, found)
    //         }
    //     }
    // }

    return found;
}

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const done = {};
    const basins = [];
    let basin = [];
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (input[i][j] !== 9) {
                basin = findBasin(input, i, j, done, []);
                if (basin.length) {
                    basins.push(basin);
                }
            }
        }
    }

    basins.sort((a,b) => a.length > b.length ? -1 : 1);

    return basins.splice(0,3).map(b=>b.length).reduce((a,b)=>a*b);
};

run({
    part1: {
        tests: [
            {
                input: `2199943210
3987894921
9856789892
8767896789
9899965678`, expected: 15
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `2199943210
3987894921
9856789892
8767896789
9899965678`, expected: 1134
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
