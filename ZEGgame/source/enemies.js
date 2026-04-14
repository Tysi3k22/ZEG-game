import {ctx, currentMap} from './app.js';
import {COLORS, TILES} from './constants.js';
import {maps} from './maps.js';

//informacje dotyczace przeciwnika
let enemy = {
    x: 50,
    y: 50,
    size: 30,
    speedX: 2,
    dir: 1
}

//funkcja tworzaca postac przeciwnika
export function drawEnemy() {
    ctx.fillStyle = COLORS.ENEMY;
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
}

//funkcja aktualizujaca kierunek przeciwnika
export function updateEnemies() {
    enemy.x += enemy.speedX * enemy.dir;    
    const ex = enemy.x + enemy.speedX;
    const tile = currentMap[3][ex]
    
    if(enemy.x + enemy.size > 800 || enemy.x < 0 || tile == TILES.WALL){
        enemy.dir *= -1;
    }
}



