import { ComputerPlayer, RealPlayer } from "../classes/player.js";
import { createRender } from "../ui/render.js";
import { createEvents } from "../ui/events.js";

export class GameController {
  constructor() {
    this.gameState = "setup";
    this.events = createEvents();
    this.render = createRender();

    this.html = {
      content: document.querySelector("#content"),
      buttonMenu: document.querySelector("#button-menu"),
    };

    this.initMenu();
  }

  resetContainers() {
    this.html.content.innerHTML = "";
    this.html.buttonMenu.innerHTML = "";

    this.html.content = this.events.removeAllEventListeners(this.html.content);
    this.html.buttonMenu = this.events.removeAllEventListeners(
      this.html.buttonMenu,
    );
  }



  //INITIALIZE METHODS

  initMenu() {
    this.gameState = "setup";
    this.resetContainers();
    this.render.applyFadeInAnimation(this.html.content);

    this.render.showMenu(this.html.content);
    this.events.bindSinglePlayerClick(this.html.content, () => {
      this.setupSinglePlayerGame();
    });

    this.events.bindPlayerVersusPlayerClick(this.html.content, () => {
      this.setupPvPGame();
    });
  }

  setupSinglePlayerGame() {
    this.gameState = "setup";

    this.player1 = new RealPlayer("player1", "PLAYER");
    this.player2 = new ComputerPlayer("player2", "AI");
    this.currentPlayer = this.player1.id;
    this.initSinglePlayerSetup(this.player1, ".player1");
  }

  setupPvPGame(player1Name = "PLAYER 1", player2Name = "PLAYER 2") {
    this.gameState = "setup";

    this.player1 = new RealPlayer("player1", player1Name);
    this.player2 = new RealPlayer("player2", player2Name);
    this.currentPlayer = this.player1.id;
    this.initPvPNameSetupPlayer1();
  }

  initBoardSetup(player, boardSelector) {
    player.placeAllShipsRandomly();
    this.resetContainers();
    this.render.showInfo(this.html.content);
    this.render.showPlayingBoard(player, this.html.content);

    this.handleDragEvents(player, boardSelector);
    this.handleRotationClicks(player, boardSelector);
  }

  initSinglePlayerSetup(player, boardSelector) {
    this.player2.placeAllShipsRandomly();
    this.initBoardSetup(player, boardSelector);
    this.handleSetupBtns(
      player,
      "start-game",
      this.initSinglePlayer.bind(this),
    );
  }

  initSinglePlayer() {
    this.gameState = "playing";
    this.resetContainers();

    this.render.showPlayingBoard(this.player1, this.html.content);
    this.render.showPlayingBoard(this.player2, this.html.content);
    this.render.showBackButton(this.html.buttonMenu);
    this.render.removeSetupClass();
    this.render.showShipsInSinglePlayer(this.player1.id);
    this.render.showCurrentNameTag(this.player1);

    const board = document.querySelector(".player2");
    this.events.bindBoardClicks(board, (x, y) => {
      this.handleSinglePlayerTurn(x, y);
    });

    this.events.bindBackMenuClick(this.html.buttonMenu, () => {
      this.initMenu();
    });
  }

  initPvPNameSetup(player, nextCallback) {
    this.resetContainers();

    this.render.showNameSetup(player, this.html.content);
    this.render.showBackButton(this.html.buttonMenu);

    this.events.bindBackMenuClick(this.html.buttonMenu, () => {
      this.initMenu();
    });

    this.events.bindClick(this.html.content, `.${player.id}-name-ready`, () => {
      const name = this.render.getNameInputValue(player.id);
      player.setName(name);
      nextCallback();
    });
  }

  initPvPNameSetupPlayer1() {
    this.initPvPNameSetup(
      this.player1,
      this.initPvPBoardSetupPlayer1.bind(this),
    );
  }

  initPvPNameSetupPlayer2() {
    this.initPvPNameSetup(
      this.player2,
      this.initPvPBoardSetupPlayer2.bind(this),
    );
  }

