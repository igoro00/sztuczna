export type AlgorithmFunc = (
    startingState: number[],
    size: Coord2D,
    permutation: Direction[],
    heuristics?: Heuristic,
    changeBoard?: (b: Plansza, moves:Direction[]) => Promise<void>,
) => Promise<{
    solution: Direction[]|-1;
    odwiedzone: number,
    przetworzone: number,
    maxDepth: number;
    time: number; // in ms
}>

export type Direction = "L" | "R" | "U" | "D";
export type Coord2D = {
  x: number;
  y: number;
};

interface DirDict {
  R: Direction;
  L: Direction;
  U: Direction;
  D: Direction;
}

export type F = {
    filename: string;
    content: string;
}

export type Algorithm = "astr" | "bfs" | "dfs";
export type Heuristic = "manh" | "hamm"