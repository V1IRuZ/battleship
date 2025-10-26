import { ComputerPlayer, Player } from "../classes/player.js";

describe("ComputerPlayer class", () => {
  let computerPlayer;
  let realPlayer;

  beforeEach(() => {
    computerPlayer = new ComputerPlayer("player");
    realPlayer = new Player("opponent");
  });

  describe("switchAlgorithmState method", () => {
    test("algorithm property returns random by default", () => {
      expect(computerPlayer.algorithm).toBe("random");
    });

    test("switches algorithm property state to adjacent", () => {
      computerPlayer.switchAlgorithmState("adjacent");
      expect(computerPlayer.algorithm).toBe("adjacent");
    });

    test("swiches algorithm property state to horizontal", () => {
      computerPlayer.switchAlgorithmState("horizontal");
      expect(computerPlayer.algorithm).toBe("horizontal");
    });

    test("switches algorithm property state to vertical", () => {
      computerPlayer.switchAlgorithmState("vertical");
      expect(computerPlayer.algorithm).toBe("vertical");
    });
  });

  describe("updateQueue method", () => {
    test("returns array length of 2", () => {
      computerPlayer.updateQueue([0, 0], realPlayer);
      expect(computerPlayer.algorithmQueue.length).toBe(2);
    });

    test("returns array length of 4", () => {
      computerPlayer.updateQueue([5, 5], realPlayer);
      expect(computerPlayer.algorithmQueue.length).toBe(4);
    });
  });
});
