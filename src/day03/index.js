import run from "aocrunner";

const parseInput = (rawInput) => rawInput.split('\n').map(s=>s.trim());

const part1 = (rawInput) => {
  const input = parseInput(rawInput);

  let digits;
  let oneCounter = input[0].split('').map(s=>0);
  for(var i=0; i< input.length; i++) {
    digits = input[i].split('').map(Number);
    digits.forEach((d,j)=>d && oneCounter[j]++);
  }
  const epsilonRate = oneCounter.map((cnt,i) => cnt>input.length/2 ? 1 : 0);
  const gammaRate = epsilonRate.map(d=>1-d);

  return parseInt(epsilonRate.join(''), 2) * parseInt(gammaRate.join(''), 2);
};

const part2 = (rawInput) => {
  const input = parseInput(rawInput).map(n=>n.split('').map(Number));
  const digitsLength = input[0].length;

  let listO = [...input];
  let listCO2 = [...input];
  let digitsO, digitsCO2, filterDigit;

  // for each digit
  for(var i=0; i< digitsLength; i++) {
    digitsO = [0, 0];
    digitsCO2 = [0, 0];
    
    listO.forEach(n=>digitsO[n[i]]++);
    listCO2.forEach(n=>digitsCO2[n[i]]++);

    //  most common value, if 0 and 1 are equally common, keep values with a 1
    if (listO.length > 1) {
      filterDigit = listO[0] > listO[1] ? 0 : 1;
      listO = listO.filter(n => n[i] === filterDigit);
    }

    // least common value, if 0 and 1 are equally common, keep values with a 0
    if (listCO2.length > 1) {
      filterDigit = digitsCO2[0] <= digitsCO2[1] ? 0 : 1;
      listCO2 = listCO2.filter(n => n[i] === filterDigit);
    }
  }
console.log(parseInt(listO[0].join(''), 2), parseInt(listCO2[0].join(''), 2));
  return parseInt(listO[0].join(''), 2) * parseInt(listCO2[0].join(''), 2);
};

run({
  part1: {
    tests: [
      { input: `00100
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
      01010`, expected: 198 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `00100
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
      01010`, expected: 230 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
