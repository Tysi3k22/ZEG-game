const canvas = document.getElementById('game'); // pobranie canvasa
const ctx = canvas.getContext('2d');
const tileSize = 40; //ustawienie wielkosci kafelka

let indeksAktualnejMapy = 0; //zmienna przechowujaca aktualna mape, mozna ja zmieniac aby przechodzic do kolejnych map
let aktualnaMapa = maps[indeksAktualnejMapy]; //pobranie aktualnej mapy z tablicy maps

let hp_html = document.getElementById('hp');
let keys_html = document.getElementById('klucze');


//podstawowe informacje o graczu
let player = {
    x: 1,
    y: 1,
    keys: 0,
    hp: 20 
};
hp.innerHTML = player.hp + "/100";
klucze.innerHTML = parseInt(player.keys); 

function drawFog() {
    const visibilityRadius = tileSize * 2; // Promień widoczności
    ctx.save();

    //srodek gracza
    const playerCenterX = player.x * tileSize + tileSize / 2;
    const playerCenterY = player.y * tileSize + tileSize / 2;

    ctx.beginPath();
    
    //prostokat(mgla) na caly labirynt oprocz gracza oraz okregu dookola niego
    ctx.rect(0, 0, canvas.width, canvas.height);
    //narysowanie kola widocznosci
    ctx.arc(playerCenterX, playerCenterY, visibilityRadius, 0, Math.PI * 2, true);
    
    //ustawienie mgly
    ctx.fillStyle = "black"; 
    ctx.fill();

    ctx.restore();
}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //zresetowanie wszelkich rzeczy w canvasie
    
    for(let y = 0; y < aktualnaMapa.length; y++){ //petle sprawdzajace indexy w mapie aby ustawic
        for(let x = 0; x < aktualnaMapa[y].length; x++){
            if(aktualnaMapa[y][x] === 1){
                //utworzenie scian
                ctx.fillStyle = '#222';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(aktualnaMapa[y][x] === 2){
                //utworzenie wygladu konca
                ctx.fillStyle = 'green';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(aktualnaMapa[y][x] === 3){
                //utworzenie wygladu klucza
                ctx.fillStyle = 'yellow';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(aktualnaMapa[y][x] === 4){
                //utworzenie wygladu leczenia
                ctx.fillStyle = 'lightgreen';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(aktualnaMapa[y][x] === 5){
                //utworzenie wygladu leczenia
                ctx.fillStyle = 'brown';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
        }
    }
    //ustawienie pozycji oraz wygladu gracza
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x*tileSize, player.y*tileSize, tileSize, tileSize);

    drawFog();
}

function move(dx, dy) {
    //poruszanie sie
    const px = player.x + dx;
    const py = player.y + dy;
    //blokada przed przejściem dalej bez kluczy
    if (player.keys <= 1 && aktualnaMapa[py][px] == 2) {
        wiadomosc("Musisz zdobyć wszystkie klucze, aby przejść dalej!"); //dymek pokazujacy ze trzeba zdobyć wszystkie klucze aby przejsc dalej
        return; //zatrzymanie funkcji move, aby nie pozwolić na przejście dalej
    }
    if (player.keys <= 0 && aktualnaMapa[py][px] == 5) {
        wiadomosc("Musisz zdobyć klucz, aby odblokować przejście!");
        return;
    }

    if(aktualnaMapa[py][px] != 1){ 
        //mechanika sprawdzania czy nie wchodzi sie w sciane jezeli tak to nie zmienia sie polozenie
        player.x = px;
        player.y = py;
    }
    if(aktualnaMapa[py][px] == 2 && player.keys == 2 ){ //TODO: blokuje wchodzenie na pole mety
        wiadomosc("Wygrałeś!"); //dymek pokazujacy przescie labiryntu (trzeba zrobic menu glowne aby do niego przechodzic po skonczeniu)
        nastepnaMapa(); //przejscie do kolejnej mapy po przejsciu obecnej
    }
    if(aktualnaMapa[py][px] == 3){
        wiadomosc("Zdobyłeś klucz!");
        player.keys++;
        klucze.innerHTML = parseInt(player.keys); 
        aktualnaMapa[py][px] = 0; //usuwanie klucza z mapy po odebraniu
    }
    if(aktualnaMapa[py][px] == 4){
        wiadomosc("Zdobyłeś leczenie!");
        player.hp = 100;
        hp.innerHTML = player.hp + "/100";
        aktualnaMapa[py][px] = 0; //usuwanie leczenia z mapy po odebraniu
    }
    if(aktualnaMapa[py][px] == 5){
        if (player.keys > 0) {
            wiadomosc("Odblokowano przejście!");
            player.keys--;
            klucze.innerHTML = parseInt(player.keys);
            aktualnaMapa[py][px] = 0; //czyszczenie kafelki
        } else {
            wiadomosc("Brakuje kluczy, aby odblokować przejście!");
        }
    }
    Draw();
}

function nastepnaMapa() {
    indeksAktualnejMapy++;

    if (!maps[indeksAktualnejMapy]) {
        wiadomosc("Gratulacje! Ukończyłeś wszystkie mapy! (na razie)");
        return;
    }
    aktualnaMapa = maps[indeksAktualnejMapy];

    //resetowanie pozycji gracza i liczby kluczy
    player.x = 1;
    player.y = 1;
    player.keys = 0;
    klucze.innerHTML = parseInt(player.keys);

    Draw();
}

function wiadomosc(text) {
    const msg = document.getElementById('msg');
    msg.innerText = text;

    setTimeout(() => {
        msg.innerText = '';
    }, 2000);
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