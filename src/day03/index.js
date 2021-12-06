import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split("\n").map((s) => s.trim()).map((n) => n.split("").map(Number));

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  let digits;
  let oneCounter = input[0].map((s) => 0);
  for (var i = 0; i < input.length; i++) {
    digits = input[i];
    digits.forEach((d, j) => d && oneCounter[j]++);
  }
  const epsilonRate = oneCounter.map((cnt, i) =>
    cnt > input.length / 2 ? 1 : 0,
  );
  const gammaRate = epsilonRate.map((d) => 1 - d);

  return parseInt(epsilonRate.join(""), 2) * parseInt(gammaRate.join(""), 2);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);
  const digitsLength = input[0].length;

  let listGen = [...input];
  let listScrub = [...input];
  let digitsGen, digitsScrub, filterDigit, d;

  // for each digit
  for (let i = 0; i < digitsLength; i++) {
    digitsGen = [0, 0];
    digitsScrub = [0, 0];
    listGen.forEach((n) => digitsGen[n[i]]++);
    listScrub.forEach((n) => digitsScrub[n[i]]++);

    //  most common value, if 0 and 1 are equally common, keep values with a 1
    if (listGen.length > 1) {
      filterDigit = digitsGen[0] > digitsGen[1] ? 0 : 1;
      d = filterDigit;
      listGen = listGen.filter((n) => n[i] === filterDigit);
    }

    // least common value, if 0 and 1 are equally common, keep values with a 0
    if (listScrub.length > 1) {
      filterDigit = digitsScrub[0] <= digitsScrub[1] ? 0 : 1;
      listScrub = listScrub.filter((n) => n[i] === filterDigit);
    }

    // console.log({i, d,
    //   digitsGen, digitsScrub,
    //   sumGen: digitsGen[0]+digitsGen[1], sumScrub: digitsScrub[0]+digitsScrub[1],
    //   listGenLength: listGen.length,
    //   listScrubLength: listScrub.length
    // });
  }

  // exit;
  const genRate = parseInt(listGen[0].join(""), 2);
  const scrubbingRate = parseInt(listScrub[0].join(""), 2);
  return genRate * scrubbingRate;
};

run({
  part1: {
    tests: [
      {
        input: `00100
      11110
      10110
      10111
      10101
      01111
      00111
      11100
      10000
      11001
      00010
      01010`,
        expected: 198,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `00100
      11110
      10110
      10111
      10101
      01111
      00111
      11100
      10000
      11001
      00010
      01010`,
        expected: 230,
      },{
        input: `00001
      10001  
      11111`,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true
});
