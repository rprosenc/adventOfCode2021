import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(l => l.split(' | ').map(p => p.split(' ').map(c=>c.split('').sort())));

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const segments = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

    let cnt = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i][1].length; j++) {
            if (
                input[i][1][j].length === segments[1] ||
                input[i][1][j].length === segments[4] ||
                input[i][1][j].length === segments[7] ||
                input[i][1][j].length === segments[8]
            ) {
                cnt++;
            }
        }
    }

    return cnt;
};

const intersection = (a1, a2) => a1.filter(x => a2.includes(x));
const difference = (a1, a2) => a1.filter(x => !a2.includes(x));
const getMapping = (line) => {
    let patterns;
    const mapping = {};
    let buff;

    patterns = {};
    for (let j = 0; j < line.length; j++) {
        if (!patterns[line[j].length]) {
            patterns[line[j].length] = [];
        }
        patterns[line[j].length].push(line[j]);
    }

    if (!patterns[2].length) {
        console.error('cannot procede, no digit 1 in patterns');
        return;
    }

    // find segment a by comparing digit 7 (3 segments) to digit 1 (2 segments)
    mapping.a = difference(patterns[3][0], patterns[2][0]).pop();

    // find segment c by comparing all numbers with 6 segments to number with 2 segments
    for (let j = 0; j < patterns[6].length; j++) {
        buff = difference(patterns[2][0], patterns[6][j]);
        if (buff.length) {
            mapping.c = [buff[0]][0];
        }
    }

    // find segment f by comparing 1 to known c
    mapping.f = patterns[2][0].filter( s=> s!=mapping.c).pop();

    // find dg by searching for difference between digits 7 and 3 (leads to segments left)
    for (let j = 0; j < patterns[5].length; j++) {
        buff = difference(patterns[5][j], patterns[3][0]);
        if (buff.length === 2) {
            mapping.dg = buff;
        }
    }
    // find segment d by intersection of dg with digit 4
    mapping.d = intersection(mapping.dg, patterns[4][0]).pop();


    // find segment g by dg without d
    mapping.g = mapping.dg.filter(d=>d!=mapping.d).pop();


    // find segment b by removing knwn segments from digit 4
    mapping.b = difference(patterns[4][0], [mapping.c, mapping.d, mapping.f]).pop();

    // find e by removing all known segments from digit 8
    mapping.e = difference(patterns[7][0], [
        mapping.a, mapping.b, mapping.c,
        mapping.d, mapping.f, mapping.g
    ]).pop();


    const remap = {};
    remap[mapping.a] = 'a';
    remap[mapping.b] = 'b';
    remap[mapping.c] = 'c';
    remap[mapping.d] = 'd';
    remap[mapping.e] = 'e';
    remap[mapping.f] = 'f';
    remap[mapping.g] = 'g';

    return remap;
}

const mapWires = (pattern, mapping) => {
    const wires = pattern.map(p=>mapping[p]).sort().join('');
    const digits = {
        'abcefg': 0,
        'cf': 1,
        'acdeg': 2,
        'acdfg': 3,
        'bcdf': 4,
        'abdfg': 5,
        'abdefg': 6,
        'acf': 7,
        'abcdefg': 8,
        'abcdfg': 9,
    }
    return digits[wires];
}

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    let sum = 0;
    let mapping;
    for (let i = 0; i < input.length; i++) {
        mapping = getMapping(input[i][0]);
        if (!mapping) continue;

        sum += Number(input[i][1].map(w=>mapWires(w, mapping)).join(''));
    }

    return sum;
};

run({
    part1: {
        tests: [
            {
                input: `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`,
                expected: 26
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            { input: `acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`, expected: 5353 },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
