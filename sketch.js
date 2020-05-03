const particleWidth = 30,
    particleHeight = 30,
    padding = 5;

// Environment
// 
let oxygenRate = 0.5;//range:[0,1]

let fishRate = 0.3,
    grassRate = 0.3;

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
        particles[x][y] = new Fish(x * particleWidth, y * particleHeight);
    }

    for (let i = 0; i < grassNum; i++){
        let x = parseInt(random(rowNum)),
            y = parseInt(random(columnNum));
        
        while(particles[x][y]){
            x = parseInt(random(rowNum)),
            y = parseInt(random(columnNum));
        }
        particles[x][y] = new Grass(x * particleWidth, y * particleHeight);
    }

    frameRate(40);
    ellipseMode(CORNER);
}
  
function draw() {
    background(224, 255, 255);

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
                particle.plot();
            }
        });
    });
}