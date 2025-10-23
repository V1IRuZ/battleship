import { Player } from "../classes/player.js";
import { render } from "../ui/render.js";
import { events } from "../ui/events.js";

export class GameController {
  constructor() {
    this.player1 = new Player("player1");
    this.player2 = new Player("player2");

    this.init();
  }

  init() {
    const content = document.querySelector("#content");
    this.player1.defaultPlacement();
    this.player2.defaultPlacement();
    
    render.showBoards(this.player1, content);
    render.showBoards(this.player2, content);

    events.bindBoardClicks((x, y) => this.handleBoardClicks(x, y, this.player2));
  }

  handleBoardClicks(x, y, playerObj) {
    playerObj.gameBoard.receiveAttack(x, y);
    render.showHitandMiss(x, y, playerObj.id);
  }
}
