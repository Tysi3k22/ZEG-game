const canvas = document.getElementById('game'); // pobranie canvasa
const ctx = canvas.getContext('2d');
const tileSize = 40; //ustawienie wielkosci kafelka
let hp = document.getElementById('hp');
let klucze = document.getElementById('klucze');


//podstawowe informacje o graczu
let player = {
    x: 1,
    y: 1,
    keys: 0,
    hp: 20 
};
hp.innerHTML = player.hp + "/100";
klucze.innerHTML = parseInt(player.keys); 

//Swieder mapowanie masz tak map1[y][x]
const map1 = [
    [1,1,1,1,1,1,1,1,1,1,1,1],//1 - sciana
    [1,0,0,0,1,3,0,0,0,0,2,1],//0 - droga
    [1,0,1,0,1,0,1,1,1,1,1,1],//2 - meta
    [1,0,1,0,0,0,0,0,0,0,0,1],//3 - klucz
    [1,0,1,1,1,1,1,1,1,1,0,1],//4 - leczenie
    [1,0,0,0,0,0,0,0,3,1,0,1],
    [1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,1],
    [1,0,1,1,0,0,4,1,0,0,0,1],  
    [1,1,1,1,1,1,1,1,1,1,1,1]
];


function Fog() {
    ctx.beginPath();
    ctx.arc(20, 20, 40, 0, 2 * Math.PI);
    ctx.stroke();
}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //zresetowanie wszelkich rzeczy w canvasie
    for(let y = 0; y < map1.length; y++){ //petle sprawdzajace indexy w mapie aby ustawic
        for(let x = 0; x < map1.length; x++){
            if(map1[y][x] === 1){
                //utworzenie scian
                ctx.fillStyle = '#222';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(map1[y][x] === 2){
                //utworzenie wygladu konca
                ctx.fillStyle = 'green';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(map1[y][x] === 3){
                //utworzenie wygladu klucza
                ctx.fillStyle = 'yellow';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(map1[y][x] === 4){
                //utworzenie wygladu leczenia
                ctx.fillStyle = 'lightgreen';
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
    //blokada przed przejściem dalej bez kluczy
    if (player.keys <= 1 && map1[py][px] == 2) {
        alert("Musisz zdobyć wszystkie klucze, aby przejść dalej!"); //alert pokazujacy ze trzeba zdobyć wszystkie klucze aby przejsc dalej
        return; //zatrzymanie funkcji move, aby nie pozwolić na przejście dalej
    }

    if(map1[py][px] != 1){ 
        //mechanika sprawdzania czy nie wchodzi sie w sciane jezeli tak to nie zmienia sie polozenie
        player.x = px;
        player.y = py;
    }
    if(map1[py][px] == 2 && player.keys == 2 ){ //TODO: blokuje wchodzenie na pole mety
        alert("Wygrałeś!"); //alert pokazujacy przescie labiryntu (trzeba zrobic menu glowne aby do niego przechodzic po skonczeniu)
    }
    if(map1[py][px] == 3){
        alert("Zdobyłeś klucz!");
        player.keys++;
        klucze.innerHTML = parseInt(player.keys); 
        map1[py][px] = 0; //usuwanie klucza z mapy po odebraniu
    }
    if(map1[py][px] == 4){
        alert("Zdobyłeś leczenie!");
        player.hp = 100;
        hp.innerHTML = player.hp + "/100";
        map1[py][px] = 0; //usuwanie leczenia z mapy po odebraniu
    }
    Draw();
}

//system poruszania sie zaleznie od nacisnietego przycisku
document.addEventListener('keydown', (e) => {
    // sterowanie strzałkami oraz wsad'em
    if(e.key == "ArrowUp" || e.key == "w") move(0,-1); 
    if(e.key == "ArrowDown" || e.key == "s") move(0,1);
    if(e.key == "ArrowLeft" || e.key == "a") move(-1,0);
    if(e.key == "ArrowRight" || e.key == "d") move(1,0);
})

//funkcjonalnosc przycisku zaczynajacego gre
function startGame(){
    Draw();
}

//podstawowe wyswietalnie labiryntu
Draw();