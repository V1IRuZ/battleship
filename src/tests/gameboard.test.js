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

    test.each([
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ])("fills consecutive cells based on ship length (%p, %p)", (x, y) => {
      gameBoard.placeShip(1, [1, 1]);
      expect(gameBoard.board[x][y]).toBe("battleship");
    });
  });
});
