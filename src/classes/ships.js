export class Ship {
  constructor(name, length) {
    this.length = length;
    this.hits = 0;
    this.name = name;
  }

  hit() {
    this.hits++;
  }

  get isSunk() {
    return this.length <= this.hits;
  }
}
