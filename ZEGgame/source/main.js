import {maps, placeReward, rewardTypes} from './maps.js';
import {Draw} from './draw.js';
import {player, updateUI, message, resetPlayer} from './player.js';
import {updateEnemies} from './enemies.js'
import {startTimer, stopTimer, resumeTimer, resetTimer, counter} from './timer.js';
import {camera, updateCamera, lerp} from './camera.js'
import {fog, drawFog} from './fog.js';

export const canvas = document.getElementById('game'); // pobranie canvasa
export const ctx = canvas.getContext('2d');
export let total_damage = 0;

export let currentMapIndex = 0; //zmienna przechowujaca aktualna mape, mozna ja zmieniac aby przechodzic do kolejnych map

export let currentMap = cloneMap(maps[currentMapIndex]); //pobranie aktualnej mapy z tablicy maps

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

// funkcja usprawiniajaca system menu
export function showMenu(menu) {
    document.querySelectorAll('.overlay').forEach(function(el) {
        el.classList.add('hidden');
    }); //ukrycie wszystkich nakładek
    document.getElementById(menu).classList.remove('hidden'); //pokazanie nakładki o podanym id
}

//funkcjonalnosc przyciskow w menu
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

// funkcja rozpoczynajaca gre
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

// funkcja resetujaca gre
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

// funkcja wygrywania gry
function Win() {
    state.gameState = "MENU";
    stopTimer();
    document.getElementById('winMsg').textContent = `Gratulacje! Ukończyłeś wszystkie mapy! Twój wynik to ${total_damage} obrażeń. (na razie)`;
    showMenu('Win');
}

//funkcja pauzowania gry
export function pauseGame() {
    if(state.gameState !== "PLAYING") return;
    state.gameState = "MENU";
    
    stopTimer();
    showMenu('paused');
}

// funkcja wznawiania gry
function resumeGame() {
    state.gameState = "PLAYING";
    resumeTimer();

    showMenu('pauseGame');
}

// funkcja do klonowania mapy, aby nie modyfikowac oryginalnej mapy w tablicy maps
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

// funkcja przechodzenia do kolejnej mapy
export function nextMap() {
    saveProgress();
    currentMapIndex++;

    // sprawdzenie czy istnieje kolejna mapa, jesli nie to wygrana
    if (!maps[currentMapIndex]) {
        Win();
        message("Gratulacje! Ukończyłeś wszystkie mapy! (na razie)");
        return;
    }
    localStorage.setItem('savedMapIndex', currentMapIndex);

    // pobranie kolejnej mapy
    currentMap = cloneMap(maps[currentMapIndex]);

    // umieszczenie nagrod na mapie
    const levelRewards = rewardTypes[currentMapIndex + 1];

    if (levelRewards && levelRewards[0]) {
        // levelRewards[0], bo Twoje nagrody są zamknięte w tablicy: [{3:x, 4:y}]
        placeReward(currentMap, levelRewards[0]);
    }

    // zresetowanie pozycji gracza i narysowanie mapy
    resetPlayer();
    Draw();
}

//petla gry
function gameLoop() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); //zresetowanie wszelkich rzeczy w canvasie
    
    if (state.gameState === "PLAYING") {
        player.renderX = lerp(player.renderX, player.x, 0.15); //płynne przejście renderowanej pozycji gracza do jego aktualnej pozycji
        player.renderY = lerp(player.renderY, player.y, 0.15);

        fog.renderX = player.renderX;
        fog.renderY = player.renderY;
        
        updateCamera(player, canvas.width, canvas.height); //aktualizacja pozycji kamery na podstawie pozycji gracza
    } else {
        updateCamera(player, canvas.width, canvas.height);
    }
    
    ctx.save(); //zapisanie aktualnego stanu
    
    ctx.translate(-camera.renderX, -camera.renderY); //przesunięcie widoku o pozycję kamery, aby śledzić gracza
    
    Draw(); //funkcja rysujaca mape na canvasie
    //drawFog(); //narywowanie mgly
    ctx.restore();
    if(player.hp <= 0) {

        
        gameOver(); //funkcja przegranej, resetuje gre
    }
    
    updateUI(currentMapIndex); //aktualizacja informacji o graczu
    
    requestAnimationFrame(gameLoop); //zapewnienie płynności animacji poprzez wywolywanie gameLoop przed każdym odświeżeniem ekranu
}


gameLoop();


