import { Ship } from "./ships.js";

export class Gameboard {
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

  placeShip(shipIndex, startPos) {
    const ship = this.ships[shipIndex];
    let [x, y] = startPos;

    for (let i = 0; i < ship.length; i++) {
      this.board[x][y] = ship.name;
      y++;
    }

  }
}
