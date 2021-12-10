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
    const openChars = '([{<'.split('');
    const closingPairs = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>',
    }

    const points = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4,
    }

    const illegalChars = [];
    const incompleteLines = [];
    const lineEndings = [];
    const scores = [];
    for (let i = 0; i < input.length; i++) {
        // chunks stay local
        const chunks = [];
        let openChunk;
        let lineIllegal = false;
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
                lineIllegal = true;
                break;
            }
        }
        if (!lineIllegal) {
            incompleteLines.push(input[i]);
            lineEndings.push(chunks.reverse().map(c=>closingPairs[c]));
        }
    }

    for (let i = 0; i < lineEndings.length; i++) {
        let score = 0;
        for (let j = 0; j < lineEndings[i].length; j++) {
            score *= 5;
            score += points[lineEndings[i][j]];
        }
        scores.push(score);
    }
    return scores.sort((a,b)=>a<b?-1:1)[(scores.length-1)/2];
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
<{([{{}}[<[[[<>{}]]]>[]]`, expected: 288957
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
