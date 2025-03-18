import p5 from 'p5';

import { drawKafelek } from './Kafelek';

const KAFELEK_SIZE = 380/4;

export type Direction = "L" | "R" | "U" | "D"
export type Coord2D = {
    x: number,
    y: number,
}

export class Plansza {
    kafelki: number[] = [];
    perfectState: number[] = [];
    timer: number = 0;
    constructor() {
        this.kafelki = [
            1, 2, 3, 4, 
            5, 6, 7, 8, 
            9, 10,11,12, 
            13,14,15, 0
        ];
        this.perfectState = [...this.kafelki]
    }

    score(): number {
        let out = 0;
        for(let i = 0; i<16; i++){
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
            y: Math.floor(i/4),
            x: i%4,
        }
    }

    moveKafelek(direction: Direction): boolean {
        const emptyIndex = this.kafelki.indexOf(0);

        let i;

        switch(direction) { 
            case "L": {  
                if (emptyIndex % 4 === 0) {
                    return false;
                }

                i = emptyIndex - 1;
                
                break; 
            } 

            case "R": { 
                if (emptyIndex % 4 === 3) {
                    return false;
                }

                i = emptyIndex + 1;

                break; 
            } 

            case "U": {
                if (emptyIndex < 4) {
                    return false;
                }

                i = emptyIndex - 4;

                break;
            }

            case "D": {
                if (emptyIndex > 11) {
                    return false;
                }

                i = emptyIndex + 4;

                break;
            }
        }
        
        // Swap the tile with the empty space
        this.kafelki[emptyIndex] = this.kafelki[i];
        this.kafelki[i] = 0;
        return true;

    }

    draw(p: p5) {
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
}