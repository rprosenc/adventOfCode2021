import run from "aocrunner";

const parseInput = (rawInput) => {
    const input = rawInput.split('\n\n');
    return {
        dots: input[0].split('\n').map(l=>l.split(',').map(Number)),
        folds: input[1].replaceAll('fold along ','').split('\n').map(l=>l.split('='))
    }
}


const print = (paper) => {
    for (let y = 0; y < paper.length; y++) {
        console.log(
            paper[y].map(f=>f?'██':'  ').join('')
        );
    }
}


const createPaper = dots => {
    const width = 1 + dots.map(c=>c[0]).sort((a,b)=>a<b?-1:1).pop();
    const height = 1 + dots.map(c=>c[1]).sort((a,b)=>a<b?-1:1).pop();
    const paper = [];
    for (let y = 0; y < height; y++) {
        paper[y] = Array(width).fill(false, 0, width);;
    }

    return paper;
}

const fillDots = (paper, dots) => {
    let x,y;
    for (let i = 0; i < dots.length; i++) {
        x = dots[i][0];
        y = dots[i][1];
        paper[y][x] = true;
    }

    return paper;
}

const foldPaper = (paper, fold) => {
    const foldDirection = fold[0];
    const foldLength = Number(fold[1]);
    const foldedPaper = [];
    if (foldDirection === 'y') {
        // horizontal fold
        const bottomHeight = paper.length - foldLength;

        for (let y = 0; y < foldLength; y++) {
            foldedPaper[y] = [...paper[y]]; // copy first half
        }
        // mirror bottom
        for (let y = foldLength-1; y >= 0; y--) {
            let y2 = foldLength+(foldLength-y);
            if (paper.length > y2) {
                for (let x = 0; x < paper[y2].length; x++) {
                    foldedPaper[y][x] |= paper[y2][x];
                }
            }
        }
    }

    if (foldDirection === 'x') {
        // horizontal fold
        const rightWidth = paper[0].length - foldLength;

        for (let y = 0; y < paper.length; y++) {
            foldedPaper[y] = [];
            for (let x = 0; x < foldLength; x++) {
                foldedPaper[y][x] = paper[y][x]; // copy first half
            }
        }
        // mirror right
        for (let y = 0; y < paper.length; y++) {
            for (let x = foldLength-1; x >= 0; x--) {
                let x2 = foldLength+(foldLength-x);
                foldedPaper[y][x] |= paper[y][x2];
            }
        }
    }

    return foldedPaper;
}

const count = (paper) => {
    return paper.map(
        line => line.map(b=>b?1:0).reduce((a,b)=>a+b)
    ).reduce((a,b)=>a+b);
}

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const paper = createPaper(input.dots);
    fillDots(paper, input.dots);

    const foldedPaper = foldPaper(paper, input.folds[0]);

    //print(foldedPaper);

    return count(foldedPaper);
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const paper = createPaper(input.dots);
    fillDots(paper, input.dots);

    let foldedPaper = foldPaper(paper, input.folds[0]);
    for (let i = 1; i < input.folds.length; i++) {
        foldedPaper = foldPaper(foldedPaper, input.folds[i]);
    }


    print(foldedPaper);

    return 'UFRZKAUZ';
};

run({
    part1: {
        tests: [
            { input: `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`, expected: 17 },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            { input: `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`, expected: 17 },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
