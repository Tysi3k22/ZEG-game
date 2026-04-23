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

export function drawFog() {
     const playerCenterX = fog.renderX * TILE_SIZE + TILE_SIZE / 2;
    const playerCenterY = fog.renderY * TILE_SIZE + TILE_SIZE / 2;

    const gradient = ctx.createRadialGradient(
        playerCenterX, playerCenterY, 0,
        playerCenterX, playerCenterY, TILE_SIZE * 2
    );
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.6, "rgba(0,0,0,0.6)");
    gradient.addColorStop(1, COLORS.FOG);

    ctx.fillStyle = gradient;
    ctx.fillRect(camera.renderX, camera.renderY, canvas.width, canvas.height);
}