const particleWidth = 37.5,
    particleHeight = 37.5,
    canvasWidth = 900,
    canvasHeight = 900,
    padding = 5;

const rowNum = parseInt(canvasWidth / particleWidth),
    columnNum = parseInt(canvasHeight / particleHeight);

const HEALTHY = 0,
    HUNGRY = 1,
    DEAD = 2,
    ELECTRIC = 3;

let isLoop = false;
// Environment
// 
let fishRate = 0.1,
    grassRate = 0.1;

let particles = [];
let particles_history = [];

let radioDraw;

// initial ratio of fish:grass:empty
let initial_ratio = [0.3, 0.3, 0.4];
let parts = [];
let splits = [];
let splits_values = [];
let dragStartX = -1;
let dragIndex = -1;
let sliderDiv= null;
let para_container;
let span_grass, span_fish, span_empty;

let imgGrass = {},
    imgFish = {};
function preload() {
    imgGrass[DEAD] = loadImage('./img/grassDead.png');
    imgGrass[HEALTHY] = loadImage('./img/grassHealthy.png');

    imgFish[DEAD] = loadImage('./img/fishDead.png');
    imgFish[HEALTHY] = loadImage('./img/fishHealthy.png');
    imgFish[HUNGRY] = loadImage('./img/fishHungry.png');
    imgFish[ELECTRIC] = loadImage('./img/electric.svg');
}

function setup() {
    let container = createDiv();
    container.class('container');
    let canvas_container = createDiv();
    canvas_container.parent(container)
    let canv = createCanvas(canvasWidth, canvasHeight);
    canv.parent(canvas_container)
    const allNum =  rowNum * columnNum;
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

    // parameters panel 
    para_container = createDiv();
    para_container.parent(container);

    radioDraw = createRadio();
    radioDraw.class('radio radioDraw');
    radioDraw.option('Free fish 🐟', 1);
    radioDraw.option('Electric fish ⚡️', 2);
    radioDraw.value('1');
    let span = createSpan('(Click the canvas !)');
    radioDraw.elt.appendChild(span.elt);
    radioDraw.parent(para_container)
    
    // ratio text div start
    let ratio_div = createDiv();
    ratio_div.parent(para_container);
    let ratio_text = createSpan("the Grass:Fish ratio is ");
    span_grass = createSpan((initial_ratio[0]/(initial_ratio[0]+initial_ratio[1]))*100)
    let span_comma = createSpan(":");
    span_fish = createSpan((initial_ratio[1]/(initial_ratio[0]+initial_ratio[1]))*100);
    let span_text_empty = createSpan(', the pond is ');
    span_empty = createSpan(initial_ratio[2]*100+'%');
    let span_text_final = createSpan(' empty.');

    ratio_text.parent(ratio_div);
    span_grass.parent(ratio_div);
    span_comma.parent(ratio_div);
    span_fish.parent(ratio_div);
    span_text_empty.parent(ratio_div);
    span_empty.parent(ratio_div);
    span_text_final.parent(ratio_div);
    // ratio text div end

    // ratio slider
    sliderDiv = _slider();
    
    // linechart div
    lineChartDiv = LineChart(para_container);

    let buttonPlay = createP('Pause');
    buttonPlay.class('button buttonPlay');
    buttonPlay.mousePressed(playPause);
    buttonPlay.parent(para_container);
}

function _slider() {
    let config = {
        backgrounds:[
            {color:"rgb(65, 117, 5)",icon:"img/grassWhite.svg"},
            {color:"rgb(74, 144, 226)",icon:"img/fishWhite.svg"},
            {color:"#a8dee9"}
        ],
        values:[0.3, 0.3, 0.4],
    }
    let _div = createDiv('');
    _div.class('slider');
    _div.style("color", 'grey');

    _div.parent(para_container)
    
    for(let i=0; i<3; i++) {
        let _p = createDiv('');
        parts.push(_p)
    }

    let left_value = 0
    parts.forEach((part, i)=>{
        part.parent(_div);
        part.class('slider_part');
        part.style('width', initial_ratio[i]*400 +'px');
        part.style('background-color', config.backgrounds[i].color)
        part.style("background-image", "url("+config.backgrounds[i].icon+")")
        part.style("left", (400*left_value)+"px");
        left_value += initial_ratio[i]
    })

    let left_pos = initial_ratio[0]
    for(let i=0; i<2; i++) {
        let split = createDiv('');
        split.parent(_div);
        split.class('slider_split');
        splits.push(split);
        split.style("left", (400*left_pos)+"px");
        splits_values.push(400*left_pos)
        left_pos+=initial_ratio[i+1];
        
        split.elt.addEventListener("mousedown",(e)=>dragStart(e, i),true);

    }
    document.body.addEventListener("mousemove",(e)=>dragging(e),true);
    document.body.addEventListener("mouseup",(e)=>dragEnd(e),true);
    return _div;
}

