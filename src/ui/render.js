const render = {
  drawContainer(...classNames) {
    const container = document.createElement("div");

    classNames.forEach((className) => {
      container.classList.add(className);
    });

    return container;
  },

  // MENU

  drawButton(className, text) {
    const button = document.createElement("button");
    button.classList.add(className);
    button.textContent = text;

    return button;
  },

  showMenu(container) {
    const menuContainer = this.drawContainer("menu");
    const singlePlayerBtn = this.drawButton("single-player", "Single player");
    menuContainer.appendChild(singlePlayerBtn);

    container.appendChild(menuContainer);
  },

  showSetupButtons(container) {
    const buttonsContainer = this.drawContainer("options");
    const backBtn = this.drawButton("back-btn", "Menu");
    const randomizeBtn = this.drawButton("randomize", "Randomise")
    const startBtn = this.drawButton("start-game", "Start");

    buttonsContainer.appendChild(backBtn);
    buttonsContainer.appendChild(randomizeBtn);
    buttonsContainer.appendChild(startBtn);

    container.appendChild(buttonsContainer);
  },

  // GAMEBOARD

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

  renderGrid(playerObj) {
    const board = this.drawContainer("board-grid", playerObj.id);
    board.innerHTML = "";
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;

        const position = playerObj.gameBoard.getPosition(x, y);
        if (typeof position === "string") {
          const index = playerObj.gameBoard.getShipIndex(position);
          cell.classList.add("ship");
          cell.dataset.shipIndex = index;
        }

        board.appendChild(cell);
      }
    }

    return board;
  },

  buildBoard(containerClass) {
    const mainBoardContainer = this.drawContainer(containerClass);
    const leftCoords = this.drawLeftCoordinates();
    const topCoords = this.drawTopCoordinates();

    mainBoardContainer.appendChild(topCoords);
    mainBoardContainer.appendChild(leftCoords);

    return mainBoardContainer;
  },

  showPlayingBoard(playerObj, container) {
    const boardContainer = this.buildBoard("board-container");
    const grid = this.renderGrid(playerObj);

    boardContainer.appendChild(grid);
    container.appendChild(boardContainer);
  },

  //ACTIONS

  showHitandMiss(x, y, playerId) {
    const cell = document.querySelector(
      `.${playerId} > [data-x="${x}"][data-y="${y}"]`,
    );

    cell.classList.contains("ship")
      ? cell.classList.add("hit")
      : cell.classList.add("miss");
  },

  removeShip(shipObj) {
    shipObj.coords.forEach(([x, y]) => {
      const selector = `.cell[data-x="${x}"][data-y="${y}"]`;
      const shipCell = document.querySelector(selector);
      shipCell.classList.remove("ship");

      delete shipCell.dataset.shipIndex;
    });
  },

  updateShip(shipObj, shipIndex) {
    shipObj.coords.forEach(([x, y]) => {
      const selector = `.cell[data-x="${x}"][data-y="${y}"]`;
      const shipCell = document.querySelector(selector);
      shipCell.classList.add("ship");
      shipCell.dataset.shipIndex = shipIndex;
    });
  },

  showGhostShip(x, y, shipRotation, shipLength) {
    document
      .querySelectorAll(".ghost")
      .forEach((c) => c.classList.remove("ghost"));

    for (let i = 0; i < shipLength; i++) {
      let selector;
      if (shipRotation === "vertical") {
        const currentX = x + i;
        const currentY = y;
        if (currentX >= 10) break;
        selector = `.cell[data-x="${currentX}"][data-y="${currentY}"]`;
      } else if (shipRotation === "horizontal") {
        const currentX = x;
        const currentY = y + i;
        if (currentY >= 10) break;
        selector = `.cell[data-x="${currentX}"][data-y="${currentY}"]`;
      } else {
        const currentX = x + i;
        const currentY = y;
        if (currentX >= 10) break;
        selector = `.cell[data-x="${currentX}"][data-y="${currentY}"]`;
      }

      const shipCell = document.querySelector(selector);
      if (shipCell) shipCell.classList.add("ghost");
    }
  },
};

export { render };
