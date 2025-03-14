import p5 from 'p5';

import { drawKafelek } from './Kafelek';

const KAFELEK_SIZE = 380/4;

export class Plansza {
    kafelki: number[] = [];
    timer: number = 0;
    constructor() {
        this.kafelki = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    }

    moveKafelek(i: number): boolean {
        const emptyIndex = this.kafelki.indexOf(0);
        
        const isAdjacent = 
            (i === emptyIndex - 1 && i % 4 !== 3) || 
            (i === emptyIndex + 1 && i % 4 !== 0) || 
            (i === emptyIndex - 4) ||
            (i === emptyIndex + 4);        
        if (isAdjacent) {
            // Swap the tile with the empty space
            this.kafelki[emptyIndex] = this.kafelki[i];
            this.kafelki[i] = 0;
            return true;
        }
        
        return false;
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