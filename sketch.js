const particleWidth = 30,
    particleHeight = 30,
    padding = 5;

const HEALTHY = 0,
    SICK = 2,
    DEAD = 4;

let isLoop = true;

// Environment
// 
let fishRate = 0.1,
    grassRate = 0.3;

let oxygenRate = 0.5;//range:[0,1]

// let fishes = [],
//     grasses = [];
let particles = [];

function setup() {
    createCanvas(900, 900);
    const rowNum = parseInt(width / particleWidth),
        columnNum = parseInt(height / particleHeight),
        allNum =  rowNum * columnNum;
    particles = new Array(rowNum);
    for(let i = 0; i < columnNum; i++){
        particles[i] = new Array(columnNum);
    }
    console.log(particles)

    let fishNum = parseInt(fishRate * allNum),
        grassNum = parseInt(grassRate * allNum);

    for (let i = 0; i < fishNum; i++){
        let x = parseInt(random(rowNum)),
            y = parseInt(random(columnNum));
        
        while(particles[x][y]){
            x = parseInt(random(rowNum)),
            y = parseInt(random(columnNum));
        }
        particles[x][y] = new Fish(x, y);
    }

    for (let i = 0; i < grassNum; i++){
        let x = parseInt(random(rowNum)),
            y = parseInt(random(columnNum));
        
        while(particles[x][y]){
            x = parseInt(random(rowNum)),
            y = parseInt(random(columnNum));
        }
        particles[x][y] = new Grass(x, y);
    }

    frameRate(2);
    ellipseMode(CORNER);

    let buttonPlay = createButton('play/pause');
    buttonPlay.mousePressed(playPause);
}
  
function draw() {
    background(224, 255, 255);
    text(isLoop, 60, 20);

    push();
    stroke(220);
    for (let x = 0; x <= width; x += particleWidth){
        line(x, 0, x , height);
    }
    for (let y = 0; y <= height; y += particleHeight) {
        line(0, y, width, y);
    }
    pop();

    particles.forEach(row => {
        row.forEach(particle => {
            if(particle){
                particle.grow();
                particle.plot();
            }
        });
    });
}

function playPause() {
    isLoop = isLoop ? false : true;
    if (isLoop) loop();
    else noLoop();
}

function keyPressed() {
    if (key === ' ') {
        playPause();
    }
}

function getNullSpace(x,y){
    let nullSpace = [];
    const rowNum = parseInt(width / particleWidth),
        columnNum = parseInt(height / particleHeight);

    if(x > 0){//left
        if(!particles[x-1][y]){
            nullSpace.push({
                "x": x - 1,
                "y": y
            });
        }
        if(y > 0 && !particles[x-1][y-1]){//left top
            nullSpace.push({
                "x": x - 1,
                "y": y - 1
            });
        }
        if(y < columnNum - 1 && !particles[x-1][y+1]){//left bottom
            nullSpace.push({
                "x": x - 1,
                "y": y + 1
            });
        }
    }

    if(x < rowNum - 1){//right
        if(!particles[x+1][y]){
            nullSpace.push({
                "x": x + 1,
                "y": y
            });
        }
        if(y > 0 && !particles[x+1][y-1]){//right top
            nullSpace.push({
                "x": x + 1,
                "y": y - 1
            });
        }
        if(y < columnNum - 1 && !particles[x+1][y+1]){//right bottom
            nullSpace.push({
                "x": x + 1,
                "y": y + 1
            });
        }
    }
    if(y > 0){//top
        if(!particles[x][y-1]) 
            nullSpace.push({
                "x": x,
                "y": y-1
            });
    }
    if(y < columnNum - 1){//bottom
        if(!particles[x][y+1]) 
            nullSpace.push({
                "x": x,
                "y": y+1
            });
    }

    return nullSpace[parseInt(random(nullSpace.length))];
}