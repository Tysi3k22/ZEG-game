const canvas = document.getElementById('game'); // pobranie canvasa
const ctx = canvas.getContext('2d');
const tileSize = 40; //ustawienie wielkosci kafelka
let hp = document.getElementById('hp');
let klucze = document.getElementById('klucze');

klucze = 0;

//Swieder mapowanie masz tak map[y][x]
const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1],//1 - sciana
    [1,0,0,0,1,3,0,0,0,0,2,1],//0 - droga
    [1,0,1,0,1,0,1,1,1,1,1,1],//2 - meta
    [1,0,1,0,0,0,0,0,0,0,0,1],//3 - klucz
    [1,0,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,3,1,0,1],
    [1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,0,0,0,1,0,0,0,1],  
    [1,1,1,1,1,1,1,1,1,1,1,1]
];

let player = {
    x: 1, y: 1 //podstawowe polozenie gracza
};

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //zresetowanie wszelkich rzeczy w canvasie
    for(let y = 0; y < map.length; y++){ //petle sprawdzajace indexy w mapie aby ustawic
        for(let x = 0; x < map.length; x++){
            if(map[y][x] === 1){
                //utworzenie scian
                ctx.fillStyle = '#222';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(map[y][x] === 2){
                //utworzenie wygladu konca
                ctx.fillStyle = 'green';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(map[y][x] === 3){
                //utworzenie wygladu klucza
                ctx.fillStyle = 'yellow';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
        }
    }
    //ustawienie pozycji oraz wygladu gracza
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x*tileSize, player.y*tileSize, tileSize, tileSize);
}

function move(dx, dy) {
    //poruszanie sie
    const px = player.x + dx;
    const py = player.y + dy;

    if(map[py][px] != 1){ 
        //mechanika sprawdzania czy nie wchodzi sie w sciane jezeli tak to nie zmienia sie polozenie
        player.x = px;
        player.y = py;
    }
    if(map[py][px] == 2){
        alert("Wygrałeś!"); //alert pokazujacy przescie labiryntu (trzeba zrobic menu glowne aby do niego przechodzic po skonczeniu)
    }
    if(map[py][px] == 3){
        alert("Zdobyłeś klucz!");
        klucze++;
        map[py][px] = 0; //usuwanie klucza po odebraniu
    }
    Draw();
}

//sytem poruszania sie zaleznie od nacisnietego przycisku
document.addEventListener('keydown', (e) => {
    if(e.key == "ArrowUp") move(0,-1); 
    if(e.key == "ArrowDown") move(0,1);
    if(e.key == "ArrowLeft") move(-1,0);
    if(e.key == "ArrowRight") move(1,0);
})

//funkcjonalnosc przycisku zaczynajacego gre
function startGame(){
    Draw();
}

//podstawowe wyswietalnie labiryntu
Draw();