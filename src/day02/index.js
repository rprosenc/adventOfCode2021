import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(s=>s.trim());

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  let depth = 0;
  let position = 0;
  let command, value;
  for(var i=0; i<input.length; i++) {
    [command, value] = input[i].split(' ');
    if (command === 'forward') {
      position += Number(value);
    }
    if (command === 'down') {
      depth += Number(value);
    }
    if (command === 'up') {
      depth -= Number(value);
    }
  }
  return depth * position;
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  let aim = 0;
  let depth = 0;
  let position = 0;
  let command, value;
  for(var i=0; i<input.length; i++) {
    [command, value] = input[i].split(' ');
    value = Number(value);
    if (command === 'forward') {
      position += value;
      depth += aim * value;
    }
    if (command === 'down') {
      aim += value;
    }
    if (command === 'up') {
      aim -= value;
    }
  }

  console.log({depth, position})

  return depth * position;
};

run({
  part1: {
    tests: [
      { input: `forward 5
      down 5
      forward 8
      up 3
      down 8
      forward 2`, expected: 150 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `forward 5
      down 5
      forward 8
      up 3
      down 8
      forward 2`, expected: 900 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
