const input = require('./input-day-.js');
const colors = require('./colors.js');

function print(value, depth) {
	const prefix = ' '.repeat(depth||0);
	console.log(prefix + value);
}

function log(value, depth) {
	const prefix = ' '.repeat(depth||0);
	console.log(prefix + colors.FgRed + value + colors.Reset);
}
