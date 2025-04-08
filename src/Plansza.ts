import { Coord2D, DirDict, Direction, Heuristic } from "./types";

/**
 * Zwraca przeciwny kierunek dla podanego ruchu
 * @param m Kierunek ruchu
 * @returns Przeciwny kierunek
 */
export function getOppositeMove(m: Direction): Direction {
  const oppositeDict: DirDict = {
    R: "L",
    L: "R",
    U: "D",
    D: "U",
  };
  return oppositeDict[m];
}

/**
 * Klasa reprezentująca planszę gry układanki
 */
export class Plansza {
  size: Coord2D;
  kafelki: number[] = [];
  perfectState: number[] = [];
  timer: number = 0;
  noOfMoves: number = 0;

  /**
   * Konstruktor planszy
   * @param size Wymiary planszy
   * @param startingState Początkowy układ kafelków
   */
  constructor(size: Coord2D, startingState: number[]) {
    this.size = { ...size };
    this.kafelki = [...startingState];
    // Generowanie stanu docelowego (1,2,3,...,0)
    this.perfectState = [];
    for (let i = 1; i < size.x * size.y; i++) {
      this.perfectState.push(i);
    }
    this.perfectState.push(0);
  }

  /**
   * Porównuje dwie plansze
   * @param other Druga plansza do porównania
   * @returns true jeśli plansze są identyczne
   */
  compare(other: Plansza): boolean {
    if (this.size.x !== other.size.x || this.size.y !== other.size.y) {
      return false;
    }
    if (this.kafelki.some((v, i) => v !== other.kafelki[i])) {
      return false;
    }
    return true;
  }

  /**
   * Sprawdza czy układanka jest rozwiązana
   */
  isSolved(): boolean {
    return this.kafelki.every((v, i) => v === this.perfectState[i]);
  }

  /**
   * Oblicza wartość funkcji oceny stanu
   * @param heuristic Rodzaj heurystyki ("manh" lub "hamm")
   */
  score(heuristic: Heuristic): number {
    if (heuristic === "manh") {
      return this.manhattanScore();
    } else {
      return this.hammingScore();
    }
  }

  /**
   * Oblicza odległość Hamminga (liczba kafelków na złych pozycjach)
   */
  hammingScore(): number {
    let out = 0;
    for (let i = 0; i < this.size.x * this.size.y; i++) {
      if (this.kafelki[i] !== this.perfectState[i]) {
        out++;
      }
    }
    return out + this.noOfMoves;
  }

  /**
   * Oblicza odległość Manhattan (suma odległości kafelków od ich docelowych pozycji)
   */
  manhattanScore(): number {
    let out = 0;

    for (let i = 0; i < this.size.x * this.size.y; i++) {
      if (this.kafelki[i] === this.perfectState[i]) {
        continue;
      }
      const shouldBeAt = this.perfectState.indexOf(this.kafelki[i]);
      const currentCoord = this.convert1Dto2DCoord(i);
      const desiredCoord = this.convert1Dto2DCoord(shouldBeAt);

      //manhattan
      out +=
        Math.abs(currentCoord.x - desiredCoord.x) +
        Math.abs(currentCoord.y - desiredCoord.y);
    }
    return out + this.noOfMoves;
  }

  /**
   * Konwertuje indeks jednowymiarowy na współrzędne 2D
   */
  convert1Dto2DCoord(i: number): Coord2D {
    return {
      y: Math.floor(i / this.size.x),
      x: i % this.size.y,
    };
  }

  /**
   * Wykonuje sekwencję ruchów
   */
  applyMoves(moves: Direction[]) {
    moves.forEach((m) => this.moveKafelek(m));
  }

  /**
   * Zwraca listę dozwolonych ruchów
   */
  getLegalMoves(): Direction[] {
    const out: Direction[] = [];

    const emptyIndex = this.kafelki.indexOf(0);
    // Sprawdzanie możliwych ruchów w każdym kierunku
    //L
    if (emptyIndex % this.size.x) {
      out.push("L");
    }

    //R
    if (emptyIndex % this.size.x !== this.size.x - 1) {
      out.push("R");
    }

    //U
    if (emptyIndex >= this.size.x) {
      out.push("U");
    }

    //D
    if (emptyIndex < this.size.x * (this.size.y - 1)) {
      out.push("D");
    }

    return out;
  }

  /**
   * Wykonuje pojedynczy ruch
   * @param direction Kierunek ruchu
   * @returns true jeśli ruch został wykonany
   */
  moveKafelek(direction: Direction): boolean {
    const emptyIndex = this.kafelki.indexOf(0);

    this.noOfMoves++;

    // Obliczanie indeksu kafelka do zamiany
    let i;
    switch (direction) {
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

  draw() {
    console.log("draw");
    if (!window) {
      throw new Error("You can call this function only in browser context");
    }
    const container = document.querySelector("#boardContainer") as HTMLElement;
    if (!container) {
      throw new Error("Couldn't find board container");
    }
    container.innerHTML = "";

    this.kafelki.forEach((k) => {
      const div = document.createElement("div");
      div.classList.add("piece");
      if (k === 0) {
        div.classList.add("zero");
      }
      div.innerHTML = k.toString();
      container.appendChild(div);
    });
    const firstChild = container.children[0];
    const style = window.getComputedStyle(firstChild);
    container.style.width = `calc((${style.width} + ${style.marginLeft} + ${style.marginRight}) * ${this.size.x})`;
    container.style.height = `calc((${style.height} + ${style.marginTop} + ${style.marginBottom}) * ${this.size.y})`;
  }
  drawAscii(): string {
    let out = "";
    for (let j = 0; j < this.size.y; j++) {
      for (let i = 0; i < this.size.x; i++) {
        out += this.kafelki[j * this.size.x + i] + " ";
      }
      out += "\n";
    }
    return out;
  }
}
