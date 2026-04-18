import { drawEnemy, updateEnemies, getCurrentEnemy } from './enemies.js';
import {TILE_SIZE, COLORS, TILES, GAME_ASSETS} from './constants.js';
import {ctx, currentMap, canvas, gameState} from './main.js';
import {move} from './movement.js';
import {player} from './player.js';
import {drawFog} from './fog.js';

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
                ctx.drawImage(GAME_ASSETS.gateImage, x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
                continue;
            } 
            else if(tile === TILES.TRAP) {
                ctx.drawImage(GAME_ASSETS.trapImage, x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
                continue;
            }
            else continue;
            
            ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    //ustawienie pozycji oraz wygladu gracza
    ctx.drawImage(GAME_ASSETS.playerImage, player.renderX*TILE_SIZE, player.renderY*TILE_SIZE, TILE_SIZE, TILE_SIZE);
    
    const enemy = getCurrentEnemy(); //przypisanie przeciwnika do aktualnej mapy
    updateEnemies(); //zaladowanie poruszania oraz zadawania obrazen od przeciwnika
    drawEnemy(enemy); //narywowanie przeciwnika
}
