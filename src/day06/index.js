import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split(',').map(Number);


// decrease ticks in input from back to front, add new timers to the right end
const step = (input) => {
  const output = [];

  let timer;
  for (let i=input.length - 1; i>=0; i--) {
    timer = input[i];

    if (timer > 0) {
      timer--;
    } else {
      timer = 6;
      output.push(8)
    }
    output.unshift(timer)
  }

  return output;
}

const part1 = (rawInput) => {
  let input = parseInput(rawInput);

  const days = 80;

  for(let i=0; i<days; i++) {
    input = step(input);
    (i%10 === 0)
      ? process.stdout.write('|')
      : process.stdout.write('.');
  }

  return input.length;
};



const initStates = () => {
  const states = {};
  for(let i=0; i<9; i++) {
    states[i] = 0;
  }

  return states;
}

const getStates = (input) => {
  const states = initStates();
  // meta data for fish per state
  for (let i=0; i<input.length; i++) {
    states[input[i]] = states[input[i]]+1;
  }

  return states;
}

const fastStep = (input) => {
  const states = initStates();
  for(let i=0; i<9; i++) {
    if (i === 0 ) {
      states[8] = input[i]; // add all new ones
      states[6] = input[i]; // reset cycle for zeros
    } else {
      states[i-1] += input[i];  // add to default (all 7s will increase already set 6s)
    }
  }

  return states;
}

const sumUp = (states) => {
  let sum = 0;
  //console.log(states)
  for(let i=0; i<9; i++) {
    sum += states[i];
  }

  return sum;
}

const part1Fast = (rawInput) => {
  let input = parseInput(rawInput);

  const days = 80;
  let states = getStates(input);

  for(let i=0; i<days; i++) {
    states = fastStep(states);
  }

  return sumUp(states);
};

const part2 = (rawInput) => {
  let input = parseInput(rawInput);

  const days = 256;
  let states = getStates(input);

  for(let i=0; i<days; i++) {
    states = fastStep(states);
  }

  return sumUp(states);
};

run({
  part1: {
    tests: [
      { input: `3,4,3,1,2`, expected: 5934 },
    ],
    solution: part1Fast,
  },
  part2: {
    tests: [
      { input: `3,4,3,1,2`, expected: 26984457539 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false
});
