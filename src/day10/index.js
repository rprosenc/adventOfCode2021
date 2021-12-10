import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(l => l.split(''));

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const openChars = '([{<'.split('');
    const closingPairs = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>',
    }

    const points = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
    }

    const illegalChars = [];
    for (let i = 0; i < input.length; i++) {
        // chunks stay local
        const chunks = [];
        let openChunk;
        for (let j = 0; j < input[i].length; j++) {
            if (openChars.includes(input[i][j])) {
                chunks.push(input[i][j]);
                continue;
            }

            // must be closing character
            // test against top most open chunk
            openChunk = chunks.pop();
            if (input[i][j] !== closingPairs[openChunk]) {
                illegalChars.push(input[i][j]);
                break;
            }
        }
    }
    return illegalChars.map(c=>points[c]).reduce((a,b)=>a+b);
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);

    return;
};

run({
    part1: {
        tests: [
            {
                input: `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`, expected: 26397
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
