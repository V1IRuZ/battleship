export class Ship {
  constructor(name, length) {
    this.length = length;
    this.hits = 0;
    this.name = name;
    this.coords = [];
    this.placed = false;
    this.rotation;
  }

  hit() {
    this.hits++;
  }

  setCoords(coords) {
    return this.coords.push(coords);
  }

  resetCoords() {
    this.coords = [];
  }

  setPlaced() {
    this.placed = this.placed ? false : true;
  }

  setRotation(rotation) {
    this.rotation = rotation;
  }

  getRotation() {
    return this.rotation;
  }

  get isPlaced() {
    return this.placed;
  }

  get isSunk() {
    return this.length <= this.hits;
  }
}
