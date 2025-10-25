import { ComputerPlayer } from "../classes/player.js";

describe("ComputerPlayer class", () => {
  let player;

  beforeEach(() => {
    player = new ComputerPlayer("player");
  });

  describe("switchAlgorithmState method", () => {
    test("return false by default", () => {
      expect(player.successfulHit).toBe(false);
    });

    test("switches property state", () => {
      player.switchAlgorithmState();
      expect(player.successfulHit).toBe(true);
    });

    test("swiches property state multiple times", () => {
      player.switchAlgorithmState();
      player.switchAlgorithmState();
      expect(player.successfulHit).toBe(false);
    });
  });
});
