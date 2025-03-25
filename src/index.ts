import JSZip from 'jszip';

import { Algorithms } from './algos';
import { Plansza } from './Plansza';
import {
  showMessage,
  showMoves,
} from './showMessage';
import {
  Algorithm,
  Direction,
  F,
  Heuristic,
} from './types';
import { sleep } from './utils';

let plansza = new Plansza({x:4,y:4}, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]);
let oldPlansza = plansza;
plansza.draw();
function animationFrame (){
    if(!oldPlansza.compare(plansza)){
        plansza.draw();
    }
    oldPlansza = plansza;
    requestAnimationFrame(animationFrame);
}
requestAnimationFrame(animationFrame);



let files:F[] = [];
let algo:Algorithm = "astr"
let permutation:Direction[] = ["R", "D", "U", "L"];
let heuristic: Heuristic = "manh";
let waitBetweenMoves: number = 10;

async function changePlansza(newPlansza: Plansza, moves: Direction[]){
    plansza = newPlansza;
    showMoves(moves);
    await sleep(waitBetweenMoves);
}

const input = document.getElementById("fileInput") as HTMLInputElement;
const fileList = document.getElementById("fileList") as HTMLUListElement;
const startButton = document.getElementById("start") as HTMLButtonElement;
const algoSelect = document.getElementById("algorithm") as HTMLSelectElement;
const permutationSelect = document.getElementById("permutation") as HTMLSelectElement;
const heuristicSelect = document.getElementById("heuristic") as HTMLSelectElement;
const waitInput = document.getElementById("wait") as HTMLInputElement;

algoSelect.addEventListener("change", () => {
    algo = algoSelect.value as Algorithm;
    heuristicSelect.disabled = algo !== "astr";
    permutationSelect.disabled = algo === "astr";
});

permutationSelect.addEventListener("change", () => {
    permutation = permutationSelect.value.split("") as Direction[];
});

heuristicSelect.addEventListener("change", () => {
    heuristic = heuristicSelect.value as Heuristic;
});

waitInput.addEventListener("change", () => {
    waitBetweenMoves = parseInt(waitInput.value);
});

input.addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    const zip = new JSZip();
    const zipContents = await zip.loadAsync(file);
    fileList.innerHTML = "";
    files = [];
    startButton.disabled = true;
    
    for (const [filename, fileData] of Object.entries(zipContents.files)) {
        if (!fileData.dir) {
            const content = await fileData.async("text");
            files.unshift({filename, content});
        }
    }
    files.forEach(file => {
        startButton.disabled = false;
        const li = document.createElement("li");
        li.textContent = file.filename;
        fileList.appendChild(li);
    });
});

startButton.addEventListener("click", async () => {
    (async ()=>{
        startButton.disabled = true;
        startButton.style.cursor = "wait"
        for(const file of files) {
            const size = {
                x: parseInt(file.content.split("\n")[0].split(" ")[0]),
                y: parseInt(file.content.split("\n")[0].split(" ")[1])
            };
            const p = file.content
                .split("\n")
                .slice(1, -1)
                .map(elem => elem.split(" "))
                .flat()
                .map(elem => parseInt(elem));

            showMessage(algo, file.filename, permutation.join(""));
            await Algorithms[algo](p, size, permutation, heuristic, changePlansza);
        }
        startButton.disabled = false
        startButton.style.cursor = "default"
    })();
});