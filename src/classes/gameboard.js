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

  #validateShipOutOfBounds(shipObj, startPos, rotation) {
    if (rotation === "horizontal" && startPos[1] + shipObj.length > 10) {
      throw new Error("Ship placement out of bounds horizontally");
    }

    if (rotation === "vertical" && startPos[0] + shipObj.length > 10) {
      throw new Error("Ship placement out of bounds vertically");
    }
  }

  #validateShipOverLapping(x, y, shipObj) {
    const adjacentPositions = [
      [x - 1, y - 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ];

    const validPositions = adjacentPositions.filter(
      ([x, y]) => x >= 0 && x < 10 && y >= 0 && y < 10,
    );

    const invalidAdjacent = validPositions
      .map(([x, y]) => this.board[x][y])
      .some((pos) => typeof pos === "string" && pos !== shipObj.name);

    if (typeof this.board[x][y] === "string" || invalidAdjacent) {
      throw new Error("Overlapping or adjacent placements are not allowed");
    }
  }

  #validateShipPlacement(shipObj, startPos, rotation) {
    const [startX, startY] = startPos;
    const positions = [];

    for (let i = 0; i < shipObj.length; i++) {
      const x = rotation === "vertical" ? startX + i : startX;
      const y = rotation === "horizontal" ? startY + i : startY;
      this.#validateShipOverLapping(x, y, shipObj);

      positions.push([x, y]);
    }

    return positions;
  }

  getPosition(x, y) {
    return this.board[x][y];
  }

  placeShip(shipIndex, startPos, rotation) {
    const ship = this.ships[shipIndex];

    this.#validateShipOutOfBounds(ship, startPos, rotation);
    const positions = this.#validateShipPlacement(ship, startPos, rotation);

    positions.forEach(([x, y]) => (this.board[x][y] = ship.name));
  }

  receiveAttack(x, y) {
    const location = this.board[x][y];

    if (location === "miss" || location === "hit") {
      return;
    }

    if (location === null) {
      this.board[x][y] = "miss";
      return "miss";
    }

    const shipName = location;
    const index = this.ships.findIndex((ship) => ship.name === shipName);
    this.ships[index].hit();
    this.board[x][y] = "hit";
    return "hit";
  }

  get allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk);
  }
}
