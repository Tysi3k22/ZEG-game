import {player} from './player.js';
import {TILE_SIZE, COLORS} from './constants.js';
import {ctx, canvas} from './main.js'
import {camera} from './camera.js';

export const fog = {
    x: player.x,
    y: player.y,
    renderX: player.x,
    renderY: player.y
};

export function drawFog() {
    const visibilityRadius = TILE_SIZE * 1.5; // Promień widoczności
    
    //srodek gracza
    const playerCenterX = fog.renderX * TILE_SIZE + TILE_SIZE / 2;
    const playerCenterY = fog.renderY * TILE_SIZE + TILE_SIZE / 2;
    
    ctx.save();
    ctx.beginPath();

    ctx.rect(0, 0, canvas.width, canvas.height); //prostokat(mgla) na caly labirynt oprocz gracza oraz okregu dookola niego
    ctx.arc(playerCenterX, playerCenterY, visibilityRadius, 0, Math.PI * 2, true); //narysowanie kola widocznosci
    const gradient = ctx.createRadialGradient(
        playerCenterX, playerCenterY, 0,
        playerCenterX, playerCenterY, visibilityRadius
    );

    gradient.addColorStop(0, "rgba(0,0,0,0)");     // pełna widoczność
    gradient.addColorStop(0.6, "rgba(0,0,0,0.6)");
    gradient.addColorStop(1, COLORS.FOG);          // pełna mgła

    ctx.globalCompositeOperation = "destination-out";

    ctx.fillStyle = gradient;
    ctx.arc(playerCenterX, playerCenterY, visibilityRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}