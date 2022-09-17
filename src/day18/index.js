import run from "aocrunner";
import chalk from 'chalk';

const debug = (...args) => {
    //console.log.apply(console, args);
}

const parseInput = (rawInput) => rawInput.split('\n').map(l => l.trim(' '));

const isNumber = (i) => !isNaN(Number(i));


const parseSnailfishNumber = (n) => {
    const symbolBuffer = [];
    let symbol;
    for (let i = 0; i < n.length; i++) {
        symbol = n[i];
        // read out all non-numeric characters (this also processes last character of n)
        if (symbol === ',') {
            continue;
        }
        if (['[', ']'].indexOf(symbol) >= 0) {
            symbolBuffer.push(symbol);
            continue;
        }
        // this and next char are numbers -> read double digit number
        if (isNumber(symbol) && isNumber(n[i + 1])) {
            symbolBuffer.push(Number(symbol + n[i + 1]));
            i++;
            continue;
        }

        // last possibility: a one digit number
        if (isNumber(symbol)) {
            symbolBuffer.push(Number(symbol));
            continue; // anyway...
        }
    }

    return symbolBuffer;
}

const explodePair =(sfNumber, i) => {
    debug('explode:', convertToString(sfNumber, i, i+3));

    let leftPart, rightPart, nextLeft, nextRight;

    leftPart = sfNumber[i+1];
    rightPart = sfNumber[i+2];
    // find next regular number to the left, add leftPart
    // find next regular number to the right, add rightPart
    // remove n[i+1], n[1+2]
    sfNumber = replacePair(sfNumber, i);
    nextLeft = findRealNumberPositionLeftOf(sfNumber, i);
    if (nextLeft>=0) {
        sfNumber[nextLeft] += leftPart;
    }
    nextRight = findRealNumberPositionRightOf(sfNumber, i);
    if (nextRight>=0) {
        sfNumber[nextRight] += rightPart;
    }
    // change [i] to 0;
    sfNumber[i] = Number(0);

    return sfNumber;
}

const replacePair = (sfNumber, i) => {
    const result = sfNumber.slice(0);
    result[i] = 0;
    return result.filter((el,index) => !(index > i && index <= i+3));
}

// split a pair identified by a the position of its opening bracket
const splitPair = (sfNumber, i) => {
    let leftSlice = sfNumber.slice(0,i);
    let rightSlice = sfNumber.slice(i+1);
    let symbol = sfNumber[i];
    debug('split:  ', convertToString(sfNumber, i, i));
    let newPair = ['[', Math.floor(symbol/2), Math.ceil(symbol/2), ']'];
    return leftSlice.concat(newPair.concat(rightSlice));
}

const add = (sfNumberA, sfNumberB) => {
    return ['['].concat(sfNumberA).concat(sfNumberB).concat([']']);
}

const findRealNumberPositionLeftOf = (sfNumber, position) => {
    for(let i=position-1; i>=0; i--) {
        if (isNumber(sfNumber[i])) {
            return i
        }
    }
    return -1;
}

const findRealNumberPositionRightOf = (sfNumber, position) => {
    for(let i=position+1; i<sfNumber.length; i++) {
        if (isNumber(sfNumber[i])) {
            return i
        }
    }
    return -1;
}

const reduce = (sfNumber) => {
    let doAgain = true;
    let nextExplode, nextSplit;
    while (doAgain) {
        doAgain = false;

        nextExplode = findExplode(sfNumber);
        if (nextExplode >= 0) {
            sfNumber = explodePair(sfNumber, nextExplode);
            doAgain = true;
            continue;
        }

        nextSplit = findSplit(sfNumber);
        if (nextSplit >= 0) {
            sfNumber = splitPair(sfNumber, nextSplit);
            doAgain = true;
            continue;
        }
    }
        return sfNumber;
}

const findExplode = (sfNumber) => {
    let i, symbol, depth;

    depth = 0;
    for (i = 0; i < sfNumber.length; i++) {
        symbol = sfNumber[i];
        if (symbol === '[') {
            depth++;
        } else if (symbol === ']') {
            depth--;
        }

        // explode if nested too deeply
        if (depth > 4 && isNumber(symbol)) {
            sfNumber = explodePair(sfNumber, i-1);
            return i-1; // cannot get i==0 here, as depth must be>4 thus at least 4 characters were processed
        }
    }

    return -1;
}


const findSplit = (sfNumber) => {
    let i, symbol, depth;
    depth = 0;
    for (i = 0; i < sfNumber.length; i++) {
        symbol = sfNumber[i];
        if (symbol === '[') {
            depth++;
        } else if (symbol === ']') {
            depth--;
        }

        // split if regular number too high
        if (isNumber(symbol) && symbol > 9) {
            return i;
        }

    }

    return -1;
}

