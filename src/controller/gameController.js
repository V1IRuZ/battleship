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
    this.player1.defaultPlacement();
    this.player2.defaultPlacement();

    render.showBoards(this.player1, content);
    render.showBoards(this.player2, content);

    const board = document.querySelector(".player2");
    events.bindBoardClicks(board, (x, y) => {
      this.handleSinglePlayerClicks(x, y);
    });
  }

  validateComputerAttacks() {
    let attempts = 0;

    while (attempts < 100) {
      const [x, y] = this.player2.attack();
      const player1Coords = this.player1.gameBoard.board[x][y];
      console.log(player1Coords);

      const allreadyAttacked =
        player1Coords === "miss" || player1Coords === "hit";

      if (!allreadyAttacked) {
        this.player1.gameBoard.receiveAttack(x, y);
        render.showHitandMiss(x, y, this.player1.id);
        return;
      }

      attempts++;
    }
  }

  handleSinglePlayerClicks(x, y) {
    this.player2.gameBoard.receiveAttack(x, y);
    render.showHitandMiss(x, y, this.player2.id);

    this.validateComputerAttacks();
  }
}
