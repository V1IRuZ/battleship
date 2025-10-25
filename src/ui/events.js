export const events = {
  bindBoardClicks(board, callback) {
    board.addEventListener("click", (e) => {
      if (!e.target.classList.contains("cell")) return;
      const x = Number(e.target.dataset.x);
      const y = Number(e.target.dataset.y);

      callback(x, y);
    });
  },
};
