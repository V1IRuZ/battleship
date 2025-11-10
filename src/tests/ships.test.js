import { Ship } from "../classes/ships.js";

describe("Ship class", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship("Carrier", 3);
  });

  describe("hit method", () => {
    test("increases the number of hits in your ship", () => {
      ship.hit();
      expect(ship.hits).toBe(1);
    });

    test("increases the number of multiple hits in your ship", () => {
      ship.hit();
      ship.hit();
      expect(ship.hits).toBe(2);
    });
  });

  describe("isSunk method", () => {
    test("calculates whether the ship has sunk", () => {
      ship.hit();
      expect(ship.isSunk).toBe(false);
    });

    test("returns true when the ship sinks", () => {
      ship.hit();
      ship.hit();
      ship.hit();

      expect(ship.isSunk).toBe(true);
    });
  });

  describe("setCoords method", () => {
    test("adds ship coordinates", () => {
      ship.setCoords([2, 3]);
      expect(ship.coords).toEqual([[2, 3]]);
    });
  });

  test("adds multiple coordinates", () => {
    ship.setCoords([3, 5]);
    ship.setCoords([3, 6]);
    expect(ship.coords).toEqual([
      [3, 5],
      [3, 6],
    ]);
  });

  describe("resetCoords method", () => {
    test("resets coordinates", () => {
      ship.setCoords([3, 5]);
      ship.setCoords([3, 6]);
      ship.resetCoords();
      expect(ship.coords).toEqual([]);
    });
  });

  describe("setPlaced method", () => {
    test("property returns false by defaul", () => {
      expect(ship.placed).toBe(false);
    });

    test("switches to true", () => {
      ship.setPlaced();
      expect(ship.placed).toBe(true);
    });

    test("switches back to false", () => {
      ship.setPlaced();
      ship.setPlaced();
      expect(ship.placed).toBe(false);
    });
  });
});
