import run from "aocrunner";

const parseInput = (rawInput) => rawInput
  .split('\n')
  .map(l => Number(l.split(': ')[1]));


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
    this.position = position;
    this.scoresAtPositions = {};
  }

  turn(dice) {
    const go = dice.roll() + dice.roll() + dice.roll();
    this.position = move(this.position, go);
    this.score += this.position;
  }
}

function move(position, roll) {
  let newPos = position + roll;
  while (newPos > 10) {
    newPos -= 10;
  }
  return newPos;
}


const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  const dice = new deterministicDice();
  const player1 = new Player('1', input[0]);
  const player2 = new Player('2', input[1]);

  let i = 0;
  let loser = null;
  while (i <= 1000) {
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

/*

Possible throws in one round (3*3*3 = 27):
 3 4 5  4 5 6  5 6 7
 4 5 6  5 6 7  6 7 8
 5 6 7  6 7 8  7 8 9

classes:
 3 => 1
 4 => 3
 5 => 6
 6 => 7
 7 => 6
 8 => 3
 9 => 1
*/


const winnerScore = 21;

function quantumTurn(realities) {
  const rollsRealities = [
    { roll: 3, realities: 1 },
    { roll: 4, realities: 3 },
    { roll: 5, realities: 6 },
    { roll: 6, realities: 7 },
    { roll: 7, realities: 6 },
    { roll: 8, realities: 3 },
    { roll: 9, realities: 1 },
  ];

  // datastructure to store: [position/score for both players], plus total count of equal realities
  // {  pos1_score1|pos2_score2:realities }

  const newRealities = {};
  let data, rollPlayer1, rollPlayer2, posPlayer1, posPlayer2, scorePlayer1, scorePlayer2, turnRealities;
  for (let i = 0; i < rollsRealities.length; i++) {
    rollPlayer1 = rollsRealities[i].roll;
    for (let j = 0; j < rollsRealities.length; j++) {
      rollPlayer2 = rollsRealities[j].roll;
      // 27 x 27 realities in sum. 

      turnRealities = rollsRealities[i].realities + rollsRealities[j].realities;
      for (const k of Object.keys(realities)) {
        data = k.split('|').map(player => player.split('_').map(Number)); // data[0] is player1, data[1] is player2
        // data[0][0] is player1/position
        // data[0][1] is player1/score
        // realities[k] = amount of realities for that combination
        if (data[0][1] >= winnerScore || data[1][1] >= winnerScore) {
          // this game is won already and is not played on
          newRealities[k] = realities[k];
        } else {
          posPlayer1 = move(data[0][0], rollPlayer1);
          posPlayer2 = move(data[1][0], rollPlayer2);
          scorePlayer1 = data[0][1] + posPlayer1;
          scorePlayer2 = data[1][1] + posPlayer2;
  
          newRealities[posPlayer1 + '_' + scorePlayer1 + '|' + posPlayer2 + '_' + scorePlayer2] = realities[k] + turnRealities;
          }
      }
    }
  }

  return newRealities;
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput);


  const genesisReality = {};
  genesisReality[input[0] + '_0|' + input[1] + '_0'] = 0;
  let lowestScore = 0;
  let realities = quantumTurn(genesisReality);
  let data;
  while (lowestScore <= winnerScore) {
    lowestScore = winnerScore * 2;
    realities = quantumTurn(realities);
    for (const k of Object.keys(realities)) {
      data = k.split('|').map(player => player.split('_').map(Number)); // data[0] is player1, data[1] is player2
      if (data[0][1] < winnerScore && data[1][1] < winnerScore) {
        // only consider games that are ongoing
        lowestScore = Math.min(lowestScore, data[0][1], data[1][1]);
      }
    }
    console.log({ lowestScore, l: Object.keys(realities).length });
  }

  let p1Wins = 0;
  let p2Wins = 0;
  for (const k of Object.keys(realities)) {
    data = k.split('|').map(player => player.split('_').map(Number)); // data[0] is player1, data[1] is player2
    if (data[0][1] > 21) {
      p1Wins += realities[k];
    } else if (data[1][1] > 21) {
      p2Wins += realities[k];
    }
  }
  console.log({ p1Wins, p2Wins, l:Object.keys(realities).length });

  return Math.max(p1Wins, p2Wins);
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
      {
        input: `Player 1 starting position: 4
      Player 2 starting position: 8`, expected: 444356092776315
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
