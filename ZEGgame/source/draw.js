import {ctx, currentMap, canvas, gameState} from './main.js';
import {TILE_SIZE, COLORS, TILES} from './constants.js';
import {player} from './player.js';
import {drawEnemy} from './enemies.js';
import {move} from './movement.js';

export function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //zresetowanie wszelkich rzeczy w canvasie

    if(gameState !== "PLAYING") return; //sprawdzanie czy gracz gra
    for(let y = 0; y < currentMap.length; y++){ //petle sprawdzajace indexy w mapie aby ustawic
        for(let x = 0; x < currentMap[y].length; x++){
            const tile = currentMap[y][x];
            if(tile === TILES.WALL) ctx.fillStyle = COLORS.WALL;
            else if(tile === TILES.EXIT) ctx.fillStyle = COLORS.EXIT;
            else if(tile === TILES.KEY) ctx.fillStyle = COLORS.KEY;
            else if(tile === TILES.HEAL) ctx.fillStyle = COLORS.HEAL;
            else if(tile === TILES.GATE) ctx.fillStyle = COLORS.GATE;
            else if(tile === TILES.TRAP) ctx.fillStyle = COLORS.TRAP;
            else continue;
            
            ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    //ustawienie pozycji oraz wygladu gracza
    ctx.fillStyle = COLORS.PLAYER;
    ctx.fillRect(player.x*TILE_SIZE, player.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);

    //drawEnemy();
    //drawFog(); //trzeba potem to odkomentowac zeby dzialalo
}
function drawFog() {
    const visibilityRadius = TILE_SIZE * 2; // Promień widoczności
    
    //srodek gracza
    const playerCenterX = player.x * TILE_SIZE + TILE_SIZE / 2;
    const playerCenterY = player.y * TILE_SIZE + TILE_SIZE / 2;
    
    ctx.save();
    ctx.beginPath();

    ctx.rect(0, 0, canvas.width, canvas.height); //prostokat(mgla) na caly labirynt oprocz gracza oraz okregu dookola niego
    ctx.arc(playerCenterX, playerCenterY, visibilityRadius, 0, Math.PI * 2, true); //narysowanie kola widocznosci
    
    ctx.fillStyle = COLORS.FOG; //ustawienie mgly
    ctx.fill();

    ctx.restore();
}