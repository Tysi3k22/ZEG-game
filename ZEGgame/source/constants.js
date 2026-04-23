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

// const redGateImage = new Image();
// redGateImage.src = 'assets/czerwona_brama.png';

//punktualny opis kalefkow w labiryncie
export const TILES = {
    EMPTY: 0,
    WALL: 1,
    EXIT: 2,
    KEY: 3,
    HEAL: 4,
    GATE: 5,
    TRAP: 6,
    RED_GATE: 7,
    RED_OPENER: 8
};

//punktualny opis obrazkow w grze
export const GAME_ASSETS = {
    playerImage: playerImage,
    healImage: healImage,
    keyImage: keyImage,
    enemyImage: enemyImage,
    gateImage: gateImage,
    trapImage: trapImage,
    walkImage: walkImage,
    // redGateImage: redGateImage
}

//punktualny opis kolorow w labiryncie
export const COLORS = {
    WALL: '#ffffff',
    EXIT: 'green',
    FOG: 'rgba(0, 0, 0,0.98)',
    RED_GATE: 'red',
    RED_OPENER: 'darkred'
}

export let logic_puzzles = [
    'Mam ręce, ale nie mogę klaskać. Mam twarz, ale nie mogę się uśmiechać. Co to jest?',
    'Im więcej mnie bierzesz, tym więcej mnie przybywa. Co to jest?',
    'Zawsze przed tobą, ale nigdy nie możesz mnie dosięgnąć. Co to jest?',
    'Co ma cztery nogi rano, dwie w południe i trzy wieczorem?',
    'Co jest zawsze w tobie, ale nigdy nie możesz tego zobaczyć?',
    'Co ma zęby, ale nie gryzie?',
    'Mam miasta, ale nie ma w nich domów. Mam góry, ale nie ma na nich drzew. Mam wodę, ale nie ma w niej ryb. Co to jest?',
    'Co można złapać, ale nie można rzucić?',
    'Wchodzę przez okno, przez drzwi i przez dziurkę od klucza, ale nie ruszam się z miejsca. Co to jest?',
    'Wszyscy ludzie na ziemi wchodzą do jednego pokoju i wychodzą z niego — i żaden z nich nie jest w stanie go opuścić. Co to jest?'
];
export let awnsers = [
    'zegar',
    'kroki',
    'przyszłość',
    'człowiek',
    'myśli',
    'grzebień',
    'mapa',
    'przeziębienie',
    'światło',
    'wiek'
    
];