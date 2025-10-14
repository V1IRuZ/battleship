import { Ship } from "../classes/ships.js";

describe("Ship class", () => {
  let ship;
  
  beforeEach(() => {
    ship = new Ship(3);
  });

  describe("hit method", () => {
    test("increases the number of hits in your ship", () => {
      ship.hit();
      expect(ship.hits).toBe(1);
    });
  });
});
