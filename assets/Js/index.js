import { Pomodoro } from "./pomodoro.js";

const modes = document.querySelector(".mode");
const controleBtn = document.querySelector(".timer__controle__btn");

let timer = new Pomodoro();

document.addEventListener("DOMContentLoaded", () => {
  timer.switchMode("pomodoro");
});

controleBtn.addEventListener("click", function () {
  const { action } = this.dataset;

  if (action == "start") {
    timer.updateBtn("stop");
    timer.start();
  } else {
    timer.updateBtn("start");
    timer.stop();
  }
});

modes.addEventListener("click", (e) => {
  timer.getMode(e);
});
