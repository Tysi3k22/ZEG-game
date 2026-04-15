import {player, updateUI, message} from './player.js';
import {currentMap, gameState, nextMap} from './main.js';
import {TILES} from './constants.js';
import {Draw} from './draw.js';

export function move(dx, dy) {
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
        player.hp -= 2;
    }
    updateUI();
    Draw();
}

document.addEventListener('keydown', (e) => {
    // sterowanie strzałkami oraz wsad'em
    if(e.key == "ArrowUp" || e.key == "w") move(0,-1); 
    if(e.key == "ArrowDown" || e.key == "s") move(0,1);
    if(e.key == "ArrowLeft" || e.key == "a") move(-1,0);
    if(e.key == "ArrowRight" || e.key == "d") move(1,0);
})