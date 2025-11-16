export function createRender() {
  return {
    drawContainer(...classNames) {
      const container = document.createElement("div");

      classNames.forEach((className) => {
        container.classList.add(className);
      });

      return container;
    },

    // MENU AND BUTTONS

    drawButton(className, text) {
      const button = document.createElement("button");
      button.classList.add(className);
      button.textContent = text;

      return button;
    },

    showMenu(container) {
      const menuContainer = this.drawContainer("menu");
      const singlePlayerBtn = this.drawButton("single-player", "PLAYER VS AI");
      const pvpBtn = this.drawButton("pvp", "PLAYER VS PLAYER");
      menuContainer.appendChild(singlePlayerBtn);
      menuContainer.appendChild(pvpBtn);

      container.appendChild(menuContainer);
    },

    showBackButton(container) {
      const backBtn = this.drawButton("back-btn", "MENU");
      container.appendChild(backBtn);
    },

    showSetupButtons(container, readyButtonClass) {
      const buttonsContainer = this.drawContainer("options");
      const backBtn = this.drawButton("back-btn", "MENU");
      const randomizeBtn = this.drawButton("randomise", "RANDOMISE");
      const startBtn = this.drawButton(readyButtonClass, "READY");

      buttonsContainer.appendChild(backBtn);
      buttonsContainer.appendChild(randomizeBtn);
      buttonsContainer.appendChild(startBtn);

      container.appendChild(buttonsContainer);
    },

    // PVP NAME SETUP

    buildNameInput(playerId) {
      const container = this.drawContainer("pvp-name");
      const label = document.createElement("label");
      label.textContent = "Type your name"
      label.setAttribute("for", `${playerId}-name`);
      
      const input = document.createElement("input");
      input.id = `${playerId}-name`
      
      container.appendChild(label);
      container.appendChild(input);
      return container;
    },
    
    showNameSetup(playerObj, container) {
      const mainContainer = this.drawContainer("pvp-setup");
      const header = document.createElement("h1");
      header.textContent = playerObj.name;
      
      const nameInput = this.buildNameInput(playerObj.id);
      const button = this.drawButton(`${playerObj.id}-ready`, "READY");

      mainContainer.appendChild(header);
      mainContainer.appendChild(nameInput);
      mainContainer.appendChild(button);

      container.appendChild(mainContainer);
    },

    getNameInputValue(playerId) {
      const name = document.querySelector(`#${playerId}-name`).value;
      return name;
    },

    // GAMEBOARD

    drawNameTag(playerName) {
      const container = this.drawContainer("player-name");
      const nameTag = document.createElement("h1");
      nameTag.textContent = playerName;

      container.appendChild(nameTag);
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

    renderGrid(playerObj, board) {
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

    buildBoard(containerClass, playerName) {
      const nameBoard = this.drawNameTag(playerName);
      const mainBoardContainer = this.drawContainer(containerClass);
      const leftCoords = this.drawLeftCoordinates();
      const topCoords = this.drawTopCoordinates();

      mainBoardContainer.appendChild(nameBoard);
      mainBoardContainer.appendChild(topCoords);
      mainBoardContainer.appendChild(leftCoords);

      return mainBoardContainer;
    },

    showPlayingBoard(playerObj, container) {
      const boardContainer = this.buildBoard("board-container", playerObj.name);
      const gridContainer = this.drawContainer(
        "board-grid",
        "setup",
        playerObj.id,
      );
      const grid = this.renderGrid(playerObj, gridContainer);

      boardContainer.appendChild(grid);
      container.appendChild(boardContainer);
    },

    //ACTIONS

    removeSetupClass() {
      document.querySelectorAll(".setup").forEach((el) => {
        el.classList.remove("setup");
      });
    },

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

    showDraggedShip(shipObj) {
      shipObj.coords.forEach(([x, y]) => {
        const selector = `.cell[data-x="${x}"][data-y="${y}"]`;
        const shipCell = document.querySelector(selector);
        shipCell.classList.add("dragging");
      });
    },

    removeDraggedShip(coords) {
      coords.forEach(([x, y]) => {
        const selector = `.cell[data-x="${x}"][data-y="${y}"]`;
        const shipCell = document.querySelector(selector);
        shipCell.classList.remove("dragging");
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

    removeAllShips(playerId) {
      document
        .querySelectorAll(`.board-grid.${playerId} > .ship`)
        .forEach((cell) => {
          cell.classList.remove("ship");
          delete cell.dataset.shipIndex;
        });
    },

    updateAllShips(playerObj) {
      const ships = playerObj.gameBoard.ships;

      ships.forEach((ship, index) => {
        this.updateShip(ship, index);
      });
    },
  };
}
