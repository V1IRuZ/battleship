import { Gameboard } from "../classes/gameboard.js";

describe("Gameboard class", () => {
  let gameBoard;
  beforeEach(() => {
    gameBoard = new Gameboard();
  });

  describe("placeShip method", () => {
    test("places ship on gameboard", () => {
      gameBoard.placeShip(0, [3, 3], "horizontal");
      expect(gameBoard.board[3][3]).toBe("carrier");
    });

    test.each([
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ])("fills consecutive cells based on ship length (%p, %p)", (x, y) => {
      gameBoard.placeShip(1, [1, 1], "horizontal");
      expect(gameBoard.board[x][y]).toBe("battleship");
    });

    test("only fills the cells marked for it", () => {
      gameBoard.placeShip(1, [1, 1], "horizontal");
      expect(gameBoard.board[1][5]).toBe(null);
    });

    test.each([
      [2, 5],
      [3, 5],
      [4, 5],
    ])("fills cells vertically as well (%p, %p)", (x, y) => {
      gameBoard.placeShip(2, [2, 5], "vertical");
      expect(gameBoard.board[x][y]).toBe("cruiser1");
    });

    test("only filles the cells marked for it vertically", () => {
      gameBoard.placeShip(2, [2, 5], "vertical");
      expect(gameBoard.board[5][5]).toBe(null);
    });
  });
});
