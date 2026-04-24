import {player, updateUI, message} from './player.js';
import {currentMap, state, nextMap, addDamage, showMenu, currentMapIndex, pauseGame} from './main.js';
import {TILES, logic_puzzles, awnsers} from './constants.js';

let isPressed = false;
export let picked_keys = 0;
export let picked_heals = 0;
export let trapsCounter = 0

// Funkcje zwiększające ilość zebranych kluczy, leczeń i pułapek na które gracz wszedł
function pickedKeys() {
    picked_keys++;
}

function pickedHeals() {
    picked_heals++;
}

function trapsUveWalkedOn() {
    trapsCounter++;
}


let randomNumber = Math.floor(Math.random() * logic_puzzles.length);

function checkAwnser(index) {
    const input = document.getElementById('puzzleAwnser');
    const awnser = input.value.toLowerCase().trim();
    const correctAwnser = awnsers[index];

    if (awnser === correctAwnser) {
        isPressed = true;
        message("Otworzyłeś czerwoną bramę!");
        state.gameState = "PLAYING";
        document.getElementById('puzzles').classList.add('hidden');
    } else {
        document.getElementById('wrongAwnserText').innerText = "Błędna odpowiedź";
    }
}

// Dodaj ten listener raz, gdzieś przy inicjalizacji
document.getElementById('submitAwnser').addEventListener('click', () => {
    checkAwnser(randomNumber);
});

export function move(dx, dy) {
    if(state.gameState !== "PLAYING") return; // Zabezpieczenie przed poruszaniem się w menu


    // Obliczenie nowej pozycji gracza
    const px = player.x + dx;
    const py = player.y + dy;

    // Zabezpieczenie przed wyjściem poza tablice mapy
    if (!currentMap[py] || currentMap[py][px] === undefined) return;

    const tile = currentMap[py][px];

    // Logika bramy
    if (tile === TILES.GATE) {
        if (player.keys > 0) {
            message("Otwarto bramę!");
            player.keys--;
            currentMap[py][px] = TILES.EMPTY;
        } else {
            message("Potrzebujesz klucza!");
            return;
        }
    }

    if (tile === TILES.RED_OPENER) {
        randomNumber = Math.floor(Math.random() * logic_puzzles.length); 
        let puzzle = logic_puzzles[randomNumber];
        document.getElementById('puzzleText').textContent = puzzle;
        showMenu('puzzles');
        state.gameState = "MENU";
        currentMap[py][px] = TILES.EMPTY;
        return;
    }

    if(tile === TILES.RED_GATE) {
        if(isPressed === true) {
            currentMap[py][px] = TILES.EMPTY;
        }else {
            message("Znajdz przycisk, aby otworzyć tę bramę!");
            return;
        }
    }
    

    let animTimeout = null;

    // Zabezpieczenie przed wchodzeniem w ściany
    if (tile === TILES.WALL) return;

    // Aktualizacja pozycji gracza
    player.x = px;
    player.y = py;

    if (animTimeout) {
        clearTimeout(animTimeout);
        animTimeout = null;
    }

    player.animation.state = "walk"; // Ustawienie animacji chodzenia

    // Logika przedmiotów i mety
    if (tile === TILES.EXIT) {
        if(player.keys >= 2){
            message("Poziom ukończony!");
            nextMap();
            isPressed = false;
        }else {
            message("Potrzebujesz 2 kluczy, aby przejść dalej!");
            return;
        }
    } else if (tile === TILES.KEY) {
        message("Znalazłeś klucz!");
        pickedKeys();
        player.keys++;
        currentMap[py][px] = TILES.EMPTY;
    } else if (tile === TILES.HEAL) {
        player.hp = 100;
        pickedHeals();
        message("Zostałeś uleczony!");
        currentMap[py][px] = TILES.EMPTY;
    } else if (tile === TILES.TRAP) {
        player.hp -= 10;
        addDamage(10);
        trapsUveWalkedOn();
        message("Pułapka!");
    } 

    // Funkcja aktualizujaca informacje o graczu
    updateUI(currentMapIndex);

    // Powrót do animacji bezczynności po 200ms
    animTimeout = setTimeout(() => {
        player.animation.state = "idle"; // Powrót do animacji bezczynności po krótkim czasie
        animTimeout = null;
    }, 200);
}

let canMove = true;

document.addEventListener('keydown', (e) => {
    // Sterowanie strzałkami oraz wsad'em
    if(!canMove) return;
    let dx = 0, dy = 0;

    if(["ArrowUp", "w"].includes(e.key)) dy = -1; 
    else if(["ArrowDown", "s"].includes(e.key)) dy = 1; 
    else if(["ArrowLeft", "a"].includes(e.key)) dx = -1; 
    else if(["ArrowRight", "d"].includes(e.key)) dx = 1; 

    if(dx !== 0 || dy !== 0) {
        move(dx, dy);
        canMove = false;

        setTimeout(() => {
            canMove = true;
        },100);
    }

    if(["Escape"].includes(e.key)) pauseGame();

    if(state.gameState === "PLAYING") e.preventDefault(); // Zablokowanie przycisków na stronie
});