import {
  getOppositeMove,
  Plansza,
} from '../Plansza';
import {
  AlgorithmFunc,
  Direction,
} from '../types';

export const dfs: AlgorithmFunc = async (
	startingState,
	size,
	permutation,
	heuristic,
	changeBoard,
)=>{
	const stack: Direction[][] = [[]];
	const startTime = performance.now();
	let maxDepth = 0;
	let odwiedzone = 0;
	let przetworzone = 0;

	while (stack.length) {
		const moves = stack.pop();
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
			}
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
			odwiedzone++;
            stack.push([...moves, nextMove]);
		});
	}
	return {
		solution: -1,
		odwiedzone,
		przetworzone,
		maxDepth: -1,
		time: performance.now() - startTime,
	}
}