  initPvPBoardSetupPlayer1() {
    this.initBoardSetup(this.player1, ".player1");
    this.handleSetupBtns(
      this.player1,
      `${this.player1.id}-ready`,
      this.initPvPNameSetupPlayer2.bind(this),
    );
  }

  initPvPBoardSetupPlayer2() {
    this.initBoardSetup(this.player2, ".player2");
    this.handleSetupBtns(
      this.player2,
      `${this.player2.id}-ready`,
      this.initPvPGame.bind(this),
    );
  }

  initPvPGame() {
    this.resetContainers();

    this.gameState = "playing";

    this.render.showPlayingBoard(this.player1, this.html.content);
    this.render.showPlayingBoard(this.player2, this.html.content);
    this.render.showCurrentPlayer(this.player1, this.player2);

    this.render.showBackButton(this.html.buttonMenu);
    this.render.removeSetupClass();

    const player1Board = document.querySelector(".player1");
    this.events.bindBoardClicks(player1Board, (x, y) => {
      this.handlePvPAttack(x, y, this.player2, this.player1);
    });

    const player2Board = document.querySelector(".player2");
    this.events.bindBoardClicks(player2Board, (x, y) => {
      this.handlePvPAttack(x, y, this.player1, this.player2);
    });

    this.events.bindBackMenuClick(this.html.buttonMenu, () => {
      this.initMenu();
    });
  }

  // DRAG EVENT HANDLERS

  handleDragEvents(player, boardSelector) {
    const board = document.querySelector(boardSelector);
    this.events.bindDragStart(board, (x, y, shipIndex) => {
      this.handleDragStart(x, y, shipIndex, player);
    });

    this.events.bindDragOver(board);

    this.events.bindDragEnter(board, (x, y, shipIndex) => {
      this.handleDragEnter(x, y, shipIndex, player);
    });

    this.events.bindDragDrop(board, (x, y, shipIndex) => {
      this.handleDragDrop(x, y, shipIndex, player);
    });
  }

  handleDragStart(x, y, shipIndex, player) {
    if (this.gameState !== "setup") return;

    const ship = player.gameBoard.getShip(shipIndex);
    const length = ship.length;
    const rotation = ship.rotation;

    this.render.showDraggedShip(ship);
    this.render.showGhostShip(x, y, rotation, length);
  }

  handleDragEnter(x, y, shipIndex, player) {
    if (this.gameState !== "setup") return;

    const ship = player.gameBoard.getShip(shipIndex);
    const length = ship.length;
    const rotation = ship.rotation;
    this.render.showGhostShip(x, y, rotation, length);
  }

  handleDragDrop(x, y, shipIndex, player) {
    if (this.gameState !== "setup") return;

    const ship = player.gameBoard.getShip(shipIndex);
    const rotation = ship.rotation;
    const originalPosition = ship.getFirstPosition();

    try {
      this.render.removeShip(ship);

      player.gameBoard.removeShip(shipIndex);
      player.gameBoard.placeShip(shipIndex, [x, y], rotation);

      this.render.updateShip(ship, shipIndex);
    } catch (err) {
      console.error(err);
      player.gameBoard.placeShip(shipIndex, originalPosition, rotation);

      this.render.updateShip(ship, shipIndex);
    }
  }

  // ROTATION SWITCHES

  handleRotationClicks(player, boardSelector) {
    const board = document.querySelector(boardSelector);
    this.events.bindRotationClicks(board, (shipIndex) => {
      this.handleRotation(shipIndex, player);
    });
  }

  handleRotation(shipIndex, player) {
    if (this.gameState !== "setup") return;

    const ship = player.gameBoard.getShip(shipIndex);
    const oldRotation = ship.getRotation();
    const newRotation =
      ship.getRotation() === "horizontal" ? "vertical" : "horizontal";
    const [x, y] = ship.getFirstPosition();

    try {
      this.render.removeShip(ship);

      player.gameBoard.removeShip(shipIndex);
      player.gameBoard.placeShip(shipIndex, [x, y], newRotation);

      this.render.updateShip(ship, shipIndex);
    } catch (err) {
      console.error(err);
      player.gameBoard.placeShip(shipIndex, [x, y], oldRotation);

      this.render.updateShip(ship, shipIndex);
    }
  }

