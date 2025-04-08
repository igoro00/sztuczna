import fs from "node:fs/promises";
import path from "node:path";

import { globSync } from "glob";

import { Algorithms } from "./algos";
import { Algorithm, AlgorithmFunc, Direction, Heuristic } from "./types";

const algo = process.argv[2] as Algorithm;
const permutation = (process.argv[3] ?? "RDUL").split("") as Direction[];
const algorithms: Algorithm[] = ["bfs", "astr", "dfs"];
const heuristics: Heuristic[] = ["manh", "hamm"];

// Walidacja wybranego algorytmu
if (!algorithms.includes(algo)) {
  throw new Error("Invalid algorithm");
}

// Walidacja permutacji dla algorytmów innych niż A*
if (algo !== "astr") {
  if (!permutation.every((move) => move.match(/[LRUD]/))) {
    throw new Error("Invalid permutation");
  }
  if (permutation.length !== 4) {
    throw new Error("Invalid permutation");
  }
}

/**
 * Tworzy pliki wyjściowe z rozwiązaniem i statystykami
 * @param file - Ścieżka do pliku wejściowego
 * @param algo - Wybrany algorytm
 * @param permutation - Kolejność ruchów
 * @param heuristic - Wybrana heurystyka
 * @param out - Wynik działania algorytmu
 */
async function createOutputFiles(
  file: string,
  algo: Algorithm,
  permutation: Direction[],
  heuristic: Heuristic,
  out: Awaited<ReturnType<AlgorithmFunc>>
) {
  let parameter = "";
  if (algo === "astr") {
    parameter = heuristic; // Dla A* używamy heurystyki jako parametru
  } else {
    parameter = permutation.join("").toLowerCase(); // Dla innych algorytmów używamy permutacji
  }
  // Generowanie nazw plików wyjściowych
  const filename = path.parse(path.basename(file)).name;
  const solFileName = `solutions/${filename}_${algo}_${parameter}_sol.txt`;
  const statsFileName = `stats/${filename}_${algo}_${parameter}_stats.txt`;
  // create files
  const solContent =
    typeof out.solution === "number"
      ? out.solution.toString() // Jeśli rozwiązanie to liczba, konwertujemy na string
      : out.solution.join(""); // Jeśli to tablica, łączymy elementy

  let statsContent = "";
  if (typeof out.solution === "number") {
    statsContent += out.solution.toString();
  } else {
    statsContent += out.solution.length; // Długość rozwiązania
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
    if (algo === "dfs") {
      console.log("DFS", permutation.join(""), i + 1, " out of ", files.length);
    }
    const fileContent = await fs.readFile(files[i], "utf-8");
    const inputFile = fileContent.split("\n");

    // Parsowanie wymiarów planszy
    const size = {
      x: parseInt(inputFile[0].split(" ")[0]),
      y: parseInt(inputFile[0].split(" ")[1]),
    };

    // Parsowanie stanu początkowego planszy
    const p = inputFile
      .slice(1, -1)
      .map((elem) => elem.split(" "))
      .flat()
      .map((elem) => parseInt(elem));

    if (algo === "astr") {
      // Dla A* uruchamiamy algorytm dla każdej heurystyki
      for (const heuristic of heuristics) {
        const out = await Algorithms[algo](p, size, permutation, heuristic);
        await createOutputFiles(files[i], algo, permutation, heuristic, out);
      }
    } else {
      // Dla innych algorytmów
      const out = await Algorithms[algo](p, size, permutation, heuristics[0]); // Domyślna heurystyka (nieużywana w BFS/DFS)
      await createOutputFiles(files[i], algo, permutation, heuristics[0], out);
    }
  }
}

// Uruchomienie głównej funkcji
main().catch(console.error);
