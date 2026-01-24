const bpmEl = document.getElementById("bpm");
const tapsEl = document.getElementById("taps");
const intervalEl = document.getElementById("interval");
const resetButton = document.getElementById("reset");
const maxIntervalsInput = document.getElementById("max-intervals");

const tapTimes = [];
let maxIntervals = readMaxIntervals();

function readMaxIntervals() {
  const value = Number.parseInt(maxIntervalsInput.value, 10);
  if (Number.isFinite(value) && value > 0) {
    return value;
  }
  return 1;
}

function updateDisplay(avgInterval) {
  if (!avgInterval) {
    bpmEl.textContent = "--";
    intervalEl.textContent = "--";
    return;
  }

  const bpm = Math.round(60000 / avgInterval);
  bpmEl.textContent = String(bpm);
  intervalEl.textContent = String(Math.round(avgInterval));
}

function updateFromTapTimes() {
  if (tapTimes.length < 2) {
    updateDisplay(null);
    return;
  }

  const intervals = [];
  for (let i = 1; i < tapTimes.length; i += 1) {
    intervals.push(tapTimes[i] - tapTimes[i - 1]);
  }

  const recentIntervals = intervals.slice(-maxIntervals);
  const sum = recentIntervals.reduce((total, value) => total + value, 0);
  const avgInterval = sum / recentIntervals.length;
  updateDisplay(avgInterval);
}

function recordTap(timestamp) {
  tapTimes.push(timestamp);
  tapsEl.textContent = String(tapTimes.length);
  updateFromTapTimes();
}

function handleTap(event) {
  if (event && resetButton.contains(event.target)) {
    return;
  }

  recordTap(performance.now());
}

function handleKeydown(event) {
  if (event.repeat) {
    return;
  }

  handleTap();
}

function reset() {
  tapTimes.length = 0;
  tapsEl.textContent = "0";
  updateDisplay(null);
}

window.addEventListener("keydown", handleKeydown);
window.addEventListener("pointerdown", handleTap);
resetButton.addEventListener("click", reset);
maxIntervalsInput.addEventListener("keydown", (event) => {
  event.stopPropagation();
});
maxIntervalsInput.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});
maxIntervalsInput.addEventListener("input", () => {
  maxIntervals = readMaxIntervals();
  updateFromTapTimes();
});