  // SETUP BUTTONS

  handleRandomise(playerObj) {
    playerObj.gameBoard.removeAllShipsFromBoard();
    playerObj.placeAllShipsRandomly();

    this.render.removeAllShips(playerObj.id);
    this.render.updateAllShips(playerObj);
  }

  handleSetupBtns(playerObj, readyButtonClass, gameCallback) {
    this.render.showSetupButtons(this.html.buttonMenu, readyButtonClass);
    this.events.bindClick(this.html.buttonMenu, `.${readyButtonClass}`, () => {
      gameCallback();
    });

    this.events.bindClick(this.html.buttonMenu, ".back-btn", () => {
      this.initMenu();
    });

    this.events.bindClick(this.html.buttonMenu, ".randomise", () => {
      this.handleRandomise(playerObj);
    });
  }

  // PLAYER VS COMPUTER

  handleSinglePlayerTurn(x, y) {
    if (this.gameState !== "playing") return;
    if (this.currentPlayer !== this.player1.id) return;

    this.player2.gameBoard.receiveAttack(x, y);
    this.render.showHitandMiss(x, y, this.player2.id);

    if (this.player2.gameBoard.allShipsSunk) {
      this.endGame(this.player1);

      this.events.bindPlayAgain(() => {
        this.setupSinglePlayerGame();
      });

    } else {
      this.handleComputerTurn();
    }
  }

  handleComputerTurn() {
    // Make the computer player the current player
    this.handlePlayerSwitch(this.player1, this.player2);

    setTimeout(() => {
      if (this.gameState !== "playing") return;
      this.validateComputerAttacks();

      // After the computer player's turn, make the real player the current player again
      this.handlePlayerSwitch(this.player2, this.player1);
    }, 1000);
  }

  handlePvPAttack(x, y, currentPlayer, opponentPlayer) {
    if (this.gameState !== "playing") return;
    if (this.currentPlayer !== currentPlayer.id) return;

    opponentPlayer.gameBoard.receiveAttack(x, y);
    this.render.showHitandMiss(x, y, opponentPlayer.id);

    if (opponentPlayer.gameBoard.allShipsSunk) {
      this.endGame(currentPlayer);
      this.events.bindPlayAgain(() => {
        const name1 = opponentPlayer.name;
        const name2 = currentPlayer.name;

        this.setupPvPGame(name1, name2);
      });

      return;
    }

    this.handlePlayerSwitch(currentPlayer, opponentPlayer);
  }

  handlePlayerSwitch(currentPlayer, opponentPlayer) {
    this.render.hideCurrentPlayer(currentPlayer, opponentPlayer);
    this.render.showCurrentPlayer(opponentPlayer, currentPlayer);
    this.switchCurrentPlayer();
  }

  switchCurrentPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.player1.id
        ? this.player2.id
        : this.player1.id;
  }

  validateComputerAttacks() {
    if (this.gameState !== "playing") return;
    if (this.currentPlayer !== this.player2.id) return;

    const [targetX, targetY] = this.player2.attack(this.player1);
    this.render.showHitandMiss(targetX, targetY, this.player1.id);

    if (this.player1.gameBoard.allShipsSunk) {
      this.endGame(this.player2);
      this.events.bindPlayAgain(() => {
        this.setupSinglePlayerGame();
      });
    }
  }

  // GAME OVER

  endGame(winner) {
    this.gameState = "gameover";

    const modal = document.querySelector(".winner-modal");
    const para = document.querySelector(".winner-text");

    this.render.applyFadeInAnimation(modal);

    para.textContent = `${winner.name} wins!`;
    modal.showModal();

    this.events.bindModalExit(modal, this.initMenu.bind(this));
  }
}
