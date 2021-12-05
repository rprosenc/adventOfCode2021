import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(s => parseInt(s,10));

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  let result = 0;
  for (var i=1; i<input.length; i++) {
    if (input[i] > input[i-1]) {
      result++;
    }
  }
  return result;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  let windowsList = [];
  for (var i=1; i < input.length-1; i++) {
    windowsList.push(input[i-1] + input[i] + input[i+1]);
  }

  let result = 0;
  for (var i=1; i<windowsList.length; i++) {
    if (windowsList[i] > windowsList[i-1]) {
      result++;
    }
  }

  return result;
};

run({
  part1: {
    tests: [
      { input: `199
      200
      208
      210
      200
      207
      240
      269
      260
      263`, expected: 7 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `199
      200
      208
      210
      200
      207
      240
      269
      260
      263`, expected: 5 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
