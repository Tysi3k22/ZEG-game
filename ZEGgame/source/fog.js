import {player} from './player.js';
import {TILE_SIZE, COLORS} from './constants.js';
import {ctx, canvas} from './main.js'
import {camera} from './camera.js';

// ustawienie informacji o mgle
export const fog = {
    x: player.x,
    y: player.y,
    renderX: player.x,
    renderY: player.y
};

// funkcja mgly
export function drawFog() {
    // ustawienie widocznosci
    const visibilityRadius = TILE_SIZE * 1.5; // Promień widoczności
    
    //srodek gracza
    const playerCenterX = fog.renderX * TILE_SIZE + TILE_SIZE / 2;
    const playerCenterY = fog.renderY * TILE_SIZE + TILE_SIZE / 2;
    
    ctx.save();
    ctx.beginPath();

    // narysowanie prostokata (mgly) na caly labirynt oprocz gracza oraz okregu dookola niego
    ctx.rect(0, 0, canvas.width, canvas.height); //prostokat(mgla) na caly labirynt oprocz gracza oraz okregu dookola niego
    ctx.arc(playerCenterX, playerCenterY, visibilityRadius, 0, Math.PI * 2, true); //narysowanie kola widocznosci

    // stworzenie gradientu radialnego ktory bedzie przechodzil od pelnej widocznosci do pelnej mgly
    const gradient = ctx.createRadialGradient(playerCenterX, playerCenterY, 0, playerCenterX, playerCenterY, visibilityRadius);

    gradient.addColorStop(0, "rgba(0,0,0,0)");     // pełna widoczność
    gradient.addColorStop(0.6, "rgba(0,0,0,0.6)");
    gradient.addColorStop(1, COLORS.FOG);          // pełna mgła

    // ustawienie destination-out aby narysowac widocznosci gracza
    ctx.globalCompositeOperation = "destination-out"; 

    // narysowanie mgly z gradientem
    ctx.fillStyle = gradient;
    ctx.arc(playerCenterX, playerCenterY, visibilityRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}