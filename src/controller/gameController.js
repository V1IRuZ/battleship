import { ComputerPlayer, Player } from "../classes/player.js";
import { render } from "../ui/render.js";
import { events } from "../ui/events.js";

export class GameController {
  constructor() {
    this.player1 = new Player("player1");
    this.player2 = new ComputerPlayer("player2");

    this.initSinglePlayer();
  }

  initSinglePlayer() {
    const content = document.querySelector("#content");
    this.player1.placeAllShipsRandomly();
    this.player2.placeAllShipsRandomly();

    render.showBoards(this.player1, content);
    render.showBoards(this.player2, content);

    const board = document.querySelector(".player2");
    events.bindBoardClicks(board, (x, y) => {
      this.handleSinglePlayerClicks(x, y);
    });
  }

  handleSinglePlayerClicks(x, y) {
    this.player2.gameBoard.receiveAttack(x, y);
    render.showHitandMiss(x, y, this.player2.id);

    // Return allowed computer player hits
    const [targetX, targetY] = this.player2.attack(this.player1);
    render.showHitandMiss(targetX, targetY, this.player1.id);
  }
}
