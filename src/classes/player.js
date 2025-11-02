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
    this.enemyShipsLengths = [5, 4, 3, 3, 2, 1];
    this.enemyHits = 0;
    this.originalHit = null;
  }

  enemyHit() {
    this.enemyHits++;
  }

  setOriginalHit(coords) {
    this.originalHit = coords;
  }

  resetQueue() {
    this.algorithmQueue = [];
  }

  resetOriginalHit() {
    this.originalHit = null;
  }

  resetHits() {
    this.enemyHits = 0;
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
    switch (this.algorithm) {
      case "random":
        return this.randomAttack(realPlayer);
      case "adjacent":
        return this.adjacentAttack(realPlayer);
      case "horizontal":
      case "vertical":
        return this.horizontalVerticalAttack(realPlayer);
    }
  }

  randomAttack(realPlayer) {
    while (true) {
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
          this.updateQueue([x, y], realPlayer);
        }

        if (this.algorithmQueue.length <= 0) {
          this.switchAlgorithmState("random");
          this.resetOriginalHit();
          this.resetHits();
        }

        return [x, y];
      }
    }
  }

  filterHorizontalQueue() {
    const [originalX, originalY] = this.originalHit;
    const filtered = this.algorithmQueue.filter(([x, y]) => x === originalX);
    this.algorithmQueue = filtered;
  }

  filterVerticalQueue() {
    const [originalX, originalY] = this.originalHit;
    const filtered = this.algorithmQueue.filter(([x, y]) => y === originalY);
    this.algorithmQueue = filtered;
  }

  updateQueue(coords, realPlayer) {
    const [x, y] = coords;

    const validPositions = this.#getValidAdjacentPositions(x, y, realPlayer);

    switch (this.algorithm) {
      case "adjacent":
        this.#adjacentQueue(validPositions);
        break;
      case "horizontal":
        this.#horizontalQueue(validPositions);
        break;
      case "vertical":
        this.#verticalQueue(validPositions);
        break;
    }
  }

  #getValidAdjacentPositions(x, y, realPlayer) {
    const adjacentPositions = [
      [x - 1, y],
      [x + 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    // Remove off-board and used locations
    return adjacentPositions
      .filter(([x, y]) => x >= 0 && x < 10 && y >= 0 && y < 10)
      .filter(
        ([x, y]) =>
          realPlayer.gameBoard.board[x][y] !== "miss" &&
          realPlayer.gameBoard.board[x][y] !== "hit",
      );
  }

  #adjacentQueue(positions) {
    this.algorithmQueue.push(...positions);
  }

  #horizontalQueue(positions) {
    const [originalX, originalY] = this.originalHit;
    const onlyHorizontals = positions.filter(([posX]) => posX === originalX);

    this.algorithmQueue.push(...onlyHorizontals);
  }

  #verticalQueue(positions) {
    const [originalX, originalY] = this.originalHit;
    const onlyVerticals = positions.filter(
      ([posX, posY]) => posY === originalY,
    );

    this.algorithmQueue.push(...onlyVerticals);
  }

  adjacentAttack(realPlayer) {
    const checkAdjacentCoords = this.algorithmQueue.shift();
    const [x, y] = checkAdjacentCoords;
    const shotResult = realPlayer.gameBoard.receiveAttack(x, y);

    if (shotResult === "hit") {
      const isHorizontal = x === this.originalHit[0];
      if (isHorizontal) {
        this.switchAlgorithmState("horizontal");
        this.filterHorizontalQueue();
      } else {
        this.switchAlgorithmState("vertical");
        this.filterVerticalQueue();
      }

      this.enemyHit();
      this.updateQueue([x, y], realPlayer);
    }

    if (this.algorithmQueue.length <= 0) {
      this.switchAlgorithmState("random");
      this.resetOriginalHit();
      this.resetHits();
    }
    return [x, y];
  }

  removeShipLength() {
    const enemyShipLengthIndex = this.enemyShipsLengths.findIndex(
      (num) => num === this.enemyHits,
    );

    this.enemyShipsLengths.splice(enemyShipLengthIndex, 1);
  }

  horizontalVerticalAttack(realPlayer) {
    const checkNextCoords = this.algorithmQueue.shift();
    const [x, y] = checkNextCoords;
    const shotResult = realPlayer.gameBoard.receiveAttack(x, y);

    const maxValue = Math.max(...this.enemyShipsLengths);

    if (shotResult === "hit") {
      this.enemyHit();

      if (maxValue <= this.enemyHits) {
        this.switchAlgorithmState("random");
        this.removeShipLength();
        this.resetOriginalHit();
        this.resetQueue();
        this.resetHits();
        return [x, y];
      }

      this.updateQueue([x, y], realPlayer);
    }
    if (this.algorithmQueue.length <= 0) {
      this.switchAlgorithmState("random");
      this.removeShipLength();
      this.resetOriginalHit();
      this.resetHits();
    }
    return [x, y];
  }
}

export { Player, ComputerPlayer };
