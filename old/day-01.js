const input = require('./input-day-01.js');
const colors = require('./colors.js');

const testinput = `199
200
208
210
200
207
240
269
260
263`;




// convert to ints
let data = input.data.map(s => parseInt(s,10));
//let data = testinput.split('\n').map(s => parseInt(s,10));

console.log(data);

// Part I
let result1 = 0;
for (var i=1; i<data.length; i++) {
	console.log(data[i-1], data[i]);
	if (data[i] > data[i-1]) {
		result1++;
	}
}
console.log(result1);

// Part II
console.log('Part II *************');
let windowsList = [];
for (var i=1; i < data.length-1; i++) {
	windowsList.push(data[i-1] + data[i] + data[i+1]);
}
console.log(windowsList);

let result2 = 0;
for (var i=1; i<windowsList.length; i++) {
	console.log(windowsList[i-1], windowsList[i]);
	if (windowsList[i] > windowsList[i-1]) {
		result2++;
	}
}
console.log(result2);









function print(value, depth) {
	const prefix = ' '.repeat(depth||0);
	console.log(prefix + value);
}

function log(value, depth) {
	const prefix = ' '.repeat(depth||0);
	console.log(prefix + colors.FgRed + value + colors.Reset);
}
