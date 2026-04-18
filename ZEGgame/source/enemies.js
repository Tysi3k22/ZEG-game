import {ctx, currentMap, currentMapIndex, currentDifficulty, addDamage} from './main.js';
import {COLORS, TILES, TILE_SIZE, GAME_ASSETS} from './constants.js';
import {player} from './player.js';

//informacje dotyczace przeciwnika
export let enemyList = {
    EASY: {
        0: [{ x: 250, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
        1: [{ x: 200, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
        2: [{ x: 300, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
    },
    MEDIUM: {
        0: [{ x: 250, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
        1: [{ x: 200, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
        2: [{ x: 300, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
    },
};

//czas od ostatniego zadania obrazen przez przeciwnika
let damageCooldown = 0;
const DAMAGE_COOLDOWN_FRAMES = 60;

//funkcja tworzaca postac przeciwnika
export function drawEnemy(enemy) {
    enemy.forEach(enemy => {
        ctx.drawImage(GAME_ASSETS.enemyImage, enemy.x, enemy.y, enemy.size, enemy.size);
    });
}

//funkcja zwracajaca przeciwnika zaleznie od aktualnej mapy
export function getCurrentEnemy() {
    return enemyList[currentDifficulty][currentMapIndex] || [];
}

//funkcja aktualizujaca kierunek przeciwnika oraz zadawanie obrazen
export function updateEnemies() {
    const enemies = getCurrentEnemy();
    if (!enemies) return;
    
    enemies.forEach(enemy => {
        //aktualizacja pozycji przeciwnika
        enemy.x += enemy.speedX * enemy.dir;

        //obliczanie pozycji kafelka, na którym znajduje się przeciwnik
        const tileY = Math.floor((enemy.y + enemy.size / 2) / TILE_SIZE);

        //obliczanie pozycji kafelka, na który przeciwnik chce wejść
        let nextTileIndex;
        if (enemy.dir === 1) {
            nextTileIndex = Math.floor((enemy.x + enemy.size + enemy.speedX) / TILE_SIZE); //sprawdzanie kafelka po prawej stronie przeciwnika
        } else {
            nextTileIndex = Math.floor((enemy.x - enemy.speedX) / TILE_SIZE); //sprawdzanie kafelka po lewej stronie przeciwnika
        }

        let nextTile;
        if (currentMap[tileY]) {
            nextTile = currentMap[tileY][nextTileIndex]; //sprawdzanie czy kafelek istnieje (nie wychodzi poza mapę) 
        }

        if (nextTile === TILES.WALL || nextTile === undefined) {
            enemy.dir *= -1; //zmiana kierunku ruchu przeciwnika gdy odbije sie od sciany
        }

        //obliczanie pozycji kafelka, na którym znajduje się przeciwnik
        const enemyTileX = Math.floor((enemy.x + enemy.size / 2) / TILE_SIZE);
        const enemyTileY = Math.floor((enemy.y + enemy.size / 2) / TILE_SIZE);

        if (damageCooldown > 0) {
            damageCooldown--; //zmniejszanie cooldownu od zadania obrazen przez przeciwnika
        }

        if (player.x === enemyTileX && player.y === enemyTileY && damageCooldown === 0) {
            //zadawanie obrazen graczowi gdy znajduje sie na tym samym kafelku co przeciwnik oraz cooldown od zadania obrazen jest 0
            player.hp -= 25;
            addDamage(25);
            damageCooldown = DAMAGE_COOLDOWN_FRAMES;
        }
    });
    
}



