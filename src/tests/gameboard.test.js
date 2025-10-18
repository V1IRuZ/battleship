import { Gameboard } from "../classes/gameboard.js";

describe("Gameboard class", () => {
  let gameBoard;
  beforeEach(() => {
    gameBoard = new Gameboard();
  });

  describe("placeShip method", () => {
    test("places ship on gameboard", () => {
      gameBoard.placeShip(0, [3, 3]);
      expect(gameBoard.board[3][3]).toBe("carrier");
    });
  });
});
