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

  placeShip(shipIndex, startPos, rotation) {
    const ship = this.ships[shipIndex];
    let [x, y] = startPos;

    for (let i = 0; i < ship.length; i++) {
      if (rotation === "horizontal") {
        this.board[x][y] = ship.name;
        y++;
      } else if (rotation === "vertical") {
        this.board[x][y] = ship.name;
        x++;
      } else {
        throw new Error("Invalid input");
      }
    }
  }

  receiveAttack(x, y) {
    const location = this.board[x][y];

    if (location === "miss" || location === "hit") {
      return;
    }

    if (location === null) {
      this.board[x][y] = "miss";
      return;
    }

    const shipName = location;
    const index = this.ships.findIndex((ship) => ship.name === shipName);
    this.ships[index].hit();
    this.board[x][y] = "hit";
  }
}
