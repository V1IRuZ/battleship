export const events = {
  bindBoardClicks(callback, playerObj) {
    const board = document.querySelector(".player2");
    board.addEventListener("click", (e) => {
      if (!e.target.classList.contains("cell")) return;
      const x = Number(e.target.dataset.x);
      const y = Number(e.target.dataset.y);

      callback(x, y, playerObj);
    });
  },
};
