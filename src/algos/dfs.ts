import { getOppositeMove, Plansza } from "../Plansza";
import { AlgorithmFunc, Direction } from "../types";

export const dfs: AlgorithmFunc = async (
  startingState,
  size,
  permutation,
  heuristic,
  changeBoard
) => {
  // Inicjalizacja stosu z pustą ścieżką ruchów
  const stack: Direction[][] = [[]];
  const startTime = performance.now();
  let maxDepth = 0;
  let odwiedzone = 0;
  let przetworzone = 0;

  while (stack.length) {
    // Pobranie ostatniej ścieżki ze stosu (LIFO)
    const moves = stack.pop();
    if (moves === undefined) {
      throw new Error("Queue became empty before finding answer");
    }
    przetworzone++;
    maxDepth = Math.max(maxDepth, moves.length);
    // Utworzenie planszy i zastosowanie sekwencji ruchów
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
    // Ograniczenie głębokości przeszukiwania do 20 ruchów
    if (moves.length >= 20) {
      continue;
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
      // Dodanie nowej ścieżki na stos
      stack.push([...moves, nextMove]);
    });
  }
  // Zwrócenie informacji o niepowodzeniu znalezienia rozwiązania
  return {
    solution: -1,
    odwiedzone,
    przetworzone,
    maxDepth: -1,
    time: performance.now() - startTime,
  };
};
