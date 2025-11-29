export function createEvents() {
  let draggedShip = null;

  return {
    bindBoardClicks(board, callback) {
      board.addEventListener("click", (e) => {
        if (!e.target.classList.contains("cell")) return;
        if (e.target.classList.contains("miss")) return;
        if (e.target.classList.contains("hit")) return;

        const x = Number(e.target.dataset.x);
        const y = Number(e.target.dataset.y);

        callback(x, y);
      });
    },

    bindDragStart(board, callback) {
      board.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("ship")) {
          draggedShip = e.target;
          const x = Number(e.target.dataset.x);
          const y = Number(e.target.dataset.y);
          const shipIndex = Number(e.target.dataset.shipIndex);
          callback(x, y, shipIndex);
        } else {
          e.preventDefault();
        }
      });
    },

    bindDragOver(board) {
      board.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
    },

    bindDragEnter(board, callback) {
      board.addEventListener("dragenter", (e) => {
        if (!draggedShip) return;

        if (!e.target.classList.contains("cell")) return;

        const x = Number(e.target.dataset.x);
        const y = Number(e.target.dataset.y);
        const shipIndex = draggedShip.dataset.shipIndex;

        callback(x, y, shipIndex);
      });
    },

    bindDragDrop(board, callback) {
      board.addEventListener("dragend", () => {
        document
          .querySelectorAll(".ghost, .dragging")
          .forEach((c) => c.classList.remove("ghost", "dragging"));
      });

      board.addEventListener("drop", (e) => {
        e.preventDefault();
        if (!draggedShip) return;

        if (!e.target.classList.contains("cell")) return;

        const x = Number(e.target.dataset.x);
        const y = Number(e.target.dataset.y);
        const shipIndex = draggedShip.dataset.shipIndex;

        callback(x, y, shipIndex);
        draggedShip = null;
      });
    },

    bindRotationClicks(board, callback) {
      board.addEventListener("dblclick", (e) => {
        if (!e.target.classList.contains("ship")) return;
        const shipIndex = Number(e.target.dataset.shipIndex);
        console.log(shipIndex);
        callback(shipIndex);
      });
    },

    bindButtonClick(container, selector, callback) {
      container.addEventListener("click", (e) => {
        if (e.target.matches(selector)) callback();
      });
    },

    removeAllEventListeners(element) {
      const clone = element.cloneNode(true);
      element.replaceWith(clone);
      return clone;
    },

    bindModalExitClick(modal, callback) {
      const button = document.querySelector(".exit-btn");
      button.addEventListener("click", (e) => {
        modal.close();

        callback();
      });
    },

    bindModalPlayAgainClick(callback) {
      const button = document.querySelector(".again-btn");
      const modal = document.querySelector(".winner-modal");
      button.addEventListener("click", () => {
        modal.close();

        callback();
      });
    },
  };
}
