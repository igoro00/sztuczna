import p5 from 'p5';

import { Plansza } from './Plansza';

const sketch = (p: p5) => {
	const plansza = new Plansza();
	p.setup = () => {
		p.createCanvas(400, 400);
		p.createButton('Left').mousePressed(() => {
			plansza.moveKafelek("L");
		});
		p.createButton('Right').mousePressed(() => {
			plansza.moveKafelek("R");
		});
		p.createButton('Up').mousePressed(() => {
			plansza.moveKafelek("U");
		});
		p.createButton('Down').mousePressed(() => {
			plansza.moveKafelek("D");
		});
		p.createButton('Losuj').mousePressed(() => {
			for (let i = 0; i < 1000; i++) {
				const r = Math.floor(Math.random()*4)
				if(r===0){
					plansza.moveKafelek("U");
				}
				if(r===1){
					plansza.moveKafelek("D")
				}
				if(r===2){
					plansza.moveKafelek("L")
				}
				if(r===3){
					plansza.moveKafelek("R")
				}
			}
		});
	};

	p.draw = () => {
		p.background(50);

		plansza.draw(p);
	};
};

new p5(sketch);
