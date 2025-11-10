export class Ship {
  constructor(name, length) {
    this.length = length;
    this.hits = 0;
    this.name = name;
    this.coords = [];
    this.placed = false;
  }

  hit() {
    this.hits++;
  }

  setCoords(coords) {
    return this.coords.push(coords);
  }

  get isSunk() {
    return this.length <= this.hits;
  }
}
