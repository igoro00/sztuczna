import fs from 'node:fs/promises';
import path from 'node:path';

import { globSync } from 'glob';

import { Algorithms } from './algos';
import {
  Algorithm,
  AlgorithmFunc,
  Direction,
  Heuristic,
} from './types';

const algo = process.argv[2] as Algorithm;
const permutation = (process.argv[3]??"RDUL").split("") as Direction[];
const algorithms: Algorithm[] = ["bfs", "astr", "dfs"];
const heuristics: Heuristic[] = ["manh", "hamm"];

if (!algorithms.includes(algo)) {
  throw new Error("Invalid algorithm");
}
if (algo !== "astr") {
  if(!permutation.every((move) => move.match(/[LRUD]/))) {
    throw new Error("Invalid permutation");
  }
  if(permutation.length !== 4){
    throw new Error("Invalid permutation");
  }
}

async function createOutputFiles(
  file: string,
  algo: Algorithm,
  permutation: Direction[],
  heuristic: Heuristic,
  out: Awaited<ReturnType<AlgorithmFunc>>
) {
  let parameter = "";
  if (algo === "astr") {
    parameter = heuristic;
  } else {
    parameter = permutation.join("").toLowerCase();
  }
  const filename = path.parse(path.basename(file)).name;
  const solFileName = `solutions/${filename}_${algo}_${parameter}_sol.txt`;
  const statsFileName = `stats/${filename}_${algo}_${parameter}_stats.txt`;
  // create files
  const solContent =
    typeof out.solution === "number"
      ? out.solution.toString()
      : out.solution.join("");

  let statsContent = "";
  if (typeof out.solution === "number") {
    statsContent += out.solution.toString();
  } else {
    statsContent += out.solution.length;
  }
  statsContent += "\n";

  statsContent += out.odwiedzone.toString() + "\n";
  statsContent += out.przetworzone.toString() + "\n";
  statsContent += out.maxDepth.toString() + "\n";
  statsContent += out.time.toFixed(3) + "\n";
  await Promise.all([
    fs.writeFile(solFileName, solContent),
    fs.writeFile(statsFileName, statsContent),
  ]);
}

async function main() {
  const files = globSync("./puzzle/*.txt");

  for (let i = 0; i < files.length; i++) {
    if(algo === "dfs"){
      console.log("DFS", permutation.join(""), i+1, " out of ", files.length);
    }
    const fileContent = await fs.readFile(files[i], "utf-8");
    const inputFile = fileContent.split("\n");

    const size = {
      x: parseInt(inputFile[0].split(" ")[0]),
      y: parseInt(inputFile[0].split(" ")[1]),
    };

    const p = inputFile
      .slice(1, -1)
      .map((elem) => elem.split(" "))
      .flat()
      .map((elem) => parseInt(elem));

      if (algo === "astr") {
        for (const heuristic of heuristics) {
          const out = await Algorithms[algo](
            p,
            size,
            permutation,
            heuristic
          );
          await createOutputFiles(
            files[i],
            algo,
            permutation,
            heuristic,
            out
          );
        }
      } else {
        const out = await Algorithms[algo](
          p,
          size,
          permutation,
          heuristics[0]
        );
        await createOutputFiles(
          files[i],
          algo,
          permutation,
          heuristics[0],
          out
        );
    }
  }
}

main().catch(console.error);
