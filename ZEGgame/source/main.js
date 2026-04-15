import {TILE_SIZE, TILES, COLORS} from './constants.js';
import {maps} from './maps.js';
import {player, updateUI, message, resetPlayer} from './player.js';
import {drawEnemy, updateEnemies} from './enemies.js'

const canvas = document.getElementById('game'); // pobranie canvasa
export const ctx = canvas.getContext('2d');

let currentMapIndex = 0; //zmienna przechowujaca aktualna mape, mozna ja zmieniac aby przechodzic do kolejnych map
export let currentMap = cloneMap(maps[currentMapIndex]); //pobranie aktualnej mapy z tablicy maps

let gameState = "MENU"; //MENU, PLAYING, WIN, LOSE

document.getElementById('startBtn').addEventListener("click", startGame);
document.getElementById('pauseGame').addEventListener("click", pauseGame);
document.getElementById('resumeGame').addEventListener("click", resumeGame);

function startGame() {
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

let counter = 0;
let interval = null;
let main_timer = document.getElementById('main_timer');
let paused_timer = document.getElementById('paused_timer');

function startTimer() { 
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

function stopTimer() {
  if (interval === null) return;

  clearInterval(interval);
  interval = null; // ważne!
}

function resumeTimer() {
  if (interval !== null) return; // już działa

  startTimer(); // po prostu uruchamiamy ponownie
}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //zresetowanie wszelkich rzeczy w canvasie

    if(gameState !== "PLAYING") return; //sprawdzanie czy gracz gra
    for(let y = 0; y < currentMap.length; y++){ //petle sprawdzajace indexy w mapie aby ustawic
        for(let x = 0; x < currentMap[y].length; x++){
            const tile = currentMap[y][x];
            if(tile === TILES.WALL) ctx.fillStyle = COLORS.WALL;
            else if(tile === TILES.EXIT) ctx.fillStyle = COLORS.EXIT;
            else if(tile === TILES.KEY) ctx.fillStyle = COLORS.KEY;
            else if(tile === TILES.HEAL) ctx.fillStyle = COLORS.HEAL;
            else if(tile === TILES.GATE) ctx.fillStyle = COLORS.GATE;
            else if(tile === TILES.TRAP) ctx.fillStyle = COLORS.TRAP;
            else continue;
            
            ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    //ustawienie pozycji oraz wygladu gracza
    ctx.fillStyle = COLORS.PLAYER;
    ctx.fillRect(player.x*TILE_SIZE, player.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);

    drawEnemy();
    drawFog(); //trzeba potem to odkomentowac zeby dzialalo
}
function drawFog() {
    const visibilityRadius = TILE_SIZE * 2; // Promień widoczności
    
    //srodek gracza
    const playerCenterX = player.x * TILE_SIZE + TILE_SIZE / 2;
    const playerCenterY = player.y * TILE_SIZE + TILE_SIZE / 2;
    
    ctx.save();
    ctx.beginPath();

    ctx.rect(0, 0, canvas.width, canvas.height); //prostokat(mgla) na caly labirynt oprocz gracza oraz okregu dookola niego
    ctx.arc(playerCenterX, playerCenterY, visibilityRadius, 0, Math.PI * 2, true); //narysowanie kola widocznosci
    
    ctx.fillStyle = COLORS.FOG; //ustawienie mgly
    ctx.fill();

    ctx.restore();
}

function move(dx, dy) {
    if(gameState !== "PLAYING") return;
    //poruszanie sie
    const px = player.x + dx;
    const py = player.y + dy;
    const tile = currentMap[py][px]
    //blokada przed przejściem dalej bez kluczy
    if (player.keys <= 1 && tile === TILES.EXIT) {
        message("Musisz zdobyć wszystkie klucze, aby przejść dalej!"); //dymek pokazujacy ze trzeba zdobyć wszystkie klucze aby przejsc dalej
        return; //zatrzymanie funkcji move, aby nie pozwolić na przejście dalej
    }
    if (player.keys <= 0 && tile == TILES.GATE) {
        message("Musisz zdobyć klucz, aby odblokować przejście!");
        return;
    }

    if(tile != TILES.WALL){ 
        //mechanika sprawdzania czy nie wchodzi sie w sciane jezeli tak to nie zmienia sie polozenie
        player.x = px;
        player.y = py;
    }
    if(tile === TILES.EXIT && player.keys === 2 ){ //TODO: blokuje wchodzenie na pole mety
        message("Wygrałeś!"); //dymek pokazujacy przescie labiryntu (trzeba zrobic menu glowne aby do niego przechodzic po skonczeniu)
        nextMap(); //przejscie do kolejnej mapy po przejsciu obecnej
    }
    if(tile === TILES.KEY){
        message("Zdobyłeś klucz!");
        player.keys++;
        currentMap[py][px] = TILES.EMPTY; //usuwanie klucza z mapy po odebraniu
    }
    if(tile === TILES.HEAL){
        message("Zdobyłeś leczenie!");
        player.hp = 100;
        currentMap[py][px] = TILES.EMPTY; //usuwanie leczenia z mapy po odebraniu
    }
    if(tile === TILES.GATE){
        if (player.keys > 0) {
            message("Odblokowano przejście!");
            player.keys--;
            currentMap[py][px] = TILES.EMPTY; //czyszczenie kafelki
        } else {
            message("Brakuje kluczy, aby odblokować przejście!");
        }
    }
    if(tile === TILES.TRAP) {
        message("Wszedłeś w pułapke");
        player.hp -= 20;
    }
    updateUI();
    Draw();
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

function nextMap() {
    currentMapIndex++;

    if (!maps[currentMapIndex]) {
        message("Gratulacje! Ukończyłeś wszystkie mapy! (na razie)");
        return;
    }
    currentMap = cloneMap(maps[currentMapIndex]);

    resetPlayer();
    Draw();
}
//system poruszania sie zaleznie od nacisnietego przycisku
document.addEventListener('keydown', (e) => {
    // sterowanie strzałkami oraz wsad'em
    if(e.key == "ArrowUp" || e.key == "w") move(0,-1); 
    if(e.key == "ArrowDown" || e.key == "s") move(0,1);
    if(e.key == "ArrowLeft" || e.key == "a") move(-1,0);
    if(e.key == "ArrowRight" || e.key == "d") move(1,0);
})

//petla gry
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateEnemies();
    Draw(); 
    ctx.restore();
    if(player.hp <= 0) {
        gameOver();
    }

    updateUI(); 

    requestAnimationFrame(gameLoop);
}


gameLoop();