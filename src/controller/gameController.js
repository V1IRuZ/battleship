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
      this.handleSinglePlayerClicks(x, y)
    });
  }

  handleSinglePlayerClicks(x, y) {
    try {
      this.player2.gameBoard.receiveAttack(x, y);
      render.showHitandMiss(x, y, this.player2.id);
      
      const randomX = Math.floor(Math.random() * 10);
      const randomY = Math.floor(Math.random() * 10);
      
      this.player1.gameBoard.receiveAttack(randomX, randomY);
      render.showHitandMiss(randomX, randomY, this.player1.id);
    } catch(err) {
      console.log(err);
    }
  }
}
