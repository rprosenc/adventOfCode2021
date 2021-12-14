import run from "aocrunner";

const parseInput = (rawInput) => {
    const [template, rulesList] = rawInput.split('\n\n');

    const rules = {};
    rulesList
        .split('\n')
        .forEach(r => rules[r.split(' -> ')[0]]= r.split(' -> ')[1]
        );


    return {template, rules}
}

const polymerize = (template, rules, steps) => {
    let pair;

    for (let i = 0; i < steps; i++) {
        // repeat steps times
        let tmp = [];
        for (let j = 0; j < template.length; j++) {
            pair = template[j]+template[j+1];
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
    template.forEach(c=>{if(chars[c]) {chars[c]++;} else {chars[c]=1;}});

    return chars;
}

const diffMinMax = (chars) => {
    // { N: 865, B: 1749, C: 298, H: 161 }
    const quantities = Object.values(chars);
    quantities.sort((a,b)=>a<b?-1:1);

    return quantities.pop() - quantities[0];
}

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    let startTemplate = [...input.template];
    const rules = input.rules;

    const template = polymerize(startTemplate, rules, 10);
    const chars = countDict(template);
    return diffMinMax(chars);
};

function countQuantitiesRec(dict, pair, level) {
    if (level === 1) {
        const cnt = countDict(dict[pair].t);
        const t = dict[pair].t;
        const lastC = t[t.length-1];
        cnt[lastC]--; // magic thing - never count the last character
        return cnt;
    }

    // just in case...
    if (level < 1) {
        return {}
    }

    const template = dict[pair].t;
    const quantities = {};
    for (let i = 0; i < template.length-1; i++) {
        let data = countQuantitiesRec(dict, template[i]+template[i+1], level-1);
        for (const q of Object.keys(data)) {
            if (!quantities[q]) {
                quantities[q] = 0;
            }
            quantities[q] += data[q];
        }
    }

    return quantities;
}

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    let template = [...input.template];
    const rules = input.rules;
    const steps = 40;
    const dictSteps = 10;

    const dict = {};
    for (const pair of Object.keys(rules)) {
        let t = polymerize(pair, rules, dictSteps);
        dict[pair] = {t, stats: countDict(t)};
    }

    console.log(         '       '+template.join(''));
    process.stdout.write('Start: ');
    const chars = {};
    for (let i = 0; i < template.length-1; i++) {
        process.stdout.write('.')
        const pair = template[i]+template[i+1];
        // let data = countDict(dict[pair].t)
        let data = countQuantitiesRec(dict, pair, steps/dictSteps);
        for (const c of Object.keys(data)) {
            if(chars[c]) {
                chars[c]+=data[c];
            } else {
                chars[c]=data[c];
            }
        }
    }
    console.log('');

    const lastChar = template.pop();
    chars[lastChar]++; // add last character in again

    console.log('part 2 chars', chars, diffMinMax(chars));
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
//             {
//                 input: `NNCB
//
// CH -> B
// HH -> N
// CB -> H
// NH -> C
// HB -> C
// HC -> B
// HN -> C
// NN -> C
// BH -> H
// NC -> B
// NB -> B
// BN -> B
// BB -> N
// BC -> B
// CC -> N
// CN -> C`, expected: 2188189693529
//             },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
