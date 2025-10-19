import { Gameboard } from "./gameboard.js";

class Player {
  constructor() {
    this.gameBoard = new Gameboard();
  }
}

class RealPlayer extends Player {}

class ComputerPlayer extends Player {}
