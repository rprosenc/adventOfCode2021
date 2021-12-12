import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(l=>l.split('-'));

function getPath(adjMap, path, forbidden, allPaths) {
    const lastNode = path[path.length-1];
    if (lastNode === 'end') {
        // fini
        allPaths.push(path);
        return;
    }

    let newPath = [];
    let newForbidden = [];
    let currentNode;

    for (let i = 0; i < adjMap[lastNode].length; i++) {
        currentNode = adjMap[lastNode][i];
        if (forbidden.includes(currentNode)) {
            continue;
        }
        newPath = [...path];
        newPath.push(currentNode);
        newForbidden = [...forbidden];
        if (currentNode === currentNode.toLowerCase()) {
            newForbidden.push(currentNode);
        }
        getPath(adjMap, newPath, newForbidden, allPaths);
    }
}

function getPathTwice(adjMap, path, forbidden, allPaths, twicer) {
    const lastNode = path[path.length-1];
    if (lastNode === 'end') {
        allPaths.push(path);
        return;
    }

    let newPath = [];
    let newForbidden = [];
    let currentNode;

    for (let i = 0; i < adjMap[lastNode].length; i++) {
        currentNode = adjMap[lastNode][i];
        if (forbidden.includes(currentNode)) {
            continue;
        }
        newPath = [...path];
        newPath.push(currentNode);
        newForbidden = [...forbidden];
        if (currentNode === currentNode.toLowerCase()) {
            if (!twicer) {
                getPathTwice(adjMap, newPath, newForbidden, allPaths, currentNode);
            }
            newForbidden.push(currentNode);
        }

        getPathTwice(adjMap, newPath, newForbidden, allPaths, twicer);
    }
}

function buildAdjacencyMap(input) {
    const adjMap = {};
    for (let i = 0; i < input.length; i++) {
        if (!adjMap[input[i][0]]) {
            adjMap[input[i][0]] = [];
        }
        adjMap[input[i][0]].push(input[i][1]);

        if (!adjMap[input[i][1]]) {
            adjMap[input[i][1]] = [];
        }
        adjMap[input[i][1]].push(input[i][0]);
    }

    return adjMap;
}
const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const adjMap = buildAdjacencyMap(input);
    const allPaths = [];
    getPath(adjMap, ['start'], ['start'], allPaths);

    return allPaths.length;
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const adjMap = buildAdjacencyMap(input);
    const allPaths = [];
    getPathTwice(adjMap, ['start'], ['start'], allPaths, null);

    const uniquePaths = [];
    for (let i = 0; i < allPaths.length; i++) {
        // need to operate on strings! thus join stuffs
        if (!uniquePaths.includes(allPaths[i].join())) {
            uniquePaths.push(allPaths[i].join());
        }
    }

    return uniquePaths.length;
};

run({
    part1: {
        tests: [
            {
                input: `start-A
start-b
A-c
A-b
b-d
A-end
b-end`, expected: 10
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
//             {
//                 input: `start-A
// start-b
// A-c
// A-b
// b-d
// A-end
// b-end`, expected: 36
//             },
//             {
//                 input: `dc-end
// HN-start
// start-kj
// dc-start
// dc-HN
// LN-dc
// HN-end
// kj-sa
// kj-HN
// kj-dc`, expected: 103
//             },
            {
                input: `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`, expected: 3509
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
