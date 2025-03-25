import { bfs } from './algos/bfs';
import { Direction } from './types';

const algo = process.argv[2];
const permutation = process.argv[3].split("") as Direction[];
const inputFilename = process.argv[4];
const outputFilename = process.argv[5];
const statsFilename = process.argv[6];

const inputFile = (await Bun.file(inputFilename).text()).split("\n")
const size = {
    x: parseInt(inputFile[0].split(" ")[0]),
    y: parseInt(inputFile[0].split(" ")[1])
}
const p = inputFile
    .slice(1, -1)
    .map(elem=>elem.split(" "))
    .flat()
    .map(elem=>parseInt(elem));

console.log(bfs(p,size,permutation))
