import { TILE_SIZE } from "./constants.js";

//ustawienie informacji o kamerze
export const camera = {
    x: 0,
    y: 0,
    renderX: 0,
    renderY: 0
};

function lerp(a, b, t) {
    return a + (b - a) * t;
}

//funkcja aktualizujaca pozycje kamery
export function updateCamera(player, canvasWidth, canvasHeight) {

    //sprawdzanie czy gracz istnieje
    if (!player) return;

    //obliczenie plynnego przechodzenia kamery
    const targetX = player.x * TILE_SIZE - canvasWidth / 2;
    const targetY = player.y * TILE_SIZE - canvasHeight / 2;

    //zmiana pozycji kamery tak aby plynnie przechodzila nad gracza
    camera.x = targetX;
    camera.y = targetY;

    //plynie przesuwa kamere w kierunku gracza
    camera.renderX = lerp(camera.renderX, camera.x, 0.1);
    camera.renderY = lerp(camera.renderY, camera.y, 0.1);
}