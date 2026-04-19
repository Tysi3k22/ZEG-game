import { drawEnemy, updateEnemies, getCurrentEnemy } from './enemies.js';
import {TILE_SIZE, COLORS, TILES, GAME_ASSETS} from './constants.js';
import {ctx, currentMap, state} from './main.js';
import {move} from './movement.js';
import {player} from './player.js';
import {drawFog} from './fog.js';

export function Draw() {
    if(state.gameState !== "PLAYING") return; //sprawdzanie czy gracz gra
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
            }else if(tile === TILES.RED_GATE) {
                ctx.fillStyle = COLORS.RED_GATE;
                // ctx.drawImage(GAME_ASSETS.redGateImage, x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
                // continue;
            }else if(tile === TILES.RED_OPENER) {
                ctx.fillStyle = COLORS.RED_OPENER;
            }
            else continue;
            
            ctx.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    // Animacja gracza
    const animation = player.animation;
    const FRAME_WIDTH = 2080;
    const FRAME_HEIGHT = 2080;
    let sprite;
    let totalFrames = 2;
    let fps = 6;

    // wybor spirita i ilosci klatek na podstawie animacji
    if(animation.state === "walk") {
        sprite = GAME_ASSETS.walkImage;
        totalFrames = 2;
        fps = 8;
    }else {
        sprite = GAME_ASSETS.playerImage;
        totalFrames = 1;
        fps = 1;
        animation.frame = 0; 
    }

    // aktualizacja klatki animacji na podstawie czasu
    const now = performance.now();
    if(now - animation.lastTime > 1000 / fps) {
        animation.frame = (animation.frame + 1) % totalFrames;
        animation.lastTime = now;
    }

    // rysowanie gracza
    ctx.drawImage(sprite, animation.frame * FRAME_WIDTH, 0, FRAME_WIDTH, FRAME_HEIGHT, player.renderX * TILE_SIZE, player.renderY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    
    
    const enemy = getCurrentEnemy(); //przypisanie przeciwnika do aktualnej mapy
    updateEnemies(); //zaladowanie poruszania oraz zadawania obrazen od przeciwnika
    drawEnemy(enemy); //narywowanie przeciwnika
}
