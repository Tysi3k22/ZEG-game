let counter = 0;
let interval = null;
let main_timer = document.getElementById('main_timer');
let paused_timer = document.getElementById('paused_timer');

export function startTimer() { 
    if (interval !== null) return; // żeby nie odpalić drugi raz

    interval = setInterval(function () {
    counter++;

    let hours = Math.floor(counter / 3600);
    let minutes = Math.floor((counter % 3600) / 60);
    let seconds = counter % 60;

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    main_timer.textContent = `${hours}:${minutes}:${seconds}`;
    paused_timer.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
}

export function stopTimer() {
  if (interval === null) return;

  clearInterval(interval);
  interval = null; // ważne!
}

export function resumeTimer() {
  if (interval !== null) return; // już działa

  startTimer(); // po prostu uruchamiamy ponownie
}