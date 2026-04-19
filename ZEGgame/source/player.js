import {MAX_HP} from './constants.js';
import {rewardTypes} from './maps.js';
import {formated_timer} from './timer.js';
import {currentDifficulty, currentMapIndex} from './main.js';
import {picked_keys, picked_heals} from './movement.js';


//informacje dotyczace gracza
export let player = {
    x: 1,
    y: 1,
    renderX: 1,
    renderY: 1,
    keys: 0,
    hp: 100,
    animation: {
        state: "idle",  // "idle", "walk"
        frame: 0,
        lastTime: 0
    }
};

//odnoszenie do informacji o graczu w pliku html
const hp_html = document.getElementById('hp');
const keys_html = document.getElementById('klucze');

//informacje wyswietlane po interakcji
const msg = document.getElementById('msg');


//funkcja aktualizujaca zdrowie oraz ekwipunek gracza
export function updateUI(currentDifficulty, currentMapIndex) {
    const rewards = rewardTypes[currentDifficulty];
    
    const totalKeys = rewards[1][0][3] + rewards[2][0][3] + rewards[3][0][3];
    const totalHeals = rewards[1][0][4] + rewards[2][0][4] + rewards[3][0][4];
    const totalTraps = rewards[1][0][6] + rewards[2][0][6] + rewards[3][0][6];
    hp_html.innerHTML = player.hp + "/" + MAX_HP;
    keys_html.innerHTML = parseInt(player.keys);

    document.getElementById('keys').innerHTML = picked_keys + "/" + totalKeys;
    document.getElementById('heals').innerHTML = picked_heals + "/" + totalHeals;
    document.getElementById('traps').innerHTML = rewards[6];
}

//funkcja wyswietlajaca informacje po interakcji
export function message(text) {
    msg.innerText = text;
    setTimeout(() => {
        msg.innerText = '';
    }, 2000);
}

//funkcja resetujaca pozycje oraz klucze gracza
export function resetPlayer() {
    player.x = 1;
    player.y = 1;
    player.renderX = 1;
    player.renderY = 1;
    player.animation.state = "idle";
    player.animation.frame = 0;
    player.animation.lastTime = 0;

    player.keys = 0;
}
