import fs from 'node:fs/promises';

import { globSync } from 'glob';

import { dfs } from './dfs';
import { Direction } from './Plansza';

const permutation: Direction[] = ["R","D","U","L"];

async function main() {
  const files = globSync('./puzzle/*.txt');
  
  for (let i = 0; i < files.length; i++) {
    const fileContent = await fs.readFile(files[i], 'utf-8');
    const inputFile = fileContent.split("\n");
    
    const size = {
      x: parseInt(inputFile[0].split(" ")[0]),
      y: parseInt(inputFile[0].split(" ")[1])
    };
    
    const p = inputFile
      .slice(1, -1)
      .map(elem => elem.split(" "))
      .flat()
      .map(elem => parseInt(elem));

    // console.log(bfs(p,size,permutation))
    dfs(p, size, permutation);
    console.log(i+1, "of", files.length);
  }
}

main().catch(console.error);