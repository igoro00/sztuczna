import { getOppositeMove, Plansza } from "../Plansza";
import { AlgorithmFunc, Direction } from "../types";

export const bfs: AlgorithmFunc = async (
  startingState,
  size,
  permutation,
  heuristic,
  changeBoard
) => {
  // Inicjalizacja kolejki FIFO z pustą ścieżką ruchów
  const queue: Direction[][] = [[]];
  const startTime = performance.now();
  let odwiedzone = 0;
  let przetworzone = 0;
  let maxDepth = 0;

  while (queue.length) {
    // Pobranie pierwszej ścieżki z kolejki (FIFO)
    const moves = queue.shift();
    if (moves === undefined) {
      throw new Error("Queue became empty before finding answer");
    }
    przetworzone++;
    // Utworzenie planszy i zastosowanie sekwencji ruchów
    maxDepth = Math.max(maxDepth, moves.length);
    const board = new Plansza(size, startingState);
    board.applyMoves(moves);
    if (changeBoard) {
      await changeBoard(board, moves);
    }
    // Sprawdzenie czy znaleziono rozwiązanie
    if (board.isSolved()) {
      return {
        solution: moves,
        odwiedzone,
        przetworzone,
        maxDepth,
        time: performance.now() - startTime,
      };
    }
    // Generowanie kolejnych możliwych ruchów
    const legalMoves = board.getLegalMoves();
    permutation.forEach((nextMove) => {
      // Sprawdzenie czy ruch jest dozwolony
      if (!legalMoves.includes(nextMove)) {
        return;
      }
      // Sprawdzenie czy ruch nie cofa poprzedniego ruchu
      const lastMove = moves.at(-1);
      if (lastMove && nextMove === getOppositeMove(lastMove)) {
        return;
      }

      odwiedzone++;
      // Dodanie nowej ścieżki do kolejki
      queue.push([...moves, nextMove]);
    });
  }
  throw new Error("Couldn't find a solution");
};
