import {MAX_HP} from './constants.js';

//informacje dotyczace gracza
export let player = {
    x: 1,
    y: 1,
    renderX: player.x,
    renderY: player.y,
    keys: 0,
    hp: 100 
};

//odnoszenie do informacji o graczu w pliku html
const hp_html = document.getElementById('hp');
const keys_html = document.getElementById('klucze');

//informacje wyswietlane po interakcji
const msg = document.getElementById('msg');

//funkcja aktualizujaca zdrowie oraz ekwipunek gracza
export function updateUI() {
    hp_html.innerHTML = player.hp + "/" + MAX_HP;
    keys_html.innerHTML = parseInt(player.keys); 
}

//funkcja wyswietlajaca informacje po interakcji
export function message(text) {
    msg.innerText = text;
    setTimeout(() => {
        msg.innerText = '';
    }, 2000);
}

//funkcja resetujaca pozycji gracza
export function resetPlayer() {
    player.x = 1;
    player.y = 1;
    player.renderX = 1,
    player.renderY = 1,

    player.keys = 0;
    updateUI();
}