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
            // lengthTypeId === 1 -> next 11 digits tell the number of packets
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
            // lengthTypeId === 0 -> next 15 digits tell the number of digits
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
    //console.log('add version: '+packet.version);
    let sum = packet.version;
    for (let i = 0; i < packet.subPackets.length; i++) {
        sum += addUp(packet.subPackets[i]);
    }

    return sum;
}

const versionColor = p => chalk.hex('#FFA500')(p.versionBinary + '('+p.version+')');

const typeIdColor = p => (p.typeId===4 ? chalk.hex('#0099FF') : chalk.hex('#00FF99'))(p.typeIdBinary);

const typeColor = p => (p.typeId===4 ? chalk.hex('#8888BB') : chalk.hex('#88BB88'))(p.type);

const lengthTypeIdColor = (p) => {
    if (p.lengthTypeId === 0) return chalk.hex('#666666')(p.lengthTypeId);
    if (p.lengthTypeId === 1) return chalk.hex('#666666')(p.lengthTypeId);
    return '';
}

const literalColor = p => p.literal===null ? '' : chalk.hex('#0033FF')(p.literalBinary + ' ('+p.literal+')');

const numberOfPacketsColor = p => chalk.hex('#660000')(p.numberOfPackets);
const subPacketsLength = p => chalk.hex('#663300')(p.subPacketsLength);

const numberOfPacketsReadable = p => p.numberOfPackets.length && chalk.hex('#660000')(', packets: ' + parseInt(p.numberOfPackets,2)) || '';
const subPacketsLengthReadable = p => p.subPacketsLength.length && chalk.hex('#663300')(', length: ' + parseInt(p.subPacketsLength, 2)) || '';

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

const binary_step1 = (input) => {
    return input.map(h => parseInt(h, 16));
}
const binary_step2 = (input) => {
    return input.map(h => parseInt(h, 16).toString(2))

}
const binary_step3 = (input) => {
    return input.map(h => parseInt(h, 16).toString(2).padStart(4, '0'))

}
const binary_step4 = (input) => {
    return input.map(h => parseInt(h, 16).toString(2).padStart(4, '0'))
        .join('')
}
const binary_step5 = (input) => {
    return input.map(h => parseInt(h, 16).toString(2).padStart(4, '0'))
        .join('').split('');
}


const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const stream = binary(input);

    const [a,b,c,d,e] = [binary_step1(input),binary_step2(input),binary_step3(input),binary_step4(input),binary_step5(input)];
    const p = getPackage(e);
    const sum = addUp(p);
    console.log({rawInput, sum});
    console.log(print(p, 1));
    return sum;

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
            {input: `38006F45291200`, expected: 9},
            {input: `EE00D40C823060`, expected: 14},
            {input: `8A004A801A8002F478`, expected: 16},
            {input: `620080001611562C8802118E34`, expected: 12},
            {input: `C0015000016115A2E0802F182340`, expected: 23},
            {input: `A0016C880162017C3686B18A3D4780`, expected: 31},
            // {input: `420D4900B8F31EFE7BD9DA455401AB80021504A2745E1007A21C1C862801F54AD0765BE833D8B9F4CE8564B9BE6C5CC011E00D5C001098F11A232080391521E4799FC5BB3EE1A8C010A00AE256F4963B33391DEE57DA748F5DCC011D00461A4FDC823C900659387DA00A49F5226A54EC378615002A47B364921C201236803349B856119B34C76BD8FB50B6C266EACE400424883880513B62687F38A13BCBEF127782A600B7002A923D4F959A0C94F740A969D0B4C016D00540010B8B70E226080331961C411950F3004F001579BA884DD45A59B40005D8362011C7198C4D0A4B8F73F3348AE40183CC7C86C017997F9BC6A35C220001BD367D08080287914B984D9A46932699675006A702E4E3BCF9EA5EE32600ACBEADC1CD00466446644A6FBC82F9002B734331D261F08020192459B24937D9664200B427963801A094A41CE529075200D5F4013988529EF82CEFED3699F469C8717E6675466007FE67BE815C9E84E2F300257224B256139A9E73637700B6334C63719E71D689B5F91F7BFF9F6EE33D5D72BE210013BCC01882111E31980391423FC4920042E39C7282E4028480021111E1BC6310066374638B200085C2C8DB05540119D229323700924BE0F3F1B527D89E4DB14AD253BFC30C01391F815002A539BA9C4BADB80152692A012CDCF20F35FDF635A9CCC71F261A080356B00565674FBE4ACE9F7C95EC19080371A009025B59BE05E5B59BE04E69322310020724FD3832401D14B4A34D1FE80233578CD224B9181F4C729E97508C017E005F2569D1D92D894BFE76FAC4C5FDDBA990097B2FBF704B40111006A1FC43898200E419859079C00C7003900B8D1002100A49700340090A40216CC00F1002900688201775400A3002C8040B50035802CC60087CC00E1002A4F35815900903285B401AA880391E61144C0004363445583A200CC2C939D3D1A41C66EC40`,
            //     expected: 947},
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
