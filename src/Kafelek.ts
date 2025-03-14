import p5 from 'p5';

export function drawKafelek(p: p5, value: number, size: number) {
    p.strokeWeight(2);
    p.stroke("black");
    p.fill("#c99987");
    p.rect(0, 0, size, size);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(0);
    p.text(value, 50, 50);
}

