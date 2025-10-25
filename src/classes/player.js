import { Gameboard } from "./gameboard.js";

class Player {
  constructor(id) {
    this.id = id;
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

class ComputerPlayer extends Player {
  constructor(id) {
    super(id);
    this.successfulHit = false;
  }

  switchAlgorithmState() {
    return (this.successfulHit = this.successfulHit === false ? true : false);
  }

  attack(realPlayer) {
    let attempts = 0;

    while (attempts < 101) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      const player1Coords = realPlayer.gameBoard.board[x][y];

      const allreadyAttacked =
        player1Coords === "miss" || player1Coords === "hit";

      if (!allreadyAttacked) {
        const shotResult = realPlayer.gameBoard.receiveAttack(x, y);
        if (shotResult === "hit") {
          this.switchAlgorithmState();
        }
        return [x, y];
      }

      attempts++;
    }
  }
}

export { Player, ComputerPlayer };
