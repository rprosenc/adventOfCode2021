import run from "aocrunner";
import chalk from 'chalk';

const parseInput = (rawInput) => rawInput.split('');

const binary = (input) => {
    return input.map(h => parseInt(h, 16).toString(2).padStart(4, '0'))
        .join('').split('');
}

function typeName(id) {
    return id === 4 ? 'literal' : 'operator';
}

function getPackage(stream) {
    // first 3 bits
    const length = stream.length;
    const versionBinary = stream.shift() + stream.shift() + stream.shift()
    const version = parseInt(versionBinary, 2);
    const typeIdBinary = stream.shift() + stream.shift() + stream.shift();
    const typeId = parseInt(typeIdBinary, 2);
    let literal = null;
    let literalBinary = null;
    let lengthTypeId;
    const subPackets = [];
    const numberOfPackets = [];
    const subPacketsLength = [];

    if (typeId === 4) {
        // literal value
        let b = 1, d = [];
        while (b) {
            b = Number(stream.shift());
            d.push(stream.shift());
            d.push(stream.shift());
            d.push(stream.shift());
            d.push(stream.shift());
        }
        // nothing to do with it
        literalBinary = d.join('');
        literal = parseInt(literalBinary, 2);
    } else {
        // operator
        let n;
        lengthTypeId = Number(stream.shift());
        if (lengthTypeId) {
            for (let i = 0; i < 11; i++) {
                numberOfPackets.push(stream.shift());
            }
            n = parseInt(numberOfPackets.join(''), 2);
            for (let i = 0; i < n; i++) {
                if (stream.length > 6) {
                    subPackets.push(getPackage(stream));
                }
            }
        } else {
            for (let i = 0; i < 15; i++) {
                subPacketsLength.push(stream.shift());
            }
            n = parseInt(subPacketsLength.join(''), 2);

            const newStream = [];
            for (let i = 0; i < n; i++) {
                newStream.push(stream.shift());
            }
            if (newStream.length > 6) {
                subPackets.push(getPackage(newStream));
            }
            if (newStream.length > 6) {
                subPackets.push(getPackage(newStream));
            }
        }
    }

    return {
        length,
        version,
        versionBinary,
        typeId,
        typeIdBinary,
        type: typeName(typeId),
        lengthTypeId,
        literal,
        literalBinary,
        subPackets,
        numberOfPackets: numberOfPackets.join(''),
        subPacketsLength: subPacketsLength.join(''),
        remainingStream: stream.join(''),
    };


}

const addUp = (packet) => {
    let sum = packet.version;
    for (let i = 0; i < packet.subPackets.length; i++) {
        sum += addUp(packet.subPackets[i]);
    }

    return sum;
}

const versionColor = p => chalk.hex('#FFA500')(p.versionBinary);

const typeIdColor = p => (p.typeId==4 ? chalk.hex('#0099FF') : chalk.hex('#00FF99'))(p.typeIdBinary);

const typeColor = p => (p.typeId==4 ? chalk.hex('#8888BB') : chalk.hex('#88BB88'))(p.type);

const lengthTypeIdColor = (p) => {
    if (p.lengthTypeId === 0) return chalk.hex('#00FF00')(p.lengthTypeId);
    if (p.lengthTypeId === 1) return chalk.hex('#009933')(p.lengthTypeId);
    return '';
}

const literalColor = p => p.literal===null ? '' : chalk.hex('#0033FF')(p.literalBinary);

const numberOfPacketsColor = p => chalk.hex('#660000')(p.numberOfPackets);
const subPacketsLength = p => chalk.hex('#663300')(p.subPacketsLength);

const numberOfPacketsReadable = p => p.numberOfPackets.length && chalk.hex('#660000')(', packets: ' + parseInt(p.numberOfPackets,2)) || '';
const subPacketsLengthReadable = p => p.subPacketsLength.length && chalk.hex('#663300')(', plength: ' + parseInt(p.subPacketsLength, 2)) || '';

const lengthColor = p => chalk.hex('#666666')(', stream length:' + p.length);

const remainingStreamColor = p => p.remainingStream == 0 ? chalk.hex('#333333')(p.remainingStream) : '';

function print(packet, depth) {
    if (!depth) {
        depth = 0;
    }
    let buffer = ''.padStart(depth, ' ');
    buffer += versionColor(packet)
            + typeIdColor(packet)
            + lengthTypeIdColor(packet)
            + literalColor(packet)
            + numberOfPacketsColor(packet)
            + subPacketsLength(packet)
            + remainingStreamColor(packet)
            + '   ' + typeColor(packet)
            + numberOfPacketsReadable(packet)
            + subPacketsLengthReadable(packet)
            + lengthColor(packet) + '\n';

    for (let i = 0; i < packet.subPackets.length; i++) {
        buffer += print(packet.subPackets[i], depth+2);
    }

    return buffer;
}

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const stream = binary(input);
    const p = getPackage(stream);

    console.log(print(p, 1));
    //console.log({i: rawInput, sum: addUp(p)});
    return addUp(p);

    // 906 is too low!
};//
// falk brockerhoff
const part2 = (rawInput) => {
    const input = parseInput(rawInput);

    return;
};

run({
    part1: {
        tests: [
            {input: `D2FE28`, expected: 6},
            {input: `EE00D40C823060`, expected: 7 + 2 + 4 + 1},
            {input: `8A004A801A8002F478`, expected: 16},
            {input: `620080001611562C8802118E34`, expected: 12},
            {input: `C0015000016115A2E0802F182340`, expected: 23},
            {input: `A0016C880162017C3686B18A3D4780`, expected: 31},
        ],
        solution: part1,
    },
    part2: {
        tests: [
            // { input: ``, expected: "" },
        ],
        solution: part2,
    },
    trimTestInputs: true,
});
