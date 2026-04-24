import { TILE_SIZE } from "./constants.js";

// Ustawienie informacji o kamerze
export const camera = {
    x: 0,
    y: 0,
    renderX: 0,
    renderY: 0
};

// Funkcja używana do płynnego przesuwania kamery
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Funkcja aktualizujaca pozycje kamery
export function updateCamera(player, canvasWidth, canvasHeight) {

    // Sprawdzanie czy gracz istnieje
    if (!player) return;

    // Obliczenie plynnego przechodzenia kamery
    const targetX = player.x * TILE_SIZE - canvasWidth / 2;
    const targetY = player.y * TILE_SIZE - canvasHeight / 2;

    // Zmiana pozycji kamery tak aby płynnie przechodzila nad gracza
    camera.x = targetX;
    camera.y = targetY;

    // Płynnie przesuwa kamere w kierunku gracza
    camera.renderX = lerp(camera.renderX, camera.x, 0.1);
    camera.renderY = lerp(camera.renderY, camera.y, 0.1);
}