const convertToString = (sfNumber, highlightFrom, highlightTo) => {
    const buffer = [];
    let symbol, nextSymbol, doHighlight;
    for (let i=0, j=1; i<sfNumber.length; i++, j++) {
        doHighlight = false;
        if (i>=highlightFrom && i<=highlightTo) {
            doHighlight = true;
        }

        symbol = sfNumber[i];

        if (doHighlight) {
            buffer.push(chalk.whiteBright(symbol));
        } else {
            buffer.push(symbol);
        }

        if (j === sfNumber.length) {
            // reached last symbol
            break;
        }

        nextSymbol = sfNumber[j];
        if (
            isNumber(symbol) && isNumber(nextSymbol) ||    // i and j numbers -> comma in between
            isNumber(symbol) && nextSymbol === '['   ||    // i number and j group
            symbol === ']' && nextSymbol === '['     ||    // place comma in between two groups
            symbol === ']' && isNumber(nextSymbol)         // i group, j number
        ) {
            if (doHighlight) {
                buffer.push(chalk.whiteBright(','));
            } else {
                buffer.push(',');
            }
        }
    }

    return buffer.join('');
}


class BaseElement {
    magnitude() {
        return 0
    }

    toString() {
        return '';
    }
}

class RegularNumber extends BaseElement {
    constructor(value) {
        super();
        this.index = 0;
        this.value = value;
    }

    magnitude() {
        return this.value;
    }

    toString() {
        return this.value;
    }
}

class Pair  extends BaseElement {
    constructor() {
        super();
        this.left = null;
        this.right = null;
    }

    magnitude() {
        return (3 * this.left.magnitude()) + (2 * this.right.magnitude());
    }

    fromString(str) {
        let content = str.substring(1, str.length - 1); // remove outer brackets
        let firstPart = parseInt(content, 10);
        if (isNaN(firstPart)) {
            // first element is a pair
            this.left = new Pair();
            this.left.fromString(content);
        } else {
            this.left = new RegularNumber(firstPart);
        }

        // remove first part from input string
        content = content.replace(this.left + ',', '');

        let secondPart = parseInt(content, 10);
        if (isNaN(secondPart)) {
            // first element is a pair
            this.right = new Pair();
            this.right.fromString(content);
        } else {
            this.right = new RegularNumber(secondPart);
        }
    }

    toString() {
        return '[' + this.left.toString() + ',' + this.right.toString() + ']';
    }
}

const addReduceMag = (input) => {
    let i, sfNumber, sfSum = undefined;
    for (i = 0; i < input.length; i++) {
        let j, symbol, depth = 0;
        sfNumber = parseSnailfishNumber(input[i]);
        sfNumber = reduce(sfNumber);  // reduce input
        // now, sfNumber is reduced
        if (i === 0) {
            sfSum = sfNumber;
        }
        if (i > 0) {
            sfSum = add(sfSum, sfNumber);
            debug('add:     '+convertToString(sfSum));
            sfSum = reduce(sfSum);  // reduce after adding!
        }
        debug('sfSum:   '+convertToString(sfSum));
    }

    // get magnitude
    const sfSumAsString = convertToString(sfSum)
    const rootNode = new Pair();
    rootNode.fromString(sfSumAsString);

    return rootNode.magnitude();
}

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    return addReduceMag(input);
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);

    // if (input.length>20) return 0;

    const magnitudes = [];
    let i,j;
    for (i = 0; i < input.length; i++) {
        for (j = 0; j < input.length; j++) {
            if (i==j) continue;
            let mag = addReduceMag([input[i], input[j]])
            // console.log(input[i] + ' + ' + input[j], mag);
            magnitudes.push(mag);
        }
    }
    debug(magnitudes);

    return Math.max.apply(Math, magnitudes);
};

