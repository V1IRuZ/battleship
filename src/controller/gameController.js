import { ComputerPlayer, Player } from "../classes/player.js";
import { render } from "../ui/render.js";
import { events } from "../ui/events.js";

export class GameController {
  constructor() {
    this.player1 = new Player("player1");
    this.player2 = new ComputerPlayer("player2");
    this.gameState = "setup";

    this.html = {
      content: document.querySelector("#content"),
    };

    this.initMenu();
  }

  initMenu() {
    this.gameState = "setup";
    this.html.content.innerHTML = "";

    render.showMenu(this.html.content);
    events.bindSinglePlayerClick(this.html.content, () =>
      // this.initSinglePlayer(),
      this.initSinglePlayerSetup(this.player1, ".player1"),
    );
  }

  initSinglePlayerSetup(player, boardSelector) {
    this.html.content.innerHTML = "";
    this.player1.placeAllShipsRandomly();
    render.showPlayingBoard(player, this.html.content);

    this.handleDragEvents(player, boardSelector);
  }

  handleDragStart(x, y, shipIndex, player) {
    const ship = player.gameBoard.getShip(shipIndex);
    const length = ship.length;
    const rotation = ship.rotation;
    render.showGhostShip(x, y, rotation, length);
  }

  handleDragEnter(x, y, shipIndex, player) {
    const ship = player.gameBoard.getShip(shipIndex);
    const length = ship.length;
    const rotation = ship.rotation;
    render.showGhostShip(x, y, rotation, length);
  }

  handleDragDrop(x, y, shipIndex, player) {
    const ship = player.gameBoard.getShip(shipIndex);
    const rotation = ship.rotation;
    const originalPosition = ship.getFirstPosition();

    try {
      render.removeShip(ship);

      player.gameBoard.removeShip(shipIndex);
      player.gameBoard.placeShip(shipIndex, [x, y], rotation);

      render.updateShip(ship, shipIndex);
    } catch (err) {
      console.error(err);
      player.gameBoard.placeShip(shipIndex, originalPosition, rotation);

      render.updateShip(ship, shipIndex);
    }
  }

  handleDragEvents(player, boardSelector) {
    const board = document.querySelector(boardSelector);
    events.bindDragStart(board, (x, y, shipIndex) => {
      this.handleDragStart(x, y, shipIndex, player);
    });

    events.bindDragOver(board);

    events.bindDragEnter(board, (x, y, shipIndex) => {
      this.handleDragEnter(x, y, shipIndex, player);
    });

    events.bindDragDrop(board, (x, y, shipIndex) => {
      this.handleDragDrop(x, y, shipIndex, player);
    });
  }

  initSinglePlayer() {
    this.gameState = "playing";
    this.html.content.innerHTML = "";

    this.player1.placeAllShipsRandomly();
    this.player2.placeAllShipsRandomly();

    render.showPlayingBoard(this.player1, this.html.content);
    render.showPlayingBoard(this.player2, this.html.content);

    const board = document.querySelector(".player2");
    events.bindBoardClicks(board, (x, y) => {
      this.handleAttack(x, y);
    });
  }

  handleAttack(x, y) {
    if (this.gameState !== "playing") return;

    this.player2.gameBoard.receiveAttack(x, y);
    render.showHitandMiss(x, y, this.player2.id);

    if (this.player2.gameBoard.allShipsSunk) {
      this.endGame(this.player1);
    } else {
      this.validateComputerAttacks();
    }
  }

  validateComputerAttacks() {
    if (this.gameState !== "playing") return;

    const [targetX, targetY] = this.player2.attack(this.player1);
    render.showHitandMiss(targetX, targetY, this.player1.id);

    if (this.player1.gameBoard.allShipsSunk) {
      this.endGame(this.player2);
    }
  }

  endGame(winner) {
    this.gameState = "gameover";
    console.log(`${winner.id} wins!`);
  }
}
