import {
  Coord2D,
  Direction,
  getOppositeMove,
  Plansza,
} from './Plansza';

export function astar(
	startingState: number[],
	size: Coord2D,
	permutation: Direction[]
): Direction[] {
	const stack: Direction[][] = [[]];
	while (stack.length) {
		const moves = stack.pop();
		if (moves === undefined) {
			throw new Error("Queue became empty before finding answer");
		}
		const board = new Plansza(size, startingState);
		board.applyMoves(moves);
		if (board.isSolved()) {
			return moves;
		}
		if (moves.length >= 7) {
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
		stack.sort((a, b) => {
			const aboard = new Plansza(size, startingState);
			aboard.applyMoves(a);
			const bboard = new Plansza(size, startingState);
			bboard.applyMoves(b);
			return aboard.score() - bboard.score();
		});
	}
    throw new Error("Couldn't find a solution")
}