run({
    part1: {
        tests: [
            /***
             * tests for add/reduce
             */
            /*
            {input: `[1,1]`, expected: "[1,1]"},                                // parse
            {input: `[[1,2],3]`, expected: "[[1,2],3]"},                        // parse
            {input: `[1,[2,3]]`, expected: "[1,[2,3]]"},                        // parse
            {input: `[[1,2],[3,4]]`, expected: "[[1,2],[3,4]]"},                // parse
            {input: `[[1,[5,6]],[3,4]]`, expected: "[[1,[5,6]],[3,4]]"},        // parse
            {input: `[[[[[9,8],1],2],3],4]`, expected: "[[[[0,9],2],3],4]"},    // explode
            {input: `[7,[6,[5,[4,[3,2]]]]]`, expected: "[7,[6,[5,[7,0]]]]"}, // explode
            {input: `[[6,[5,[4,[3,2]]]],1]`, expected: "[[6,[5,[7,0]]],3]"}, // explode
            {input: `[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]`, expected: "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"}, // explode
            {input: `[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]`, expected: "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"}, // explode
            {input: `[10,1]`, expected: "[[5,5],1]"}, // split
            {input: `[11,1]`, expected: "[[5,6],1]"}, // split
            {input: `[1,17]`, expected: "[1,[8,9]]"}, // split
            // // add
            {
                input: `[1,1]
                [2,2]
                [3,3]
                [4,4]`,
                expected: "[[[[1,1],[2,2]],[3,3]],[4,4]]"
            },
            {
                input: `[1,1]
                [2,2]
                [3,3]
                [4,4]
                [5,5]`,
                expected: "[[[[3,0],[5,3]],[4,4]],[5,5]]"
            },
            {
                input: `[1,1]
                [2,2]
                [3,3]
                [4,4]
                [5,5]
                [6,6]`,
                expected: "[[[[5,0],[7,4]],[5,5]],[6,6]]"
            },
            {
                input: `[1,1]
                [2,2]
                [3,3]
                [4,4]
                [5,5]
                [6,6]
                [7,7]`,
                expected: "[[[[7,0],[9,5]],[6,6]],[7,7]]"
            },
            {
                input: `[1,1]
                [2,2]
                [3,3]
                [4,4]
                [5,5]
                [6,6]
                [7,7]
                [8,8]`,
                expected: "[[[[9,5],[6,0]],[[6,7],7]],[8,8]]"
            },
            {
                input: `[1,1]
                [2,2]
                [3,3]
                [4,4]
                [5,5]
                [6,6]
                [7,7]
                [8,8]
                [9,9]`,
                expected: "[[[[6,6],[0,7]],[[7,8],8]],[9,9]]"
            },
            {
                input: `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
                        [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]`,
                expected: "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]"
            },
            {
                input: `[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]
                        [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]`,
                expected: "[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]"
            },
            {
                input: `[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]
                        [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]`,
                expected: "[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]"
            },
            {
                input: `[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]
                        [7,[5,[[3,8],[1,4]]]]`,
                expected: "[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]"
            },
            {
                input: `[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]
                        [[2,[2,2]],[8,[8,1]]]`,
                expected: "[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]"
            },
            {
                input: `[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]
                        [2,9]`,
                expected: "[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]"
            },
            {
                input: `[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]
                        [1,[[[9,3],9],[[9,0],[0,7]]]]`,
                expected: "[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]"
            },
            {
                input: `[[[[7,8],[6,7]],[[6,8],[0,8]]],[[[7,7],[5,0]],[[5,5],[5,6]]]]
                        [[[5,[7,4]],7],1]`,
                expected: "[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]"
            },
            {
                input: `[[[[7,7],[7,7]],[[8,7],[8,7]]],[[[7,0],[7,7]],9]]
                        [[[[4,2],2],6],[8,7]]`,
                expected: "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"
            },
            {
                input: `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
                        [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
                        [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
                        [[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
                        [7,[5,[[3,8],[1,4]]]]
                        [[2,[2,2]],[8,[8,1]]]
                        [2,9]
                        [1,[[[9,3],9],[[9,0],[0,7]]]]
                        [[[5,[7,4]],7],1]
                        [[[[4,2],2],6],[8,7]]`,
                expected: "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"
            },
            {
                input: `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
                        [[[5,[2,8]],4],[5,[[9,9],0]]]
                        [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
                        [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
                        [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
                        [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
                        [[[[5,4],[7,7]],8],[[8,3],8]]
                        [[9,3],[[9,9],[6,[4,9]]]]
                        [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
                        [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`,
                expected: "[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]"
            },
            */

            /**
             * Tests for magnitude
             */

            {
                input: `[1,1]`,
                expected: 5
            },
            {
                input: `[2,2]`,
                expected: 10
            },
            {
                input: `[3,3]`,
                expected: 15
            },
            {
                input: `[4,4]`,
                expected: 20
            },
            {
                input: `[5,5]`,
                expected: 25
            },
            {
                input: `[1,1]
                [2,2]`,
                expected: 35
            },
            {
                input: `[1,1]
                [2,2]
                [3,3]
                [4,4]`,
                expected: 445
            },
            {
                input: `[[1,2],[[3,4],5]]`,
                expected: 143
            },
            {
                input: `[[[[0,7],4],[[7,8],[6,0]]],[8,1]]`,
                expected: 1384
            },
            {
                input: `[[[[1,1],[2,2]],[3,3]],[4,4]]`,
                expected: 445
            },
            {
                input: `[[[[3,0],[5,3]],[4,4]],[5,5]]`,
                expected: 791
            },
            {
                input: `[[[[5,0],[7,4]],[5,5]],[6,6]]`,
                expected: 1137
            },
            {
                input: `[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]`,
                expected: 3488
            },
            {
                input: `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
                        [[[5,[2,8]],4],[5,[[9,9],0]]]
                        [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
                        [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
                        [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
                        [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
                        [[[[5,4],[7,7]],8],[[8,3],8]]
                        [[9,3],[[9,9],[6,[4,9]]]]
                        [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
                        [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`,
                expected: 4140
            },

        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
                        [[[5,[2,8]],4],[5,[[9,9],0]]]
                        [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
                        [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
                        [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
                        [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
                        [[[[5,4],[7,7]],8],[[8,3],8]]
                        [[9,3],[[9,9],[6,[4,9]]]]
                        [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
                        [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`,
                expected: 3993
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
