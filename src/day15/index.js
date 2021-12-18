import run from "aocrunner";
import bgrins from "javascript-astar";


const parseInput = (rawInput) => rawInput.split('\n').map(l => l.split('').map(Number));

const riskLevel = (input) => {
    // Weight can easily be added by increasing the values within the graph, and where 0 is infinite (a wall)
    let graph = new bgrins.Graph(input);
    let start = graph.grid[0][0];
    let end = graph.grid[input.length - 1][input[0].length - 1];
    let path = bgrins.astar.search(graph, start, end);

    return path.map(n => n.weight).reduce((a, b) => a + b);
}

const part1 = (rawInput) => {
    const input = parseInput(rawInput);

    return riskLevel(input);
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);

    const fullMap = [];

    // multiply map to 5 times the width
    let val;
    let width = input[0].length;
    let height = input.length;
    for (let y = 0; y < input.length; y++) {
        fullMap.push([]);
        for (let h = 0; h < 5; h++) { // stack horizontally
            for (let x = 0; x < width; x++) {
                val = (input[y][x] + h) % 9;
                fullMap[y].push(val ? val : 9);
            }
        }
    }

    for (let v = 1; v < 5; v++) { // stack horizontally
        for (let y = 0; y < height; y++) {
            fullMap.push([]);
            for (let x = 0; x < fullMap[y].length; x++) {
                val = (fullMap[y][x] + v) % 9;
                fullMap[fullMap.length-1].push(val ? val : 9);
            }
        }
    }
    return riskLevel(fullMap);
};


run({
    part1: {
        tests: [
            {
                input: `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`, expected: 40
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
             {
                input: `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`, expected: 315
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
