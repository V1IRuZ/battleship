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

    test("throws an error for out of bounds horizontal placements", () => {
      expect(() => gameBoard.placeShip(0, [2, 8], "horizontal")).toThrow(
        "Ship placement out of bounds horizontally",
      );
    });

    test("throws an error for out of bounds horizontal placements", () => {
      expect(() => gameBoard.placeShip(1, [7, 3], "vertical")).toThrow(
        "Ship placement out of bounds vertically",
      );
    });

    test("throws an error for overlapping placements", () => {
      gameBoard.placeShip(0, [1, 0], "horizontal");
      expect(() => gameBoard.placeShip(1, [0, 1], "vertical")).toThrow(
        "Overlapping or adjacent placements are not allowed",
      );
    });

    test("throws an error for adjacent placements", () => {
      gameBoard.placeShip(0, [0, 0], "horizontal");
      expect(() => gameBoard.placeShip(1, [1, 1], "vertical")).toThrow(
        "Overlapping or adjacent placements are not allowed",
      );
    });

    test("throws an error for diagnol adjacent placements", () => {
      gameBoard.placeShip(0, [0, 0], "horizontal");
      expect(() => gameBoard.placeShip(1, [1, 5], "vertical")).toThrow(
        "Overlapping or adjacent placements are not allowed",
      );
    });
  });

  describe("receiveAttack method", () => {
    test("registers a missed hit", () => {
      gameBoard.receiveAttack(2, 2);
      expect(gameBoard.board[2][2]).toBe("miss");
    });

    test("registers a hit", () => {
      gameBoard.placeShip(1, [1, 0], "horizontal");
      gameBoard.receiveAttack(1, 2);
      expect(gameBoard.board[1][2]).toBe("hit");
    });

    test("registers a hit on the right ship", () => {
      gameBoard.placeShip(1, [1, 0], "horizontal");
      gameBoard.receiveAttack(1, 2);
      expect(gameBoard.ships[1].hits).toBe(1);
    });

    test("does not register a hit in the same location", () => {
      gameBoard.placeShip(0, [5, 0], "horizontal");
      gameBoard.receiveAttack(5, 1);
      gameBoard.receiveAttack(5, 1);
      expect(gameBoard.ships[0].hits).toBe(1);
    });
  });

  describe("allShipsSunk method", () => {
    test("returns true if all ships are sunk", () => {
      gameBoard.ships.forEach((ship) => {
        ship.hits = ship.length;
      });

      expect(gameBoard.allShipsSunk).toBe(true);
    });

    test("returns false if no ships have sunk", () => {
      expect(gameBoard.allShipsSunk).toBe(false);
    });

    test("returns false if not all ships have sunk", () => {
      gameBoard.ships[0].hits = 5;
      gameBoard.ships[1].hits = 4;

      expect(gameBoard.allShipsSunk).toBe(false);
    });
  });
});
