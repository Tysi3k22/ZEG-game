import {ctx, currentMap} from './app.js';
import {COLORS, TILES, TILE_SIZE} from './constants.js';
import {maps} from './maps.js';

//informacje dotyczace przeciwnika
let enemy = {
    x: 250,
    y: 210,
    size: 20,
    speedX: 2,
    dir: -1
}

//funkcja tworzaca postac przeciwnika
export function drawEnemy() {
    ctx.fillStyle = COLORS.ENEMY;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
}

//funkcja aktualizujaca kierunek przeciwnika
export function updateEnemies() {
    enemy.x += enemy.speedX * enemy.dir;

    const tileY = Math.floor((enemy.y + enemy.size / 2) / TILE_SIZE);

    let nextTileIndex;

    if (enemy.dir === 1) {
        nextTileIndex = Math.floor((enemy.x + enemy.size + enemy.speedX) / TILE_SIZE);
    } else {
        nextTileIndex = Math.floor((enemy.x - enemy.speedX) / TILE_SIZE);
    }

    const nextTile = currentMap[tileY]?.[nextTileIndex];

    if (nextTile === TILES.WALL || nextTile === undefined) {
        enemy.dir *= -1;
    }
}



