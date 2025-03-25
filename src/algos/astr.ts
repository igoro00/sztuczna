import {
  getOppositeMove,
  Plansza,
} from '../Plansza';
import {
  AlgorithmFunc,
  Direction,
} from '../types';

export const astr: AlgorithmFunc = async (
	startingState,
	size,
	permutation,
	heuristic,
	changeBoard,
)=>{
	if(!heuristic){
		throw new Error("Heuristic is required for astr algorithm");
	}
	const queue: Direction[][] = [[]];
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
		maxDepth = Math.max(maxDepth, moves.length);
		const board = new Plansza(size, startingState);
		board.applyMoves(moves);
		if(changeBoard){
			await changeBoard(board, moves);
		}
		if (board.isSolved()) {
			return {
				solution: moves,
				odwiedzone,
				przetworzone,
				maxDepth,
				time: performance.now() - startTime,
			};
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
			odwiedzone++;
            queue.push([...moves, nextMove]);
		});
		queue.sort((a, b) => {
			const aBoard = new Plansza(size, startingState);
			aBoard.applyMoves(a);
			const bBoard = new Plansza(size, startingState);
			bBoard.applyMoves(b);
			return aBoard.score(heuristic) - bBoard.score(heuristic);
		});
	}
    throw new Error("Couldn't find a solution")
}
