const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const tileSize = 40;

const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0], 
    [1,0,1,0,1,0,1,1,1,1,1,1],
    [1,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,1],
    [0,0,1,1,0,0,0,1,0,0,0,1],  
    [1,1,1,1,1,1,1,1,1,1,1,1]
];

let player = {
    x: 1, y: 1
};

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let y = 0; y < map.length; y++){
        for(let x = 0; x < map.length; x++){
            if(map[y][x] === 1){
                ctx.fillStyle = '#222';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
            if(map[y][x] === 2){
                ctx.fillStyle = 'green';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            }
        }
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(player.x*tileSize, player.y*tileSize, tileSize, tileSize);
}


function startGame(){
    Draw();
}