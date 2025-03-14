import p5 from 'p5';

import { Plansza } from './Plansza';

const sketch = (p: p5) => {
	const plansza = new Plansza();
	p.setup = () => {
		p.createCanvas(400, 400);
		p.createButton('Left').mousePressed(() => {
			// for (let i = 0; i < 1000; i++) {
			plansza.moveKafelek("L");
			// }
		});
		p.createButton('Right').mousePressed(() => {
			// for (let i = 0; i < 1000; i++) {
			plansza.moveKafelek("R");
			// }
		});
		p.createButton('Up').mousePressed(() => {
			// for (let i = 0; i < 1000; i++) {
			plansza.moveKafelek("U");
			// }
		});
		p.createButton('Down').mousePressed(() => {
			// for (let i = 0; i < 1000; i++) {
			plansza.moveKafelek("D");
			// }
		});
	};

	p.draw = () => {
		p.background(50);

		plansza.draw(p);
	};
};

new p5(sketch);
