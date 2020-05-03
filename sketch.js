const particleWidth = 30,
    particleHeight = 30,
    padding = 5;

const HEALTHY = 0,
    HUNGRY = 1,
    DEAD = 4;

let isLoop = true;

// Environment
// 
let fishRate = 0.1,
    grassRate = 0.3;

let oxygenRate = 0.5;//range:[0,1]

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

    function detectedNull(x1, y1){
        if(!particles[x1][y1]){
            nullSpace.push({
                "x": x1,
                "y": y1
            });
        }
    }

    if(x > 0){//left
        detectedNull(x - 1, y);
        if(y > 0){//left top
            detectedNull(x - 1, y - 1)
        }
        if(y < columnNum - 1){//left bottom
            detectedNull(x - 1, y + 1)
        }
    }

    if(x < rowNum - 1){//right
        detectedNull(x + 1, y);
        if(y > 0){//right top
            detectedNull(x + 1, y - 1);
        }
        if(y < columnNum - 1){//right bottom
            detectedNull(x + 1, y + 1);
        }
    }
    if(y > 0){//top
        detectedNull(x, y - 1);
    }
    if(y < columnNum - 1){//bottom
        detectedNull(x, y + 1);
    }

    return nullSpace[parseInt(random(nullSpace.length))];
}

function findGrass(x,y){
    const rowNum = parseInt(width / particleWidth),
        columnNum = parseInt(height / particleHeight);

    function isGrass(x1, y1){
        if(x1 >= 0 && y1 >= 0 && x1 < rowNum && y1 < columnNum)
            return (particles[x1][y1] && particles[x1][y1].type === "grass" && particles[x1][y1].status === HEALTHY);
        return false;
    }

    let count = 0;
    while(count < 12){
        count ++;
        let dis = parseInt(count/4);
        let x1 = parseInt(random(dis*2+1)) - dis + x,
            y1 = parseInt(random(dis*2+1)) - dis + y;
        if(isGrass(x1, y1)){
            return {
                "x": x1,
                "y": y1
            }
        }
    }
    return;
}