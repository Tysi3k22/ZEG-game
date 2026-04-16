import { drawEnemy, updateEnemies, getCurrentEnemy } from './enemies.js';
import {TILE_SIZE, COLORS, TILES, GAME_ASSETS} from './constants.js';
import {ctx, currentMap, canvas, gameState} from './main.js';
import {move} from './movement.js';
import {player} from './player.js';

export function Draw() {
    if(gameState !== "PLAYING") return; //sprawdzanie czy gracz gra
    for(let y = 0; y < currentMap.length; y++){ //petle sprawdzajace indexy w mapie aby ustawic
        for(let x = 0; x < currentMap[y].length; x++){
            const tile = currentMap[y][x];
            if(tile === TILES.WALL) ctx.fillStyle = COLORS.WALL;
            else if(tile === TILES.EXIT) ctx.fillStyle = COLORS.EXIT;
            else if(tile === TILES.KEY) {
                ctx.drawImage(GAME_ASSETS.keyImage, x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
                continue;
            }
            else if(tile === TILES.HEAL){
                ctx.drawImage(GAME_ASSETS.healImage, x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
                continue;  
            } 
            else if(tile === TILES.GATE){
                //ctx.drawImage()
                ctx.fillStyle = COLORS.GATE;
            } 
            else if(tile === TILES.TRAP) ctx.fillStyle = COLORS.TRAP;
            else continue;
            
            ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    //ustawienie pozycji oraz wygladu gracza
    ctx.drawImage(GAME_ASSETS.playerImage, player.renderX*TILE_SIZE, player.renderY*TILE_SIZE, TILE_SIZE, TILE_SIZE);
    // ctx.fillStyle = COLORS.PLAYER;
    // ctx.fillRect(player.x*TILE_SIZE, player.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
    
    const enemy = getCurrentEnemy(); //przypisanie przeciwnika do aktualnej mapy
    updateEnemies(); //zaladowanie poruszania oraz zadawania obrazen od przeciwnika
    drawEnemy(enemy); //narywowanie przeciwnika
    drawFog(); //narywowanie mgly
}
function drawFog() {
    const visibilityRadius = TILE_SIZE * 1.5; // Promień widoczności
    
    //srodek gracza
    const playerCenterX = player.x * TILE_SIZE + TILE_SIZE / 2;
    const playerCenterY = player.y * TILE_SIZE + TILE_SIZE / 2;
    
    ctx.save();
    ctx.beginPath();

    ctx.rect(0, 0, canvas.width, canvas.height); //prostokat(mgla) na caly labirynt oprocz gracza oraz okregu dookola niego
    ctx.arc(playerCenterX, playerCenterY, visibilityRadius, 0, Math.PI * 2, true); //narysowanie kola widocznosci
    const gradient = ctx.createRadialGradient(
        playerCenterX, playerCenterY, 0,
        playerCenterX, playerCenterY, visibilityRadius
    );

    gradient.addColorStop(0, "rgba(0,0,0,0)");     // pełna widoczność
    gradient.addColorStop(0.6, "rgba(0,0,0,0.4)");
    gradient.addColorStop(1, COLORS.FOG);          // pełna mgła

    ctx.globalCompositeOperation = "destination-out";

    ctx.fillStyle = gradient;
    ctx.arc(playerCenterX, playerCenterY, visibilityRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}