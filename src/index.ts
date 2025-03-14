import p5 from 'p5';

import { Plansza } from './Plansza';

const sketch = (p: p5) => {
	const plansza = new Plansza();
	p.setup = () => {
		p.createCanvas(400, 400);
		p.createButton('Shuffle').mousePressed(() => {
			for (let i = 0; i < 1000; i++) {
				plansza.moveKafelek(Math.floor(Math.random() * 16));
			}
		});
	};

	p.draw = () => {
		p.background(50);

		plansza.draw(p);
	};
};

new p5(sketch);
