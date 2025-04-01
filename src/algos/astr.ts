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
	if (!heuristic) {
		throw new Error("Heuristic is required for astr algorithm");
	}
	const queue: {
		m: Direction[];
		score?: number;
	}[] = [{ m: [] }];
	const startTime = performance.now();
	let odwiedzone = 0;
	let przetworzone = 0;
	let maxDepth = 0;
	while (queue.length) {
		const moves = queue.shift();
		if (moves === undefined) {
			throw new Error("Queue became empty before finding answer");
		}
		przetworzone++;
		maxDepth = Math.max(maxDepth, moves.m.length);
		const board = new Plansza(size, startingState);
		board.applyMoves(moves.m);
		if (changeBoard) {
			await changeBoard(board, moves.m);
		}
		if (board.isSolved()) {
			return {
				solution: moves.m,
				odwiedzone,
				przetworzone,
				maxDepth,
				time: performance.now() - startTime,
			};
		}
		if (moves.m.length >= 7) {
			continue;
		}
		const legalMoves = board.getLegalMoves();
		permutation.forEach((nextMove) => {
			if (!legalMoves.includes(nextMove)) {
				return;
			}
			const lastMove = moves.m.at(-1);
			if (lastMove && nextMove === getOppositeMove(lastMove)) {
				return;
			}
			odwiedzone++;
			const board = new Plansza(size, startingState);
			board.applyMoves(moves.m);
			board.moveKafelek(nextMove);
			// queue.push({
			// 	m: [...moves.m, nextMove],
			// 	score: board.score(heuristic),
			// });
			sortedPush(queue, {
				m: [...moves.m, nextMove],
				score: board.score(heuristic),
			}, "score")
		});
		// queue.sort((a,b)=>(a.score??0)-(b.score??0))
	}
	throw new Error("Couldn't find a solution");
};
