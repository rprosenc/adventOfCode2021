import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(l => l.split(': ')[1]);


class deterministicDice {
  constructor() {
    this.value = 0;
    this.rolls = 0;
  }

  roll() {
    this.rolls++;
    this.value++;
    //console.log('roll: ' + this.value);
    return this.value;
  }
}

class Player {
  constructor(name, position) {
    this.name = name;
    this.score = 0;
    this.position = Number(position);
  }

  turn(dice) {
    const go = dice.roll() + dice.roll() + dice.roll();
    //console.log('player go: ' + go + ' from ' + this.position);
    this.position += (go % 10);

    if (this.position > 10) {
      this.position -= 10;
    }
    this.score += this.position;
  }
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const dice = new deterministicDice();
  const player1 = new Player('1', input[0]);
  const player2 = new Player('2', input[1]);

  let i = 0;
  let loser = null;
  while (i<=1000) {
    i++;
    player1.turn(dice);
    if (player1.score >= 1000) {
      loser = player2;
      break;
    }
    player2.turn(dice);
    if (player2.score >= 1000) {
      loser = player1;
      break;
    }
  }

  return loser.score * dice.rolls;
};


// i.e. (1,1,5,10,{p1:0,p2:20})
function rollQuantumDie(position1, score1, position2, score2, wins) {
  
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `Player 1 starting position: 4
      Player 2 starting position: 8`, expected: 739785
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `Player 1 starting position: 4
      Player 2 starting position: 8`, expected: 444356092776315 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
