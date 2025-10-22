import { Gameboard } from "./gameboard.js";

class Player {
  constructor() {
    this.gameBoard = new Gameboard();
  }

  defaultPlacement() {
    this.gameBoard.placeShip(0, [1, 1], "horizontal");
    this.gameBoard.placeShip(1, [3, 0], "vertical");
    this.gameBoard.placeShip(2, [3, 2], "vertical");
    this.gameBoard.placeShip(3, [3, 4], "vertical");
    this.gameBoard.placeShip(4, [7, 2], "horizontal");
    this.gameBoard.placeShip(5, [8, 8], "vertical");
  }
}

class RealPlayer extends Player {}

class ComputerPlayer extends Player {}

export { Player };
