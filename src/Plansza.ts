import p5 from 'p5';

import { drawKafelek } from './Kafelek';

const KAFELEK_SIZE = 380/4;

export type Direction = "L" | "R" | "U" | "D"
export type Coord2D = {
    x: number,
    y: number,
}
interface DirDict {
    "R": Direction,
    "L": Direction,
    "U": Direction,
    "D": Direction,
}

export function getOppositeMove(m: Direction):Direction {
    const oppositeDict: DirDict =  {
        "R":"L",
        "L":"R",
        "U":"D",
        "D":"U"
    }
    return oppositeDict[m]
}

export class Plansza {
    size: Coord2D;
    kafelki: number[] = [];
    perfectState: number[] = [];
    timer: number = 0;
    constructor(size: Coord2D, startingState: number[]) {
        this.size = {...size}
        this.kafelki = [...startingState];
        this.perfectState = [];
        for(let i = 1; i<size.x*size.y; i++){
            this.perfectState.push(i);
        }
        this.perfectState.push(0);
    }

    score(): number {
        let out = 0;
        for(let i = 0; i<this.size.x*this.size.y; i++){
            if(this.kafelki[i]===this.perfectState[i]){
                continue;
            }
            const shouldBeAt = this.perfectState.indexOf(this.kafelki[i])
            const currentCoord = this.convert1Dto2DCoord(i);
            const desiredCoord = this.convert1Dto2DCoord(shouldBeAt);
            
            //manhattan
            out += Math.abs(currentCoord.x-desiredCoord.x) + 
                Math.abs(currentCoord.y-desiredCoord.y)
        }
        return out;
    }

    convert1Dto2DCoord(i: number):Coord2D{
        return {
            y: Math.floor(i/this.size.x),
            x: i%this.size.y,
        }
    }

    applyMoves(moves:Direction[]) { 
        moves.forEach(m=>this.moveKafelek(m))
    }

    getLegalMoves(): Direction[] {
        const out:Direction[] = [];
        const emptyIndex = this.kafelki.indexOf(0);
        //L
        if (emptyIndex % this.size.x) {
            out.push("L");
        }

        //R
        if (emptyIndex % this.size.x !== this.size.x-1) {
            out.push("R")
        }

        //U
        if (emptyIndex >= this.size.x) {
            out.push("U")
        }

        //D
        if (emptyIndex <= this.size.x*(this.size.y-1)) {
            out.push("D")
        }

        return out;
    }

    moveKafelek(direction: Direction): boolean {
        const emptyIndex = this.kafelki.indexOf(0);
        const legalMoves = this.getLegalMoves()
        if(!legalMoves.includes(direction)){
            return false;
        }

        let i;

        switch(direction) { 
            case "L": {  
                i = emptyIndex - 1;           
                break; 
            } 
            case "R": { 
                i = emptyIndex + 1;
                break; 
            } 
            case "U": {
                i = emptyIndex - this.size.x;
                break;
            }
            case "D": {
                i = emptyIndex + this.size.x;
                break;
            }
        }
        
        // Swap the tile with the empty space
        this.kafelki[emptyIndex] = this.kafelki[i];
        this.kafelki[i] = 0;
        return true;

    }

    draw(p: p5) {
        if(!window){
            throw new Error("You can call this function only in browser context")
        }
        p.strokeWeight(2);
        p.stroke("black");
        p.fill("#e6b5a3");
        p.rect(10, 10, 380, 380);
        p.push();
        p.translate(10, 10);
        this.kafelki.forEach((kafelek, i) => {
            if(kafelek === 0) return;
            p.push();
            p.translate(KAFELEK_SIZE*(i%4), KAFELEK_SIZE*Math.floor(i/4));
            drawKafelek(p, kafelek, KAFELEK_SIZE);
            p.pop();
        });
        p.pop();
    }
    drawAscii():string{
        let out = "";
        for(let j = 0; j<this.size.y; j++){
            for(let i = 0; i<this.size.x; i++){
                out += this.kafelki[(j*this.size.x) + i] + " ";
            }
            out+="\n" 
        }
        return out;
    }
}