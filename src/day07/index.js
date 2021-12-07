import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(',')
    .map(Number)
    .sort((a, b) => a < b ? -1 : 1);

const calcCosts = (input, targetIdx) => {
    let cost = 0;
    for (let i = 0; i < input.length; i++) {
        cost += Math.abs(input[targetIdx] - input[i]);
    }

    return cost;
}

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    // let positions = [...input];
    // let targetIdx = positions.length/2;
    let costs = calcCosts(input, 0);
    let newCosts = costs;

    for (let i = 1; i <input.length; i++) {
        newCosts = calcCosts(input, i);
        if (newCosts < costs) {
            costs = newCosts;
        }
    }

    return costs;
};

const calcCosts2 = (input, target) => {
    // let singleCost = 0;
    let cost = 0;
    let way = 0;
    for (let i = 0; i < input.length; i++) {
        way = Math.abs(target - input[i]);
        // singleCost = 0;
        for (let j = 0; j < way; j++) {
            cost += j + 1;
        }
        // cost += singleCost;
        // console.log('cost', {i, from: input[i], to: target, way,cost, singleCost});
    }

    return cost;
}

const part2 = (rawInput) => {
    const input = parseInput(rawInput);

    // let positions = [...input];
    // let targetIdx = positions.length/2;
    let costs = calcCosts2(input, 0);
    let newCosts = costs;

    for (let i = 1; i < input.length; i++) {
        newCosts = calcCosts2(input, i);
        if (newCosts < costs) {
            costs = newCosts;
        }
    }

    return costs;
};

run({
    part1: {
        tests: [
            {input: `16,1,2,0,4,2,7,1,2,14`, expected: 37},
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {input: `16,1,2,0,4,2,7,1,2,14`, expected: 168},
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: true
});
