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

  #validateShipPlacement(shipObj, startPos, rotation) {
    if (rotation === "horizontal" && startPos[1] + shipObj.length > 10) {
      throw new Error("Ship placement out of bounds horizontally");
    }

    if (rotation === "vertical" && startPos[0] + shipObj.length > 10) {
      throw new Error("Ship placement out of bounds vertically");
    }
  }

  placeShip(shipIndex, startPos, rotation) {
    const ship = this.ships[shipIndex];
    let [x, y] = startPos;

    this.#validateShipPlacement(ship, startPos, rotation);

    for (let i = 0; i < ship.length; i++) {
      this.board[x][y] = ship.name;
      if (rotation === "horizontal") {
        y++;
      } else {
        x++;
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

  get allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk);
  }
}
