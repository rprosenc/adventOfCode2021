import run from "aocrunner";
import chalk from 'chalk';

const parseInput = (rawInput) => {
    const coords = /x=(([-\d]+)\.\.([-\d]+)), y=(([-\d]+)\.\.([-\d]+))/.exec(rawInput);
    const x = [coords[2], coords[3]].map(Number);
    const y = [coords[5], coords[6]].map(Number);
    return new Area(...x, ...y);
};


function print(field) {
    const buffer = [];
    const xMap = {};
    const yMap = {};

    let line, c, i=0, j=0;
    // baseline
    for (let y = field.yMax; y >= field.yMin; y--) {
        yMap[y] = i++;
        line = [(y+'').padStart(4, ' ') + ' '];
        j = 0;
        for (let x = field.xMin; x <= field.xMax; x++) {
            xMap[x] = j++;
            c = chalk.hex('#333333')('▒');
            if (
                x >= field.target.xMin && x <= field.target.xMax &&
                y >= field.target.yMin && y <= field.target.yMax
            ) {
                // in target area
                c = chalk.hex('#666699')('▒');
            }
            line.push(c);
        }
        buffer.push(line);
    }

    let x,y;

    // paint tracers
    for (const probe of field.probes) {
        let color = field.inTarget(probe) ? '#99FF99' : '#339999';
        for (let i = 0; i < probe.trace.length; i++) {
            x = xMap[probe.trace[i].x];
            y = yMap[probe.trace[i].y];
            buffer[y][x+1] = chalk.hex(color)('o');
        }
    }

    // add start
    x = xMap[0];
    y = yMap[0];
    buffer[y][x+1] = chalk.hex('#00FF00')('S');


    return buffer.map(l=>l.join('')).join('\n');
}



class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
}

class Area {
    constructor(x0, x1, y0, y1) {
        this.xMin = Math.min(x0, x1);
        this.xMax = Math.max(x0, x1);
        this.yMin = Math.min(y0, y1);
        this.yMax = Math.max(y0, y1);
    }

    contains(point) {
        return point.x >= this.xMin &&
                point.x<=this.xMax &&
                point.y >= this.yMin &&
                point.y<=this.yMax;
    }
}

class Field {
    constructor(target) {
        this.target = target; // Area

        this.xMin = Math.min(0, target.xMin);
        this.xMax = Math.max(0, target.xMax);
        this.yMin = Math.min(0, target.yMin);
        this.yMax = Math.max(0, target.yMax);

        this.probes = [];
    }

    simulate(probe) {
        this.probes.push(probe);
        while (probe.y() >= this.target.yMin) {
            probe.step();
            this.xMin = Math.min(this.xMin, probe.x());
            this.xMax = Math.max(this.xMax, probe.x());
            this.yMin = Math.min(this.yMin, probe.y());
            this.yMax = Math.max(this.yMax, probe.y());

            if (this.inTarget(probe)) {
                break;
            }
        }
    }

    inTarget(probe) {
        for (let i = 0; i < probe.trace.length; i++) {
            if (this.target.contains(probe.trace[i])) {
                return true;
            }
        }

        return false;
    }
}

class Probe {
    constructor(position, velocity) {
        this.v = velocity; // Vector
        this.vStart = new Vector(velocity.x, velocity.y);
        this.p = position;
        this.trace = [ ];
    }

    /*
        Due to drag, the probe's x velocity changes by 1 toward the value 0;
        that is, it decreases by 1 if it is greater than 0,
        increases by 1 if it is less than 0, or does not change
        if it is already 0.
        Due to gravity, the probe's y velocity decreases by 1.
     */
    step() {
        // apply velocity
        this.p = this.p.add(this.v);

        // store new point in path
        this.trace.push( this.p )

        // lots of inplace changes... might prove bad
        // drag
        if (this.v.x > 0) {
            this.v.x--;
        }
        if (this.v.x < 0) {
            this.v.x++;
        }

        // gravity
        this.v.y--;
    }

    x() {
        return this.p.x;
    }

    y() {
        return this.p.y;
    }
}

async function animate(probes, target) {
    let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    let highestY = target.yMin;
    let highestV = 0;

    for (let i = 0; i < probes.length; i++) {
        const field = new Field(target)
        field.simulate(probes[i]);
        if (field.inTarget(probes[i])) {
            highestY = field.yMax;
            highestV = probes[i].vStart.y;
        }

        process.stdout.write('\x1Bc');  // clear terminal
        console.log();
        console.log('highest Y: ' + highestY, ', startV: ' + highestV);
        console.log(print(field));
        await sleep(250);
    }
}

async function part1(rawInput) {
    const target = parseInput(rawInput);
    const start =  new Vector(0, 0);
    const probes = [];
    for (let i = 0; i < 400; i++) {
        probes.push(new Probe(start, new Vector(22,i)));
    }

    let highestY = target.yMin;
    let highestV = 0;
    for (let i = 0; i < probes.length; i++) {
        const field = new Field(target)
        field.simulate(probes[i]);
        if (field.inTarget(probes[i])) {
            highestY = field.yMax;
            highestV = probes[i].vStart.y;
        }
    }
    console.log('highest Y: ' + highestY, ', startV: ' + highestV);

    // animate(probes);

    return highestY;
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);

    return;
};

run({
    part1: {
        tests: [
            // {input: `target area: x=20..30, y=-10..-5`, expected: 45},
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {input: `target area: x=20..30, y=-10..-5`, expected: 45},
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
