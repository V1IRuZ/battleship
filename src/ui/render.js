const render = {
  drawBoard(boardElement, gameBoard) {
    boardElement.innerHTML = "";
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;

        if (typeof gameBoard[x][y] === "string") {
          cell.classList.add("ship");
        }

        boardElement.appendChild(cell);
      }
    }
  },

  showHitandMiss(x, y) {
    const cell = document.querySelector(`.opponent > [data-x="${x}"][data-y="${y}"]`);

    cell.classList.contains("ship")
      ? cell.classList.add("hit")
      : cell.classList.add("miss");
  },
};

export { render };
