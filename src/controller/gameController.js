import { Player } from "../classes/player.js";
import { render } from "../ui/render.js";

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
    render.drawBoard(player1Board);
    content.appendChild(player1Board);

    const player2Board = document.createElement("div");
    player2Board.classList.add("board");
    render.drawBoard(player2Board);
    content.appendChild(player2Board);  
  }
}
