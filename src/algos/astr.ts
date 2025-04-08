import { getOppositeMove, Plansza } from "../Plansza";
import { sortedPush } from "../sortedHeap";
import { AlgorithmFunc, Direction } from "../types";

export const astr: AlgorithmFunc = async (
  startingState,
  size,
  permutation,
  heuristic,
  changeBoard
) => {
  // Sprawdzenie czy podano funkcję heurystyczną
  if (!heuristic) {
    throw new Error("Heuristic is required for astr algorithm");
  }

  // Inicjalizacja kolejki priorytetowej z pustą ścieżką ruchów
  const queue: {
    m: Direction[];
    score?: number;
  }[] = [{ m: [] }];

  const startTime = performance.now();
  let odwiedzone = 0;
  let przetworzone = 0;
  let maxDepth = 0;
  while (queue.length) {
    // Pobranie stanu z najmniejszą wartością funkcji heurystycznej
    const moves = queue.shift();
    if (moves === undefined) {
      throw new Error("Queue became empty before finding answer");
    }
    przetworzone++;
    maxDepth = Math.max(maxDepth, moves.m.length);
    // Utworzenie planszy i zastosowanie sekwencji ruchów
    const board = new Plansza(size, startingState);
    board.applyMoves(moves.m);

    // Wizualizacja stanu planszy (jeśli podano callback)
    if (changeBoard) {
      await changeBoard(board, moves.m);
    }

    // Sprawdzenie czy znaleziono rozwiązanie
    if (board.isSolved()) {
      return {
        solution: moves.m,
        odwiedzone,
        przetworzone,
        maxDepth,
        time: performance.now() - startTime,
      };
    }

    // Ograniczenie głębokości przeszukiwania do 7 ruchów
    if (moves.m.length >= 7) {
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
      const lastMove = moves.m.at(-1);
      if (lastMove && nextMove === getOppositeMove(lastMove)) {
        return;
      }

      odwiedzone++;
      // Utworzenie nowej planszy i wykonanie ruchu
      const board = new Plansza(size, startingState);
      board.applyMoves(moves.m);
      board.moveKafelek(nextMove);
      // Dodanie nowego stanu do kolejki priorytetowej
      sortedPush(
        queue,
        {
          m: [...moves.m, nextMove],
          score: board.score(heuristic),
        },
        "score"
      );
    });
  }
  throw new Error("Couldn't find a solution");
};
