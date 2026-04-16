import {maps} from './maps.js';
import {Draw} from './draw.js';
import {player, updateUI, message, resetPlayer} from './player.js';
import {updateEnemies} from './enemies.js'
import {startTimer, stopTimer, resumeTimer, resetTimer} from './timer.js';
import {camera, updateCamera, lerp} from './camera.js'

export const canvas = document.getElementById('game'); // pobranie canvasa
export const ctx = canvas.getContext('2d');

export let currentMapIndex = 0; //zmienna przechowujaca aktualna mape, mozna ja zmieniac aby przechodzic do kolejnych map
export let currentMap = cloneMap(maps[currentMapIndex]); //pobranie aktualnej mapy z tablicy maps

export let gameState = "MENU"; //MENU, PLAYING, WIN, LOSE

//funkcjonalnosc przyciskow w menu
document.getElementById('startBtn').addEventListener("click", startGame);
document.getElementById('pauseGame').addEventListener("click", pauseGame);
document.getElementById('resumeGame').addEventListener("click", resumeGame);
document.getElementById('startNewGame').addEventListener("click", function() {
    gameOver();
    resetTimer();
    startGame();
}); 


function startGame() {
    camera.renderX = 0;
    camera.renderY = 0;
    camera.x = 0;
    camera.y = 0;
    resetPlayer();
    currentMap = cloneMap(maps[currentMapIndex]); 
    Draw();
    updateUI();
    gameState = "PLAYING";
    startTimer();

    document.getElementById('overlay').classList.add('hidden');
}

export function gameOver() {
    //resetowanie gracza
    player.hp = 100;
    resetPlayer();

    //resetowanie mapy
    currentMapIndex = 0;
    currentMap = cloneMap(maps[currentMapIndex]);

    updateUI();
    gameState = "MENU";
    stopTimer();

    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('Win').classList.add('hidden');
}

function Win() {
    gameState = "WIN";

    stopTimer();

    document.getElementById('Win').classList.remove('hidden');
}

function pauseGame() {
    gameState = "MENU";
    
    stopTimer();
    document.getElementById('pauseGame').classList.add('hidden');
    document.getElementById('paused').classList.remove('hidden');
    document.getElementById('main_timer_text').classList.add('hidden');
}


function resumeGame() {
    gameState = "PLAYING";
    resumeTimer();

    document.getElementById('pauseGame').classList.remove('hidden');
    document.getElementById('main_timer_text').classList.remove('hidden');
    document.getElementById('paused').classList.add('hidden');
}

function cloneMap(map) {
    const newMap = [];
    for (let y = 0; y < map.length; y++) {
        newMap[y] = [];
        for (let x = 0; x < map[y].length; x++) {
            newMap[y][x] = map[y][x];
        }
    }

    return newMap;
}

export function nextMap() {
    currentMapIndex++;

    if (!maps[currentMapIndex]) {
        Win();
        message("Gratulacje! Ukończyłeś wszystkie mapy! (na razie)");
        return;
    }
    currentMap = cloneMap(maps[currentMapIndex]);

    resetPlayer();
    Draw();
}

//petla gry
export function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //zresetowanie wszelkich rzeczy w canvasie

    if (gameState === "PLAYING") {
        player.renderX = lerp(player.renderX, player.x, 0.15); //płynne przejście renderowanej pozycji gracza do jego aktualnej pozycji
        player.renderY = lerp(player.renderY, player.y, 0.15);

        updateCamera(player, canvas.width, canvas.height); //aktualizacja pozycji kamery na podstawie pozycji gracza
    } else {
        updateCamera(player, canvas.width, canvas.height);
    }

    ctx.save(); //zapisanie aktualnego stanu

    ctx.translate(-camera.renderX, -camera.renderY); //przesunięcie widoku o pozycję kamery, aby śledzić gracza

    Draw(); //funkcja rysujaca mape na canvasie
    ctx.restore();
    if(player.hp <= 0) {
        gameOver(); //funkcja przegranej, resetuje gre
    }

    updateUI(); //aktualizacja informacji o graczu

    requestAnimationFrame(gameLoop); //zapewnienie płynności animacji poprzez wywolywanie gameLoop przed każdym odświeżeniem ekranu
}


gameLoop();