function dragStart(e, index) {
    dragIndex = index
}
function dragging(e) {
    if(dragIndex === -1) return
    if(dragIndex === 0) {
       if(e.pageX >= sliderDiv.elt.offsetLeft+splits_values[1]) {
            splits_values[0] = splits_values[1]
       } else if (e.pageX <= sliderDiv.elt.offsetLeft) {
            splits_values[0] = 0;
       }
       else {
           splits_values[0] = (e.pageX-sliderDiv.elt.offsetLeft)
       }
           
    } else if(dragIndex === 1) {
        if(e.pageX >= sliderDiv.elt.offsetLeft+400-20) {
             splits_values[1] = 400-10;
        } else if (e.pageX  <= sliderDiv.elt.offsetLeft+splits_values[0])
             splits_values[1] = splits_values[0]
        else 
             splits_values[1] = (e.pageX-sliderDiv.elt.offsetLeft)
     }
    updateSliderUI();
}
function dragEnd(e) {
    dragIndex = -1
}

function updateSliderUI() {
    let _xleft = 0;

    splits.forEach((split, index)=>{
        split.style('left', splits_values[index]+'px');
    })
    parts.forEach((part, index)=>{
        if(index === 2) {
            part.style('left', _xleft+10+'px')
            part.style('width',  400 - _xleft-10+'px');
            initial_ratio[index] = (400 - _xleft-10)/400
        } else {
            part.style('left', _xleft+'px')
            part.style('width', (splits_values[index]-_xleft)+'px');
            initial_ratio[index] = (splits_values[index]-_xleft)/400
            _xleft = splits_values[index];
        }
    })
    initial_ratio.forEach((r, index)=>{
        if(index === 0) span_grass.html(round((initial_ratio[0]/(initial_ratio[0]+initial_ratio[1]))*100));
        else if(index === 1) span_fish.html(round((initial_ratio[1]/(initial_ratio[0]+initial_ratio[1]))*100));
        else  span_empty.html(round(initial_ratio[2]*100)+'%');
    })
}
  
function draw() {
    background(240, 255, 255);
    select('canvas').class(radioDraw.value() === '1' ?'freeFish':'electricFish')

    let currentParticles = [];
    particles.forEach(row => {
        row.forEach(particle => {
            if(particle){
                currentParticles.push(particle);
            }
        });
    });
    currentParticles.forEach(particle => {
        particle.grow();
        particle.plot();
    });
}

function electricFish(x,y){
    if(particles[x][y] && particles[x][y].type === "fish")
        particles[x][y].status = ELECTRIC;
}

function mousePressed(e) {
    if (e.target.id === 'defaultCanvas0'){
        let x = parseInt(mouseX / particleWidth),
            y = parseInt(mouseY / particleHeight);

        switch (radioDraw.value()) {
            case '1': // Free fish
                particles[x][y] = new Fish(x, y);
                break;
            case '2': // Electric fish
                for(let i = 0; i < 4; i++){
                    for (let j = 0; j < 4; j++){
                        if(x-i >= 0 && y-j >= 0) electricFish(x-i, y-j);
                        if(x-i >= 0 && y+j <= columnNum - 1) electricFish(x-i, y+j);
                        if(x+i <= rowNum - 1 && y-j >= 0) electricFish(x+i, y-j);
                        if(x+i <= rowNum - 1 && y+j <= columnNum - 1) electricFish(x+i, y+j);
                    }
                }
                break;
            default: 
                break;
        }
    }
};

function playPause() {
    isLoop = !isLoop;
    const buttonPlay = select('.buttonPlay').elt;

    if (isLoop){
        buttonPlay.innerHTML = "Pause";
        loop();
        lineChartDiv.loop();
    }else{
        buttonPlay.innerHTML = "Play";
        noLoop();
        lineChartDiv.noLoop();
    }
}

function keyPressed() {
    if (key === ' ') {
        playPause();
    }
}

function getNullNeighborSpace(x,y){
    let nullSpace = [];

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

function getNullSpace(x,y){
    function isNull(x1, y1){
        if(x1 >= 0 && y1 >= 0 && x1 < rowNum && y1 < columnNum)
            return !particles[x1][y1];
        return false;
    }

    let count = 0;
    while(count < 20){
        count ++;
        let dis = parseInt(count/6);
        let x1 = parseInt(random(dis*2+1)) - dis + x,
            y1 = parseInt(random(dis*2+1)) - dis + y;
        if(isNull(x1, y1)){
            return {
                "x": x1,
                "y": y1
            }
        }
    }
    return;
}

function findGrass(x,y){
    function isGrass(x1, y1){
        if(x1 >= 0 && y1 >= 0 && x1 < rowNum && y1 < columnNum)
            return (particles[x1][y1] && particles[x1][y1].type === "grass" && particles[x1][y1].status === HEALTHY);
        return false;
    }

    let count = 0;
    while(count < 18){
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
