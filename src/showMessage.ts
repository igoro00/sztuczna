import { Direction } from './types';

export function showMessage(
    algo: string, 
    fileName: string, 
    permutation: string, 
    heuristic?: string,
) {
    const container = document.getElementById("stats") as HTMLElement;
    container.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = `Algorithm: ${algo}`;
    container.appendChild(p);
    const p2 = document.createElement("p");
    p2.textContent = `File: ${fileName}`;
    container.appendChild(p2);
    const p3 = document.createElement("p");
    p3.textContent = `Permutation: ${permutation}`;
    container.appendChild(p3);
    const p4 = document.createElement("p");
    if(heuristic){
        p4.textContent = `Heuristic: ${heuristic}`;
        container.appendChild(p4);
    }
    const p5 = document.createElement("p");
    p5.id = "moves";
    container.appendChild(p5);
}

export function showMoves(
    moves: Direction[]
) {
    document.getElementById("moves")!.textContent = `Moves: ${moves.join("")}`;
}