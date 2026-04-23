export let counter = 0;
export let interval = null;
let main_timer = document.getElementById('main_timer');
let paused_timer = document.getElementById('paused_timer');
export let formated_timer;

// Funkcja do uruchamiania timera
export function startTimer() { 
    if (interval !== null) return; // Żeby nie odpalić drugi raz

    // Ustawiamy interwal ktory będzie aktualizował timer co sekundę
    interval = setInterval(function () {
    counter++;

    // Obliczanie godzin minut i sekund
    let hours = Math.floor(counter / 3600);
    let minutes = Math.floor((counter % 3600) / 60);
    let seconds = counter % 60;

    // Formatowanie cyfr do 2 cyfr (00:00:00)
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    // Przypisanie timeru do elementów w HTML
    formated_timer = `${hours}:${minutes}:${seconds}`;

    main_timer.textContent = formated_timer;
    paused_timer.textContent = formated_timer;
  }, 1000);
}

// Funkcja resetująca timer
export function resetTimer() {
  counter = 0;
  main_timer.textContent = "00:00:00";
  paused_timer.textContent = "00:00:00";
}

// Funkcja zatrzymująca timer
export function stopTimer() {
  if (interval === null) return;

  clearInterval(interval);
  interval = null; 
}

// Funkcja wznawiająca timer
export function resumeTimer() {
  if (interval !== null) return; // już działa

  startTimer(); // po prostu uruchamiamy ponownie
}