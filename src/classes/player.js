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
    this.algorithm = "random";
    this.algorithmQueue = [];
    this.enemyShipsLengths = [5,4,3,3,2,1];
    this.enemyHits = 0;
    this.originalHit = null;
  }

  enemyHit() {
    this.enemyHits++;
  }

  setOriginalHit(coords) {
    this.originalHit = coords;
  }

  switchAlgorithmState(algorithm) {
    switch (algorithm) {
      case "random":
        this.algorithm = "random";
        break;
      case "adjacent":
        this.algorithm = "adjacent";
        break;
      case "horizontal":
        this.algorithm = "horizontal";
        break;
      case "vertical":
        this.algorithm = "vertical";
        break;
      default:
        this.algorithm = "random";
    }
  }

  attack(realPlayer) {
    if (this.algorithm === "random") {
      return this.randomAttack(realPlayer);
    } else if (this.algorithm === "adjacent") {
      return this.adjacentAttack(realPlayer);
    } else if (this.algorithm === "horizontal") {
      return this.horizontalAttack(realPlayer);
    }
  }

  randomAttack(realPlayer) {
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
          this.setOriginalHit([x, y]);
          this.enemyHit();
          this.switchAlgorithmState("adjacent");
          this.updateAdjacentQueue([x, y], realPlayer);
        }
        return [x, y];
      }

      attempts++;
    }
  }

  updateAdjacentQueue(coords, realPlayer) {
    const [x, y] = coords;

    const adjacentPositions = [
      [x - 1, y],
      [x + 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    const validPositions = adjacentPositions.filter(
      ([x, y]) => x >= 0 && x < 10 && y >= 0 && y < 10,
    );

    const removedUsedPositions = validPositions.filter(
      ([x, y]) =>
        realPlayer.gameBoard.board[x][y] !== "miss" &&
        realPlayer.gameBoard.board[x][y] !== "hit",
    );

    removedUsedPositions.forEach((pos) => {
      this.algorithmQueue.push(pos);
    });
  }

  adjacentAttack(realPlayer) {
    const checkAdjacentCoords = this.algorithmQueue.shift();
    const [x, y] = checkAdjacentCoords;
    const shotResult = realPlayer.gameBoard.receiveAttack(x, y);

    if (shotResult === "hit") {
      this.updateAdjacentQueue([x, y], realPlayer);
    }

    if (this.algorithmQueue.length <= 0) {
      this.switchAlgorithmState("random");
    }

    return [x, y];
  }

  // horizontalAttack(realPlayer) {

  // }
}

export { Player, ComputerPlayer };
