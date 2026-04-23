import {maps, placeReward, rewardTypes} from './maps.js';
import {Draw} from './draw.js';
import {player, updateUI, message, resetPlayer} from './player.js';
import {startTimer, stopTimer, resumeTimer, resetTimer, counter} from './timer.js';
import {camera, updateCamera, lerp} from './camera.js'
import {fog, drawFog} from './fog.js';

export const canvas = document.getElementById('game'); // Pobranie canvasa

// Dostosowanie rozmiaru canvasa do rozmiaru okna przeglądarki
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Ustawienie początkowego rozmiaru canvasa

export const ctx = canvas.getContext('2d');
export let total_damage = 0;

export let currentMapIndex = 0; // Zmienna przechowująca aktualna mape, można ją zmieniać aby przechodzić do kolejnych map

export let currentMap = cloneMap(maps[currentMapIndex]); // Pobranie aktualnej mapy z tablicy maps

export const state = {gameState : "MENU"}; //MENU, PLAYING

export function addDamage(amount) {
    total_damage += amount;
};

function saveProgress() {
    // Zapisujemy indeks AKTUALNEJ mapy
    localStorage.setItem('savedMapIndex', currentMapIndex);

    // Zapisywanie najlepszego czasu
    const currentTime = counter; 
    const bestTimeKey = `bestTime_map_${currentMapIndex}`;
    const previousBest = localStorage.getItem(bestTimeKey);

    if (!previousBest || currentTime < parseInt(previousBest)) {
        localStorage.setItem(bestTimeKey, currentTime);
        message("Nowy rekord czasu!");
    }
}

// Funkcja usprawiniajaca system menu
export function showMenu(menu) {
    document.querySelectorAll('.overlay').forEach(function(el) {
        el.classList.add('hidden');
    }); // Ukrycie wszystkich nakładek
    document.getElementById(menu).classList.remove('hidden'); // Pokazanie nakładki o podanym id
}

// Funkcjonalność przycisków w menu
document.getElementById('pauseGame').addEventListener("click", pauseGame);
document.getElementById('resumeGame').addEventListener("click", resumeGame);
document.getElementById('startNewGame').addEventListener("click", function() {
    showMenu('overlay');
});
document.getElementById('startBtn').addEventListener("click", function() {
    showMenu('mapList');
});

document.getElementById('backToLobby_Paused').addEventListener("click", function(){
    showMenu('overlay');
});
document.getElementById('backToLobby_Soon').addEventListener("click", function(){
    showMenu('overlay');
});
document.getElementById('backToLobby_Lost').addEventListener("click", function(){
    showMenu('overlay');
});

// Funkcja rozpoczynająca grę
export function startGame() {
    total_damage = 0;    
    camera.renderX = 0;
    camera.renderY = 0;
    camera.x = 0;
    camera.y = 0;
    player.hp = 100;
    resetPlayer();
    resetTimer();
    currentMap = cloneMap(maps[currentMapIndex]); 
    placeReward(currentMap, rewardTypes[currentMapIndex][0]);
    Draw();
    updateUI(currentMapIndex);
    state.gameState = "PLAYING";
    startTimer();
}

// Funkcja resetująca grę
export function gameOver() {
    player.hp = 100;
    resetPlayer();
    currentMap = cloneMap(maps[currentMapIndex]);
    updateUI(currentMapIndex);
    state.gameState = "MENU";
    stopTimer();
    resetTimer();
    
    document.getElementById('lostMsg').textContent = `Niestety ci się nie udało :<. Twój wynik to ${total_damage} obrażeń. (na razie)`;
    showMenu('lostGame');
}

// Funkcja wygrywania gry
function Win() {
    state.gameState = "MENU";
    stopTimer();
    document.getElementById('winMsg').textContent = `Gratulacje! Ukończyłeś wszystkie mapy! Twój wynik to ${total_damage} obrażeń. (na razie)`;
    showMenu('Win');
}

// Funkcja pauzowania gry
export function pauseGame() {
    if(state.gameState !== "PLAYING") return;
    state.gameState = "MENU";
    
    stopTimer();
    showMenu('paused');
}

// Funkcja wznawiania gry
function resumeGame() {
    state.gameState = "PLAYING";
    resumeTimer();

    showMenu('pauseGame');
}

// Funkcja do klonowania mapy, aby nie modyfikować oryginalnej mapy w tablicy maps
function cloneMap(map) {
    const newMap = [];
    // Przejście przez każdy wiersz mapy
    for (let y = 0; y < map.length; y++) {
        newMap[y] = [];
        // Przejście przez każdą kolumnę wiersza
        for (let x = 0; x < map[y].length; x++) {
            newMap[y][x] = map[y][x];
        }
    }
    return newMap;
}

// Funkcja przechodzenia do kolejnej mapy
export function nextMap() {
    saveProgress();
    currentMapIndex++;

    // Sprawdzenie czy istnieje kolejna mapa, jeśli nie to wygrana
    if (!maps[currentMapIndex]) {
        Win();
        message("Gratulacje! Ukończyłeś wszystkie mapy! (na razie)");
        return;
    }
    localStorage.setItem('savedMapIndex', currentMapIndex);

    // Pobranie kolejnej mapy
    currentMap = cloneMap(maps[currentMapIndex]);

    // Umieszczenie nagród na mapie
    const levelRewards = rewardTypes[currentMapIndex];

    if (levelRewards && levelRewards[0]) {
        // levelRewards[0], bo Twoje nagrody są zamknięte w tablicy: [{3:x, 4:y}]
        placeReward(currentMap, levelRewards[0]);
    }

    // Zresetowanie pozycji gracza i narysowanie mapy
    resetPlayer();
    Draw();
}

// Pętla gry
function gameLoop() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Zresetowanie wszelkich rzeczy w canvasie
    
    if (state.gameState === "PLAYING") {
        player.renderX = lerp(player.renderX, player.x, 0.15); // Płynne przejście renderowanej pozycji gracza do jego aktualnej pozycji
        player.renderY = lerp(player.renderY, player.y, 0.15);

        fog.renderX = player.renderX;
        fog.renderY = player.renderY;
        
        updateCamera(player, canvas.width, canvas.height); // Aktualizacja pozycji kamery na podstawie pozycji gracza
    } else {
        updateCamera(player, canvas.width, canvas.height);
    }
    
    ctx.save(); // Zapisanie aktualnego stanu
    
    ctx.translate(-camera.renderX, -camera.renderY); // Przesunięcie widoku o pozycję kamery, aby śledzić gracza
    
    Draw(); // Funkcja rysująca mape na canvasie
    drawFog(); // Narywowanie mgły
    ctx.restore();
    if(player.hp <= 0) {

        
        gameOver(); // Funkcja przegranej, resetuje gre
    }
    
    updateUI(currentMapIndex); // Aktualizacja informacji o graczu
    
    requestAnimationFrame(gameLoop); // Zapewnienie płynności animacji poprzez wywolywanie gameLoop przed każdym odświeżeniem ekranu
}



gameLoop();


