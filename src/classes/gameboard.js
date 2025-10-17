import { Ship } from "./ships.js";

class Gameboard {
  constructor() {
    this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.ships = [
      new Ship("carrier", 5),
      new Ship("battleship", 4),
      new Ship("cruiser1", 3),
      new Ship("cruiser2", 3),
      new Ship("destroyer", 2),
      new Ship("submarine", 1),
    ];
  }
}
