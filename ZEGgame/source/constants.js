export const TILE_SIZE = 40; // rozmiar jednego kafelka
export const MAX_HP = 100; // maksymalna ilosc zdrowia gracza


//wczytywanie obrazkow do gry
const playerImage = new Image();
playerImage.src = 'assets/gracz1.png';

const healImage = new Image();
healImage.src = 'assets/leczenie.png';

const keyImage = new Image();
keyImage.src = 'assets/kluczyk.png';

const gateImage = new Image();
gateImage.src = 'assets/brama.png';

const enemyImage = new Image();
enemyImage.src = 'assets/przeciwnik.png';

const trapImage = new Image();
trapImage.src = 'assets/pulapka.png';

//punktualny opis kalefkow w labiryncie
export const TILES = {
    EMPTY: 0,
    WALL: 1,
    EXIT: 2,
    KEY: 3,
    HEAL: 4,
    GATE: 5,
    TRAP: 6,
    WAY_TO_EXIT: 7
};

//punktualny opis obrazkow w grze
export const GAME_ASSETS = {
    playerImage: playerImage,
    healImage: healImage,
    keyImage: keyImage,
    enemyImage: enemyImage,
    gateImage: gateImage,
    trapImage: trapImage
}

//punktualny opis kolorow w labiryncie
export const COLORS = {
    PLAYER: 'red',
    WALL: '#222',
    EXIT: 'green',
    KEY: 'yellow',
    HEAL: 'lightgreen',
    GATE: 'brown',
    FOG: 'rgba(0, 0, 0,0.98)',
    ENEMY: 'purple',
    TRAP: 'rgba(99, 223, 223, 0.95)',
    WAY_TO_EXIT: 'rgba(255, 255, 0, 0.5)'
}