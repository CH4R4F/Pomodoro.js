const modes = document.querySelector(".mode");
const minLabel = document.getElementById("min");
const secLabel = document.getElementById("sec");
const controleBtn = document.querySelector(".timer__controle__btn");
const progress = document.getElementById("progress");
const sessionsText = document.querySelector("#sessions > span");

export class Pomodoro {
  constructor() {
    this.pomodoro = 25;
    this.shortBreak = 5;
    this.longBreak = 15;
    this.sessions = 0;
    this.longBreakInterval = 4;
    this.interval = null;
  }

  set setPomodoro(time) {
    this.pomodoro = time;
  }
  set setShortBreak(time) {
    this.shortBreak = time;
  }
  set setLongBreak(time) {
    this.longBreak = time;
  }
  set setlongBreakInterval(time) {
    this.longBreakInterval = time;
  }

  // ======== call this function when clicking on modes, then call switchMode on each mode =======
  getMode(e) {
    let { mode } = e.target.dataset;
    if (!mode) return;
    this.switchMode(mode);
    // this.stop();
  }

  // ========= this function change the styles and timer data on each mode ========
  switchMode(mode) {
    // update pomodoro informations
    this.mode = mode;
    this.remainingTime = {
      total: this[mode] * 60,
      minutes: this[mode],
      seconds: 0,
    };

    document.body.style.backgroundColor = `var(--${mode})`;
    [...modes.children].forEach((modeLabel) => modeLabel.classList.remove("mode--active"));
    document.querySelector(`.mode__${mode}`).classList.add("mode--active");
    this.updateProgress();
    this.updateTimer();
    this.stop();
  }

  // =========== this function will update the timer each second =========
  updateTimer() {
    const timeLeft = this.remainingTime;
    const minutes = `${timeLeft.minutes}`.padStart(2, "0");
    const seconds = `${timeLeft.seconds}`.padStart(2, "0");

    minLabel.textContent = minutes;
    secLabel.textContent = seconds;

    const label = this.mode == "pomodoro" ? "Focus Time" : "Break Time";
    document.title = `${minutes}:${seconds} | ${label}`;
  }
  // =========== update the ui of the btn based on it's action ========
  updateBtn(action) {
    controleBtn.textContent = action;
    controleBtn.dataset.action = action;

    if (action == "stop") {
      controleBtn.classList.add("stop");
    } else {
      controleBtn.classList.remove("stop");
    }
  }
  // ========== update remainingTime every second ==========
  updateTimeLeft(end) {
    let diff = end - Date.now();
    let total = Math.floor(diff / 1000),
      minutes = Math.floor(total / 60),
      seconds = Math.floor(total % 60);
    return {
      total,
      minutes,
      seconds,
    };
  }
  // ========== update the Progress based on time left ===========
  updateProgress(mode = null) {
    if (!mode) {
      progress.style.width = "0%";
    }
    let diff = this[mode] * 60 - this.remainingTime.total;
    let width = (diff / (this[mode] * 60)) * 100;
    progress.style.width = width + "%";
  }
  // start the timer
  start() {
    let mode = this.mode;
    let { total } = this.remainingTime;
    let endTime = Date.now() + total * 1000; // this is the future where the timer will stop

    if (mode === "pomodoro") {
      this.sessions++;
      sessionsText.textContent = this.sessions;
    }

    this.interval = setInterval(() => {
      this.remainingTime = this.updateTimeLeft(endTime);
      this.updateTimer();
      this.updateProgress(mode);

      total = this.remainingTime.total;
      if (total <= 0) {
        clearInterval(this.interval);
        switch (mode) {
          case "pomodoro":
            if (!(this.sessions % this.longBreakInterval)) {
              this.switchMode("longBreak");
            } else {
              this.switchMode("shortBreak");
            }
            break;

          default:
            this.switchMode("pomodoro");
        }

        this.start();
      }
    }, 1000);
  }
  // stop the timer
  stop() {
    clearInterval(this.interval);
    this.updateProgress(this.mode);
  }
}
