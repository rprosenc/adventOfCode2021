import run from "aocrunner";


/*
get something like
[
  [ [ 629, 581 ], [ 123, 75 ] ],
  [ [ 921, 643 ], [ 452, 643 ] ],
  ...
]
 */
const parseInput = (rawInput) => rawInput.split('\n').map(l => l.split(' -> ').map(p => p.split(',').map(Number)));


const initMap = (lines) => {
    let maxX = 0;
    let maxY = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i][0][0] > maxX) {
            maxX = lines[i][0][0];
        }
        if (lines[i][1][0] > maxX) {
            maxX = lines[i][1][0];
        }
        if (lines[i][0][1] > maxY) {
            maxY = lines[i][0][1];
        }
        if (lines[i][1][1] > maxY) {
            maxY = lines[i][1][1];
        }
    }

    const map = [];
    for (let i = 0; i <= maxX; i++) {
        map[i] = [];
        for (let j = 0; j <= maxY; j++) {
            map[i][j] = 0;
        }
    }

    return map;
}

// adds a point inplace to ocean, returns true if crossed existing value, false if point is new
const addPoint = (map, point) => {
    const [x, y] = point;

    map[x][y] = map[x][y] + 1;
    return map[x][y] > 1;
}

const getPoints = (line) => {
    // sort points in line by ascending X value
    const [x1, y1] = line[0];
    const [x2, y2] = line[1];
    const points = [];

    const dir = [0, 0];
    if (x1 < x2) {
        dir[0] = 1; // direction to the right
    } else if (x1 > x2) {
        dir[0] = -1; // direction to the left
    }
    if (y1 < y2) {
        dir[1] = 1; // direction down
    } else if (y1 > y2) {
        dir[1] = -1; // direction up
    }

    let p = [x1, y1];
    points.push([x1, y1]);
    // repeat as long as p != P2
    while (p[0] != x2 || p[1] != y2) {
        // increment in direction
        p[0] += dir[0];
        p[1] += dir[1];
        // add point as copy, as p is changed inplace
        points.push([...p]);
    }

    return points;
}

const diagonal = (line) => {
    return !((line[0][0] === line[1][0]) || (line[0][1] === line[1][1]));
}

const print = (map) => {
    const transp = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (transp[j] === undefined) {
                transp[j] = [];
            }
            transp[j][i] = map[i][j];
        }
    }
    for (let i = 0; i < transp.length; i++) {
        console.log(transp[i].join('').replaceAll('0','.'));
    }
}

const cnt = (map) => {
    let sum = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] > 1) {
                sum++;
            }
        }
    }

    return sum;
}

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    let overlaps = 0;
    const map = initMap(input);

    let points;
    for (let i = 0; i < input.length; i++) {
        if (diagonal(input[i])) continue;
        points = getPoints(input[i]);
        for (let j = 0; j < points.length; j++) {
            if (addPoint(map, points[j])) {
                overlaps++;
            }
        }
    }

    if (map.length < 80) {
        print(map);
    }

    return cnt(map);
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    let overlaps = 0;
    const map = initMap(input);

    let points;
    for (let i = 0; i < input.length; i++) {
        points = getPoints(input[i]);
        for (let j = 0; j < points.length; j++) {
            if (addPoint(map, points[j])) {
                overlaps++;
            }
        }
    }

    if (map.length < 80) {
        print(map);
    }

    return cnt(map);
};

run({
    part1: {
        tests: [
            {
                input: `15,2 -> 4,2`, expected: 0
            },{
                input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`, expected: 5
            }, {
                input: `1,0 -> 10,0
1,0 -> 10,0
`, expected: 10
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            { input: `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`, expected: 12 },
        ],
        solution: part2,
    },
    onlyTests: true,
    trimTestInputs: true,
});
