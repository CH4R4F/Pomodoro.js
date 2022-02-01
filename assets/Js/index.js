import { Pomodoro } from "./pomodoro.js";

const modes = document.querySelector(".mode");
const controleBtn = document.querySelector(".timer__controle__btn");

let timer = new Pomodoro();

document.addEventListener("DOMContentLoaded", () => {
  // notification config
  if ("Notification" in window && Notification.permission != "granted" && Notification.permission != "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission == "granted") {
        new Notification("Now you'll be notified on every session");
      }
    });
  }
  // switch the session
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
  timer.updateBtn("start");
});
