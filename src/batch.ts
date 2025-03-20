import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { Direction } from "./Plansza";

const permutation:Direction[] = ["R","D","U","L"]
const glob = new Bun.Glob("./puzzle/*.txt");
const files = [...glob.scanSync(".")]
for (let i = 0; i<files.length; i++) {
    const inputFile = (await Bun.file(files[i]).text()).split("\n")
    const size = {
        x: parseInt(inputFile[0].split(" ")[0]),
        y: parseInt(inputFile[0].split(" ")[1])
    }
    const p = inputFile
        .slice(1, -1)
        .map(elem=>elem.split(" "))
        .flat()
        .map(elem=>parseInt(elem));

    // console.log(bfs(p,size,permutation))
    dfs(p,size,permutation)
    console.log(i+1, "of", files.length)
}