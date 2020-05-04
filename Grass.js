class Grass {
    constructor(x, y) {
        this.type = "grass";

        this.x = x;
        this.y = y;

        this.status = HEALTHY;
        this.age = 0;

        this.growSpeed = parseInt(random(3, 5));
        this.maxAge = parseInt(random(20, 30));
    }

    grow() {
        this.age++;
        if(this.status === DEAD){//disappear
            particles[this.x][this.y] = undefined;
        }else if(this.age > this.maxAge){
            this.status = DEAD;
        }else if((this.age % this.growSpeed) === 0){
            this.multiply();
        }
    }

    multiply(){
        let newPos = getNullSpace(this.x, this.y);
        if(newPos)
            particles[newPos.x][newPos.y] = new Grass(newPos.x, newPos.y);
    }
  
    plot() {
        if(this.age > 0){
            image(imgGrass[this.status], this.x * particleWidth + padding, this.y * particleHeight + padding, particleWidth - 2 * padding, particleHeight - 2 * padding);
        }
    }
  }