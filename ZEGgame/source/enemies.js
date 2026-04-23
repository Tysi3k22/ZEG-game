import {ctx, currentMap, currentMapIndex, addDamage} from './main.js';
import {TILES, TILE_SIZE, GAME_ASSETS} from './constants.js';
import {player} from './player.js';

// Informacje dotyczace przeciwnika
export let enemyList = {
        0: [{ x: 250, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
        1: [{ x: 200, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
        2: [{ x: 300, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
        3: [{ x: 250, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
        4: [{ x: 200, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
        5: [{ x: 300, y: 200, size: TILE_SIZE, speedX: 2, dir: -1 }],
};

// Czas od ostatniego zadania obrażeń przez przeciwnika
let damageCooldown = 0;
const DAMAGE_COOLDOWN_FRAMES = 60;

// Funkcja tworząca postać przeciwnika
export function drawEnemy(enemy) {
    enemy.forEach(enemy => {
        ctx.drawImage(GAME_ASSETS.enemyImage, enemy.x, enemy.y, enemy.size, enemy.size);
    });
}

// Funkcja zwracająca przeciwnika zaleznie od aktualnej mapy
export function getCurrentEnemy() {
    return enemyList[currentMapIndex] || [];
}

// Funkcja aktualizująca kierunek przeciwnika oraz zadawanie obrażeń
export function updateEnemies() {
    const enemies = getCurrentEnemy();
    if (!enemies) return;
    
    enemies.forEach(enemy => {
        // Aktualizacja pozycji przeciwnika
        enemy.x += enemy.speedX * enemy.dir;

        // Obliczanie pozycji kafelka, na którym znajduje się przeciwnik
        const tileY = Math.floor((enemy.y + enemy.size / 2) / TILE_SIZE);

        // Obliczanie pozycji kafelka, na który przeciwnik chce wejść
        let nextTileIndex;
        if (enemy.dir === 1) {
            nextTileIndex = Math.floor((enemy.x + enemy.size + enemy.speedX) / TILE_SIZE); // Sprawdzanie kafelka po prawej stronie przeciwnika
        } else {
            nextTileIndex = Math.floor((enemy.x - enemy.speedX) / TILE_SIZE); // Sprawdzanie kafelka po lewej stronie przeciwnika
        }

        let nextTile;
        if (currentMap[tileY]) {
            nextTile = currentMap[tileY][nextTileIndex]; // Sprawdzanie czy kafelek istnieje (nie wychodzi poza mapę) 
        }

        if (nextTile === TILES.WALL || nextTile === undefined) {
            enemy.dir *= -1; // Zmiana kierunku ruchu przeciwnika gdy odbije się od ściany
        }

        // Obliczanie pozycji kafelka, na którym znajduje się przeciwnik
        const enemyTileX = Math.floor((enemy.x + enemy.size / 2) / TILE_SIZE);
        const enemyTileY = Math.floor((enemy.y + enemy.size / 2) / TILE_SIZE);

        if (damageCooldown > 0) {
            damageCooldown--; // Zmniejszanie cooldownu od zadania obrażeń przez przeciwnika
        }

        if (player.x === enemyTileX && player.y === enemyTileY && damageCooldown === 0) {
            // Zadawanie obrażeń graczowi gdy znajduje się na tym samym kafelku co przeciwnik oraz cooldown od zadania obrażeń jest 0
            player.hp -= 25;
            addDamage(25);
            damageCooldown = DAMAGE_COOLDOWN_FRAMES;
        }
    });
    
}



