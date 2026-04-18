import {player, updateUI, message} from './player.js';
import {currentMap, gameState, nextMap} from './main.js';
import {TILES} from './constants.js';
import {Draw} from './draw.js';

export function move(dx, dy) {
    if(gameState !== "PLAYING") return; // zabezpieczenie przed poruszaniem się w menu

    // Obliczenie nowej pozycji gracza
    const px = player.x + dx;
    const py = player.y + dy;

    // Zabezpieczenie przed wyjsciem poza tablice mapy
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

    let animTimeout = null;

    // Zabezpieczenie przed wchodzeniem w sciany
    if (tile === TILES.WALL) return;

    // Aktualizacja pozycji gracza
    player.x = px;
    player.y = py;

    //
    if (animTimeout) {
        clearTimeout(animTimeout);
        animTimeout = null;
    }

    player.animation.state = "walk"; // ustawienie animacji chodzenia


    // Logika przedmiotów i mety
    if (tile === TILES.EXIT) {
        message("Poziom ukończony!");
        nextMap();
    } else if (tile === TILES.KEY) {
        message("Znalazłeś klucz!");
        player.keys++;
        currentMap[py][px] = TILES.EMPTY;
    } else if (tile === TILES.HEAL) {
        player.hp = 100;
        message("Zostałeś uleczony!");
        currentMap[py][px] = TILES.EMPTY;
    } else if (tile === TILES.TRAP) {
        player.hp -= 10;
        message("Pułapka!");
    }

    // funkcja aktualizujaca informacje o graczu
    updateUI();

    // Powrot do animacji bezczynnosci po 200ms
    animTimeout = setTimeout(() => {
        player.animation.state = "idle"; // powrot do animacji bezczynnosci po krotkim czasie
        animTimeout = null;
    }, 200);
}

document.addEventListener('keydown', (e) => {
    // sterowanie strzałkami oraz wsad'em
    if(e.key == "ArrowUp" || e.key == "w") move(0,-1); 
    if(e.key == "ArrowDown" || e.key == "s") move(0,1);
    if(e.key == "ArrowLeft" || e.key == "a") move(-1,0);
    if(e.key == "ArrowRight" || e.key == "d") move(1,0);

    e.preventDefault(); // zablokowanie przewijania strony przy użyciu strzałek 
})