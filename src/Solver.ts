import { bfs } from "./algos/bfs";
import { Direction } from "./types";

// Pobranie argumentów z linii komend
const algo = process.argv[2];
const permutation = process.argv[3].split("") as Direction[];
const inputFilename = process.argv[4];
const outputFilename = process.argv[5];
const statsFilename = process.argv[6];

// Wczytanie i przetworzenie pliku wejściowego
const inputFile = (await Bun.file(inputFilename).text()).split("\n");
// Parsowanie wymiarów planszy z pierwszej linii
const size = {
  x: parseInt(inputFile[0].split(" ")[0]), // Szerokość planszy
  y: parseInt(inputFile[0].split(" ")[1]), // Wysokość planszy
};

// Przetworzenie układu początkowego planszy
// 1. Pobierz wszystkie linie oprócz pierwszej i ostatniej
// 2. Podziel każdą linię na liczby
// 3. Spłaszcz tablicę dwuwymiarową do jednowymiarowej
// 4. Przekonwertuj stringi na liczby
const p = inputFile
  .slice(1, -1)
  .map((elem) => elem.split(" "))
  .flat()
  .map((elem) => parseInt(elem));

// Uruchomienie algorytmu BFS i wyświetlenie wyników
console.log(bfs(p, size, permutation));
