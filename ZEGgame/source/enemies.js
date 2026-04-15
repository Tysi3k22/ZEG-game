import {ctx, currentMap, currentMapIndex} from './main.js';
import {COLORS, TILES, TILE_SIZE, GAME_ASSETS} from './constants.js';
import {player} from './player.js';

//informacje dotyczace przeciwnika
export let enemies = [
    {x: 250, y: 200, size: TILE_SIZE, speedX: 2, dir: -1},
    {x: 200, y: 200, size: TILE_SIZE, speedX: 2, dir: -1},
    {x: 300, y: 200, size: TILE_SIZE, speedX: 2, dir: -1}  
]

let damageCooldown = 0;
const DAMAGE_COOLDOWN_FRAMES = 60;

//funkcja tworzaca postac przeciwnika
export function drawEnemy(enemy) {
    ctx.drawImage(GAME_ASSETS.enemyImage, enemy.x, enemy.y, enemy.size, enemy.size);
}

export function getCurrentEnemy() {
    return enemies[currentMapIndex] || null;
}

//funkcja aktualizujaca kierunek przeciwnika oraz zadawanie obrazen
export function updateEnemies() {
    const enemy = getCurrentEnemy();
    if (!enemy) return;
    
    enemy.x += enemy.speedX * enemy.dir;

    const tileY = Math.floor((enemy.y + enemy.size / 2) / TILE_SIZE);

    let nextTileIndex;
    if (enemy.dir === 1) {
        nextTileIndex = Math.floor((enemy.x + enemy.size + enemy.speedX) / TILE_SIZE);
    } else {
        nextTileIndex = Math.floor((enemy.x - enemy.speedX) / TILE_SIZE);
    }

    let nextTile;
    if (currentMap[tileY]) {
        nextTile = currentMap[tileY][nextTileIndex];
    }

    if (nextTile === TILES.WALL || nextTile === undefined) {
        enemy.dir *= -1;
    }

    const enemyTileX = Math.floor((enemy.x + enemy.size / 2) / TILE_SIZE);
    const enemyTileY = Math.floor((enemy.y + enemy.size / 2) / TILE_SIZE);

    if (damageCooldown > 0) {
        damageCooldown--;
    }

    if (player.x === enemyTileX && player.y === enemyTileY && damageCooldown === 0) {
        player.hp -= 25;
        damageCooldown = DAMAGE_COOLDOWN_FRAMES;
    }

    
}



