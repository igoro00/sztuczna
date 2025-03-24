import {
  Coord2D,
  Direction,
  getOppositeMove,
  Plansza,
} from './Plansza';

export function dfs(
	startingState: number[],
	size: Coord2D,
	permutation: Direction[]
): Direction[] {
	const stack: Direction[][] = [[]];
	const iterTimes: number[] = [];
	while (stack.length) {
		const start = performance.now();
		const moves = stack.pop();
		if (moves === undefined) {
			throw new Error("Queue became empty before finding answer");
		}
		const board = new Plansza(size, startingState);
		board.applyMoves(moves);
		if (board.isSolved()) {
			console.log("avg time", iterTimes.reduce((a, b) => a + b, 0) / iterTimes.length);
			return moves;
		}
		if (moves.length >= 20) {
			continue;
		}
		const legalMoves = board.getLegalMoves();
		permutation.forEach((nextMove) => {
			if (!legalMoves.includes(nextMove)) {
				return;
			}
            const lastMove = moves.at(-1); 
            if (lastMove && nextMove === getOppositeMove(lastMove)){
                return;
            }

            stack.push([...moves, nextMove]);
		});
		iterTimes.push(performance.now() - start);
	}
    throw new Error("Couldn't find a solution")
}
