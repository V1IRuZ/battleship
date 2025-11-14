import { ComputerPlayer, Player } from "../classes/player.js";
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
  }

  //INITIALIZE METHODS

  initMenu() {
    this.player1 = new Player("player1");
    this.player2 = new ComputerPlayer("player2");

    this.gameState = "setup";
    this.resetContainers();

    this.render.showMenu(this.html.content);
    this.events.bindSinglePlayerClick(this.html.content, () =>
      this.initSinglePlayerSetup(this.player1, ".player1"),
    );
  }

  initSinglePlayerSetup(player, boardSelector) {
    this.player1.placeAllShipsRandomly();
    this.player2.placeAllShipsRandomly();

    this.resetContainers();
    this.render.showPlayingBoard(player, this.html.content);

    this.handleDragEvents(player, boardSelector);
    this.handleRotationClicks(player, boardSelector);
    this.handleSetupBtns(player);
  }

  initSinglePlayer() {
    this.gameState = "playing";
    this.resetContainers();

    this.render.showPlayingBoard(this.player1, this.html.content);
    this.render.showPlayingBoard(this.player2, this.html.content);

    const board = document.querySelector(".player2");
    this.events.bindBoardClicks(board, (x, y) => {
      this.handleAttack(x, y);
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
    this.player1.gameBoard.removeAllShipsFromBoard();
    this.player1.placeAllShipsRandomly();
    
    this.render.removeAllShips(playerObj.id);
    this.render.updateAllShips(playerObj);
  }

  handleSetupBtns(playerObj) {
    this.render.showSetupButtons(this.html.buttonMenu);
    this.events.bindStartGameClick(this.html.buttonMenu, () => {
      this.initSinglePlayer();
    });

    this.events.bindBackMenuClick(this.html.buttonMenu, () => {
      this.initMenu();
    });

    this.events.bindRandomiseClick(this.html.buttonMenu, () => {
      this.handleRandomise(playerObj);
    });
  }

  // PLAYER VS COMPUTER

  handleAttack(x, y) {
    if (this.gameState !== "playing") return;

    this.player2.gameBoard.receiveAttack(x, y);
    this.render.showHitandMiss(x, y, this.player2.id);

    if (this.player2.gameBoard.allShipsSunk) {
      this.endGame(this.player1);
    } else {
      this.validateComputerAttacks();
    }
  }

  validateComputerAttacks() {
    if (this.gameState !== "playing") return;

    const [targetX, targetY] = this.player2.attack(this.player1);
    this.render.showHitandMiss(targetX, targetY, this.player1.id);

    if (this.player1.gameBoard.allShipsSunk) {
      this.endGame(this.player2);
    }
  }

  // GAME OVER

  endGame(winner) {
    this.gameState = "gameover";
    console.log(`${winner.id} wins!`);
  }
}
