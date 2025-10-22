import { Player } from "../classes/player.js";
import { render } from "../ui/render.js";
import { events } from "../ui/events.js";

export class GameController {
  constructor() {
    this.player1 = new Player();
    this.player2 = new Player();

    this.init();
  }

  init() {
    const content = document.querySelector("#content");

    const player1Board = document.createElement("div");
    player1Board.classList.add("board");
    this.player1.defaultPlacement();
    render.drawBoard(player1Board, this.player1.gameBoard.board);
    content.appendChild(player1Board);

    const player2Board = document.createElement("div");
    player2Board.classList.add("board");
    player2Board.classList.add("opponent");
    this.player2.defaultPlacement();
    render.drawBoard(player2Board, this.player2.gameBoard.board);
    content.appendChild(player2Board);

    events.bindBoardClicks((x, y) => this.handleBoardClicks(x, y));
  }

  handleBoardClicks(x, y) {
    this.player2.gameBoard.receiveAttack(x, y);
    render.showHitandMiss(x, y);
  }
}
