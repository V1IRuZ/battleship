import "./styles.css";
import { GameController } from "./controller/gameController.js";

window.addEventListener("load", () => {
  new GameController();
  document.body.classList.add("ready");
});
