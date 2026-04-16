import {maps, placeReward, rewardTypes} from './maps.js';
import {Draw} from './draw.js';
import {player, updateUI, message, resetPlayer} from './player.js';
import {updateEnemies} from './enemies.js'
import {startTimer, stopTimer, resumeTimer, resetTimer} from './timer.js';
import {camera, updateCamera, lerp} from './camera.js'
import {fog, drawFog} from './fog.js';

export const canvas = document.getElementById('game'); // pobranie canvasa
export const ctx = canvas.getContext('2d');

export let currentMapIndex = 0; //zmienna przechowujaca aktualna mape, mozna ja zmieniac aby przechodzic do kolejnych map
let currentDifficulty = "EASY"; //zmienna przechowujaca aktualna trudnosc, mozna ja zmieniac aby zmieniac trudnosc gry
export let currentMap = cloneMap(maps[currentDifficulty][currentMapIndex]); //pobranie aktualnej mapy z tablicy maps

export let gameState = "MENU"; //MENU, PLAYING, WIN, LOSE

function showMenu(menu) {
    document.querySelectorAll('.overlay').forEach(function(el) {
        el.classList.add('hidden');
    }); //ukrycie wszystkich nakładek
    document.getElementById(menu).classList.remove('hidden'); //pokazanie nakładki o id menu
}

//funkcjonalnosc przyciskow w menu
document.getElementById('pauseGame').addEventListener("click", pauseGame);
document.getElementById('resumeGame').addEventListener("click", resumeGame);
document.getElementById('startNewGame').addEventListener("click", gameOver);
document.getElementById('startBtn').addEventListener("click", function() {
    showMenu('difficultyMenu');
});
document.getElementById('easyBtn').addEventListener("click", function() {
    currentDifficulty = "EASY";
    document.getElementById('difficultyMenu').classList.add('hidden');
    startGame();
});
document.getElementById('mediumBtn').addEventListener("click", function() {
    currentDifficulty = "MEDIUM";
    document.getElementById('difficultyMenu').classList.add('hidden');
    startGame();
});
document.getElementById('hardBtn').addEventListener("click", function() {
    currentDifficulty = "HARD";
    document.getElementById('soon').classList.remove('hidden'); // pozniej usunac i odkomentowac linijke ponizej
    document.getElementById('difficultyMenu').classList.add('hidden');
    //startGame();
});

document.getElementById('backToLobby_Paused').addEventListener("click", function(){
    showMenu('overlay');
});
document.getElementById('backToLobby_Soon').addEventListener("click", function(){
    showMenu('overlay');
});

function startGame() {
    camera.renderX = 0;
    camera.renderY = 0;
    camera.x = 0;
    camera.y = 0;
    player.hp = 100;
    resetPlayer();
    resetTimer();
    currentMap = cloneMap(maps[currentDifficulty][currentMapIndex]); 
    placeReward(currentMap, rewardTypes[currentDifficulty]);
    Draw();
    updateUI();
    gameState = "PLAYING";
    startTimer();
}

export function gameOver() {
    //resetowanie gracza
    player.hp = 100;
    resetPlayer();

    //resetowanie mapy
    currentMapIndex = 0;
    currentMap = cloneMap(maps[currentDifficulty][currentMapIndex]);

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
    if(gameState !== "PLAYING") return;
    gameState = "MENU";
    
    stopTimer();
    showMenu('paused');
}

function resumeGame() {

    gameState = "PLAYING";
    resumeTimer();

    showMenu('pauseGame');
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

    if (!maps[currentDifficulty][currentMapIndex]) {
        Win();
        message("Gratulacje! Ukończyłeś wszystkie mapy! (na razie)");
        return;
    }
    currentMap = cloneMap(maps[currentDifficulty][currentMapIndex]);
    placeReward(currentMap, rewardTypes[currentDifficulty]);

    resetPlayer();
    Draw();
}

//petla gry
export function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //zresetowanie wszelkich rzeczy w canvasie

    if (gameState === "PLAYING") {
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
    drawFog(); //narywowanie mgly
    ctx.restore();
    if(player.hp <= 0) {
        gameOver(); //funkcja przegranej, resetuje gre
    }

    updateUI(); //aktualizacja informacji o graczu

    requestAnimationFrame(gameLoop); //zapewnienie płynności animacji poprzez wywolywanie gameLoop przed każdym odświeżeniem ekranu
}


gameLoop();