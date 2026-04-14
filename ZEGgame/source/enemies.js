//informacje dotyczace przeciwnika
let enemy = {
    x: 100,
    y: 100,
    size: 30,
    speedX: 2,
    dir: 1
}

//funkcja tworzaca postac przeciwnika
export function drawEnemy() {
    ctx.fillStyle = COLORS.ENEMY;
    ctx.fillRect(enemy.x*enemy.size, enemy.y*enemy.size, enemy.size, enemy.size);
}

//funkcja aktualizujaca kierunek przeciwnika
export function updateEnemies() {
    enemy.x += enemy.speedX * enemy.dir;    

    if(enemy.x + enemy.size > 800 || enemy.x < 0){
        enemy.dir *= -1;
    }
}



