export const TILE_SIZE = 40; // rozmiar jednego kafelka
export const MAX_HP = 100; // maksymalna ilosc zdrowia gracza

//punktualny opis kalefkow w labiryncie
export const TILES = {
    EMPTY: 0,
    WALL: 1,
    EXIT: 2,
    KEY: 3,
    HEAL: 4,
    GATE: 5
};

//punktualny opis kolorow w labiryncie
export const COLORS = {
    PLAYER: 'red',
    WALL: '#222',
    EXIT: 'green',
    KEY: 'yellow',
    HEAL: 'lightgreen',
    GATE: 'brown',
    FOG: 'rgba(0, 0, 0,0.98)',
    ENEMY: 'purple'
}