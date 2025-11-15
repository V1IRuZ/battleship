import { ComputerPlayer, RealPlayer } from "../classes/player.js";

describe("ComputerPlayer class", () => {
  let computerPlayer;
  let realPlayer;

  beforeEach(() => {
    computerPlayer = new ComputerPlayer("player2", "AI");
    realPlayer = new RealPlayer("player1", "PLAYER 1");
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

  describe("getShipsLengths method", () => {
    test("update the property that contains the lengths of the ships in the game", () => {
      expect(computerPlayer.enemyShipsLengths).toEqual([5, 4, 3, 3, 2, 1]);
    });
  });

  describe("setName method", () => {
    test("returns default name if no value is given", () => {
      realPlayer.setName("");
      expect(realPlayer.name).toBe("PLAYER 1");
    });

    test("swithces name to given value", () => {
      realPlayer.setName("JACK");
      expect(realPlayer.name).toBe("JACK");
    });
  });
});
