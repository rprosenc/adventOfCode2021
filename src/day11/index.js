import run from "aocrunner";

const Reset = "\x1b[0m";
const Bright = "\x1b[1m";

const parseInput = (rawInput) => rawInput.split('\n').map(s => s.split('').map(d => Number(d)));

const Octopus = class {
    constructor(energy,x, y) {
        this.energy = energy;
        this.x = x;
        this.y = y;
        this.neighbours = [];
        this.flashed = false;
    }

    print() {
        if (this.energy > 10 || this.energy === 0) {
            return Bright + 0 + Reset;
        }
        if (this.energy === 10) {
            return Bright + 'X' + Reset;  // for debugging purposes only
        }
        return this.energy;
    }

    addNeighbour(n) {
        this.neighbours.push(n);
    }

    increment() {
        this.energy++;
    }

    flash() {
        if (this.energy > 9 && !this.flashed) { // dont flash back!
            this.flashed = true;
            this.neighbours.forEach(n=>n.increment());
            this.neighbours.forEach(n=>n.flash());
        }
    }

    hasFlashed() {
        return this.flashed;
    }

    reset() {
        if (this.energy > 9) {
            this.energy = 0;
        }
        this.flashed = false;
    }
}


const initMesh = (input) => {
    // create mesh
    const mesh = input.map((line,x)=>line.map((d,y)=>new Octopus(d,x,y)));

    // wire up neighbours
    for (let x = 0; x < input.length; x++) {
        for (let y = 0; y < input[x].length; y++) {
            // iterate on 3x3 surroundings
            let xMin = Math.max(0,x-1);
            let xMax = Math.min(input.length, x+2);
            for (let i = xMin; i < xMax; i++) {
                let yMin = Math.max(0,y-1);
                let yMax = Math.min(input[i].length, y+2);
                for (let j = yMin; j < yMax; j++) {
                    if (i===x && j===y) continue;
                    mesh[x][y].addNeighbour(mesh[i][j]);
                }
            }
        }
    }

    return mesh;
}

async function printMesh(mesh, step, flashes) {
    let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    process.stdout.write('\x1Bc');  // clear terminal
    console.log('  Step', step, 'Flashes', flashes);
    console.log(mesh.map(line => line.map(o => o.print()).join('')).join('\n'));
    await sleep(10);
}

async function part1 (rawInput)  {
    const input = parseInput(rawInput);
    const steps = 100;
    let flashes = 0;

    const mesh = initMesh(input);

    for (let i = 1; i <= steps; i++) {
        // increment all
        mesh.map(line=>line.map(o=>o.increment()));

        // let them flash (and increment/flash neighbours
        mesh.map(line=>line.map(o=>o.flash()));

        // count new flashes
        let newFlashes = mesh.map(line=>line.map(
            o=>Number(o.hasFlashed())
        ).reduce((a,b)=>a+b)).reduce((a,b)=>a+b);
        flashes += newFlashes;

        // reset flashes and energy for new iteration
        mesh.map(line=>line.map(o=>o.reset()));

        // activate for visual
        //await printMesh(mesh, i, flashes);
    }

    return flashes;
};

async function part2 (rawInput)  {
    const input = parseInput(rawInput);
    const steps = 1000;
    let flashes = 0;
    const sum = input.length * input[0].length;

    const mesh = initMesh(input);

    for (let i = 1; i <= steps; i++) {
        // increment all
        mesh.map(line=>line.map(o=>o.increment()));

        // let them flash (and increment/flash neighbours
        mesh.map(line=>line.map(o=>o.flash()));

        // count new flashes
        let newFlashes = mesh.map(line=>line.map(
            o=>Number(o.hasFlashed())
        ).reduce((a,b)=>a+b)).reduce((a,b)=>a+b);

        if (newFlashes === sum) {
            // await printMesh(mesh, i, flashes);
            return i;
        }
        flashes += newFlashes;

        // reset flashes and energy for new iteration
        mesh.map(line=>line.map(o=>o.reset()));

        // activate for visual
        // await printMesh(mesh, i, flashes);
    }

    return 0;
};

run({
    part1: {
        tests: [
//             {
//                 input: `11111
// 19991
// 19191
// 19991
// 11111`, expected: ""
//             },
            {
                input: `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`, expected: 1656
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`, expected: 195
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
