import { Coord2D, Direction, getOppositeMove, Plansza } from "./Plansza";

export function bfs(
	startingState: number[],
	size: Coord2D,
	permutation: Direction[]
): Direction[] {
	const queue: Direction[][] = [[]];

	while (queue.length) {
		const elem = queue.shift();
		if (elem === undefined) {
			throw new Error("Queue became empty before finding answer");
		}
		const board = new Plansza(size, startingState);
		board.applyMoves(elem);
		if (board.score() === 0) {
			return elem;
		}
		const legalMoves = board.getLegalMoves();
		permutation.forEach((nextMove) => {
			if (!legalMoves.includes(nextMove)) {
				return;
			}
            const lastMove = elem.at(-1); 
            if (lastMove && nextMove === getOppositeMove(lastMove)){
                return;
            }

            queue.push([...elem, nextMove]);
		});
	}
    throw new Error("Couldn't find a solution")
}
