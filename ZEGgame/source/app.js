const canvas = document.getElementById('game'); // pobranie canvasa
const ctx = canvas.getContext('2d');
const tileSize = 40; //ustawienie wielkosci kafelka

let indeksAktualnejMapy = 0; //zmienna przechowujaca aktualna mape, mozna ja zmieniac aby przechodzic do kolejnych map
let aktualnaMapa = maps[indeksAktualnejMapy]; //pobranie aktualnej mapy z tablicy maps

let hp = document.getElementById('hp');
let klucze = document.getElementById('klucze');

let licznikKluczy = 0;

let player = {
    x: 1, y: 1 //podstawowe polozenie gracza
};

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
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x*tileSize, player.y*tileSize, tileSize, tileSize);
}

function move(dx, dy) {
    //poruszanie sie
    const px = player.x + dx;
    const py = player.y + dy;
    //blokada przed przejściem dalej bez kluczy
    if (licznikKluczy <= 1 && aktualnaMapa[py][px] == 2) {
        alert("Musisz zdobyć wszystkie klucze, aby przejść dalej!"); //alert pokazujacy ze trzeba zdobyć wszystkie klucze aby przejsc dalej
        return; //zatrzymanie funkcji move, aby nie pozwolić na przejście dalej
    }

    if(aktualnaMapa[py][px] != 1){ 
        //mechanika sprawdzania czy nie wchodzi sie w sciane jezeli tak to nie zmienia sie polozenie
        player.x = px;
        player.y = py;
    }
    if(aktualnaMapa[py][px] == 2 && licznikKluczy == 2 ){ //TODO: blokuje wchodzenie na pole mety
        alert("Wygrałeś!"); //alert pokazujacy przescie labiryntu (trzeba zrobic menu glowne aby do niego przechodzic po skonczeniu)
        nastepnaMapa(); //przejscie do kolejnej mapy po przejsciu obecnej
    }
    if(aktualnaMapa[py][px] == 3){
        alert("Zdobyłeś klucz!");
        licznikKluczy++;
        klucze.innerHTML = parseInt(licznikKluczy); 
        aktualnaMapa[py][px] = 0; //usuwanie klucza z mapy po odebraniu
    }
    if(aktualnaMapa[py][px] == 4){
        alert("Zdobyłeś leczenie!");
        hp.innerHTML = "100/100";
        aktualnaMapa[py][px] = 0; //usuwanie leczenia z mapy po odebraniu
    }
    if(aktualnaMapa[py][px] == 5){
        if (licznikKluczy > 0) {
            alert("Odblokowano przejście!");
            licznikKluczy--;
            klucze.innerHTML = parseInt(licznikKluczy);
        }
        aktualnaMapa[py][px] = 0; //czyszczenie kafelki
    }
    Draw();
}

function nastepnaMapa() {
    indeksAktualnejMapy++;

    if (!maps[indeksAktualnejMapy]) {
        alert("Gratulacje! Ukończyłeś wszystkie mapy! (na razie)");
        return;
    }
    aktualnaMapa = maps[indeksAktualnejMapy];

    //resetowanie pozycji gracza i liczby kluczy
    player.x = 1;
    player.y = 1;
    licznikKluczy = 0;
    klucze.innerHTML = parseInt(licznikKluczy);

    Draw();
}

//system poruszania sie zaleznie od nacisnietego przycisku
document.addEventListener('keydown', (e) => {
    // sterowanie strzałkami
    if(e.key == "ArrowUp") move(0,-1); 
    if(e.key == "ArrowDown") move(0,1);
    if(e.key == "ArrowLeft") move(-1,0);
    if(e.key == "ArrowRight") move(1,0);
    // sterowanie WASD
    if(e.key == "w") move(0,-1); 
    if(e.key == "s") move(0,1);
    if(e.key == "a") move(-1,0);
    if(e.key == "d") move(1,0);
})

//funkcjonalnosc przycisku zaczynajacego gre
function startGame(){
    Draw();
}

//podstawowe wyswietalnie labiryntu
Draw();