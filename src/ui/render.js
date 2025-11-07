const render = {
  drawBoardContainer() {
    const container = document.createElement("div");
    container.classList.add("board-container");
    return container;
  },

  drawTopCoordinates() {
    const coords = document.createElement("div");
    coords.classList.add("x-coords");

    const alphabets = "ABCDEFGHIJ";

    for (let i = 0; i < alphabets.length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("x-cell");

      cell.textContent = `${alphabets[i]}`;
      coords.appendChild(cell);
    }

    return coords;
  },

  drawLeftCoordinates() {
    const coords = document.createElement("div");
    coords.classList.add("y-coords");

    for (let i = 1; i <= 10; i++) {
      const cell = document.createElement("div");
      cell.classList.add("y-cell");
      cell.textContent = `${i}`;
      coords.appendChild(cell);
    }

    return coords;
  },

  drawGridContainer(playerId) {
    const board = document.createElement("div");
    board.classList.add("board-grid");
    board.classList.add(`${playerId}`);
    return board;
  },

  renderGrid(boardElement, gameBoardObj) {
    boardElement.innerHTML = "";
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;

        const position = gameBoardObj.getPosition(x, y);
        if (typeof position === "string") {
          cell.classList.add("ship");
        }

        boardElement.appendChild(cell);
      }
    }
  },

  showBoards(playerObj, container) {
    const mainBoardContainer = this.drawBoardContainer();
    const leftCoords = this.drawLeftCoordinates();
    const topCoords = this.drawTopCoordinates();
    const gridContainer = this.drawGridContainer(playerObj.id);

    this.renderGrid(gridContainer, playerObj.gameBoard);

    mainBoardContainer.appendChild(topCoords);
    mainBoardContainer.appendChild(leftCoords);
    mainBoardContainer.appendChild(gridContainer);
    container.appendChild(mainBoardContainer);
  },

  showHitandMiss(x, y, playerId) {
    const cell = document.querySelector(
      `.${playerId} > [data-x="${x}"][data-y="${y}"]`,
    );

    cell.classList.contains("ship")
      ? cell.classList.add("hit")
      : cell.classList.add("miss");
  },
};

export { render };
