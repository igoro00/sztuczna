import { Plansza } from './Plansza';

let startingState = [
    1, 2, 3, 4, 
    5, 6, 7, 8, 
    10, 13, 11, 12, 
    0, 9, 14, 15]

const plansza = new Plansza({ x: 4, y: 4 }, startingState);
console.log(plansza.drawAscii())
console.log(plansza.getLegalMoves());