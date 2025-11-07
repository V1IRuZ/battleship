import { Gameboard } from "./gameboard.js";

class Player {
  constructor(id) {
    this.id = id;
    this.gameBoard = new Gameboard();
  }

  #placeShipRandomly(index) {
    let attempts = 0;
    let placed = false;
    while (!placed && attempts < 1000) {
      try {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);

        const rotation = Math.random() < 0.5 ? "horizontal" : "vertical";

        this.gameBoard.placeShip(index, [x, y], rotation);
        placed = true;
      } catch (err) {
        console.error(err);

        attempts++;
      }
    }

    if (!placed) {
      throw new Error(`Could not place ships after ${attempts} attempts`);
    }
  }

  placeAllShipsRandomly() {
    this.gameBoard.ships.forEach((ship, index) => {
      this.#placeShipRandomly(index);
    });
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

  validateEmptyQueue() {
    if (this.algorithmQueue.length <= 0) {
      this.removeShipLength();
      this.switchAlgorithmState("random");
      this.resetOriginalHit();
      this.resetQueue();
      this.resetHits();
    }
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

  #validateRandomHit(hitX, hitY, realPlayer) {
    const shotResult = realPlayer.gameBoard.receiveAttack(hitX, hitY);

    if (shotResult === "hit") {
      this.setOriginalHit([hitX, hitY]);
      this.enemyHit();
      this.switchAlgorithmState("adjacent");
      this.updateQueue([hitX, hitY], realPlayer);
    }
  }

  randomAttack(realPlayer) {
    while (true) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      const playerCoords = realPlayer.gameBoard.getPosition(x, y);

      const allreadyAttacked =
        playerCoords === "miss" || playerCoords === "hit";

      if (!allreadyAttacked) {
        this.#validateRandomHit(x, y, realPlayer);
        this.validateEmptyQueue();

        return [x, y];
      }
    }
  }

  #filterHorizontalQueue() {
    const [originalX, originalY] = this.originalHit;
    const filtered = this.algorithmQueue.filter(([x, y]) => x === originalX);
    this.algorithmQueue = filtered;
  }

  #filterVerticalQueue() {
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
          realPlayer.gameBoard.getPosition(x, y) !== "miss" &&
          realPlayer.gameBoard.getPosition(x, y) !== "hit",
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

  validateAlgorithmRotation(targetX) {
    const isHorizontal = targetX === this.originalHit[0];
    if (isHorizontal) {
      this.switchAlgorithmState("horizontal");
      this.#filterHorizontalQueue();
    } else {
      this.switchAlgorithmState("vertical");
      this.#filterVerticalQueue();
    }
  }

  adjacentAttack(realPlayer) {
    const [x, y] = this.algorithmQueue.shift();
    const shotResult = realPlayer.gameBoard.receiveAttack(x, y);

    if (shotResult === "hit") {
      this.validateAlgorithmRotation(x);

      this.enemyHit();
      this.updateQueue([x, y], realPlayer);
    }

    this.validateEmptyQueue();

    return [x, y];
  }

  removeShipLength() {
    if (this.algorithm === "random") return;

    const enemyShipLengthIndex = this.enemyShipsLengths.findIndex(
      (num) => num === this.enemyHits,
    );

    this.enemyShipsLengths.splice(enemyShipLengthIndex, 1);
  }

  #checkIfShipSunk() {
    const maxValue = Math.max(...this.enemyShipsLengths);

    if (this.enemyHits >= maxValue) {
      this.removeShipLength();
      this.switchAlgorithmState("random");
      this.resetOriginalHit();
      this.resetQueue();
      this.resetHits();
      return true;
    }

    return false;
  }

  horizontalVerticalAttack(realPlayer) {
    const [x, y] = this.algorithmQueue.shift();
    const shotResult = realPlayer.gameBoard.receiveAttack(x, y);

    if (shotResult === "hit") {
      this.enemyHit();

      if (this.#checkIfShipSunk()) {
        return [x, y];
      }

      this.updateQueue([x, y], realPlayer);
    }

    this.validateEmptyQueue();

    return [x, y];
  }
}

export { Player, ComputerPlayer };
