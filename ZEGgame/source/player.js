import {MAX_HP} from './constants.js';

export let player = {
    x: 1,
    y: 1,
    keys: 0,
    hp: 20 
};

const hp_html = document.getElementById('hp');
const keys_html = document.getElementById('klucze');
const msg = document.getElementById('msg');

export function updateUI() {
    hp.innerHTML = player.hp + "/100";
    klucze.innerHTML = parseInt(player.keys); 
}

export function message(text) {
    msg.innerText = text;
    setTimeout(() => {
        msg.innerText = '';
    }, 2000);
}

export function resetPlayer() {
    player.x = 1;
    player.y = 1;
    player.keys = 0;
    updateUI();
}