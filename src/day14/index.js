import run from "aocrunner";

const parseInput = (rawInput) => {
    const [template, rulesList] = rawInput.split('\n\n');

    const rules = {};
    rulesList
        .split('\n')
        .forEach(r => rules[r.split(' -> ')[0]] = r.split(' -> ')[1]
        );


    return {template, rules}
}

const polymerize = (template, rules, steps) => {
    let pair;

    for (let i = 0; i < steps; i++) {
        // repeat steps times
        let tmp = [];
        for (let j = 0; j < template.length; j++) {
            pair = template[j] + template[j + 1];
            tmp.push(template[j]);
            if (rules[pair]) {
                tmp.push(rules[pair]);
            }
        }
        template = [...tmp];
    }

    return template;
}

const countDict = (template) => {
    const chars = {};
    template.forEach(c => {
        if (chars[c]) {
            chars[c]++;
        } else {
            chars[c] = 1;
        }
    });

    return chars;
}

const diffMinMax = (chars) => {
    // { N: 865, B: 1749, C: 298, H: 161 }
    const quantities = Object.values(chars);
    quantities.sort((a, b) => a < b ? -1 : 1);

    return quantities.pop() - quantities[0];
}

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    let startTemplate = [...input.template];
    const rules = input.rules;

    const template = polymerize(startTemplate, rules, 10);
    const chars = countDict(template);

    console.log(chars);
    return diffMinMax(chars);
};


const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    let template = [...input.template];
    const rules = input.rules;
    const steps = 10;
    const map = {};


    function mapValue(pair) {
        const values = [];
        const char = rules[pair];
        if (char) {
            values.push(pair[0] + char);
            values.push(char + pair[1]);
        }
        return {cnt: 1, values, char}
    }

    function addValue(pair) {
        if (!map[pair]) {
            map[pair] = mapValue(pair);
        }
        map[pair].cnt ++;
    }

    // init map
    for (let i = 0; i < template.length - 1; i++) {
        let pair = template[i] + template[i + 1];
        addValue(pair);
    }

    // iterate
    for (let i = 0; i < steps+1; i++) {
        const keys = Object.keys(map);
        for (const key of keys) {
            addValue(map[key].values[0]);
            addValue(map[key].values[1]);
        }
    }

    console.log(map);

    const chars = {};
    for (const key of Object.keys(map)) {
        const char = map[key].char;
        if (!chars[char]) {
            chars[char] = 0;
        }

        chars[char] += map[key].cnt;
    }

    for (let i = 0; i < template.length; i++) {
        chars[template[i]]++;
    }
console.log(chars);
    console.log(diffMinMax(chars));
    exit;
    return diffMinMax(chars);

};

run({
    part1: {
        tests: [
            {
                input: `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`, expected: 1588
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`, expected: 2188189693529
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
