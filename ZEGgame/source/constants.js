export const TILE_SIZE = 40; // rozmiar jednego kafelka
export const MAX_HP = 100; // maksymalna ilosc zdrowia gracza


//wczytywanie obrazkow do gry
const playerImage = new Image();
playerImage.src = 'assets/idle.png';

const walkImage = new Image();
walkImage.src = 'assets/walk.png';

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
};

//punktualny opis obrazkow w grze
export const GAME_ASSETS = {
    playerImage: playerImage,
    healImage: healImage,
    keyImage: keyImage,
    enemyImage: enemyImage,
    gateImage: gateImage,
    trapImage: trapImage,
    walkImage: walkImage
}

//punktualny opis kolorow w labiryncie
export const COLORS = {
    WALL: '#222',
    EXIT: 'green',
    FOG: 'rgba(0, 0, 0,0.98)',
}