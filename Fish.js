class Fish {
    constructor(x, y) {
        this.type = "fish";

        this.x = x;
        this.y = y;

        this.status = HEALTHY;
        this.age = 0;

        this.eatSpeed = parseInt(random(3, 5));
        this.growSpeed = parseInt(random(10, 20));
        this.maxAge = parseInt(random(20, 60));
    }

    grow() {
        this.age++;
        if(this.status === DEAD || this.status === ELECTRIC){//disappear
            particles[this.x][this.y] = undefined;
        }else if(this.age > this.maxAge){
            this.status = DEAD;
        }else if(this.age > 0){
            if((this.age % this.eatSpeed) === 0 || this.status === HUNGRY){
                this.eatGrass();
            }else if((this.age % this.growSpeed) === 0 && this.status === HEALTHY){
                this.multiply();
            }else if(this.age > 1){
                this.swim();
            }
        }
    }

    swim(){
        let newPos = getNullNeighborSpace(this.x, this.y);
        if(newPos){
            particles[this.x][this.y] = undefined;
            particles[newPos.x][newPos.y] = this;
            this.x = newPos.x;
            this.y = newPos.y;
        }
    }

    eatGrass(){
        let grass = findGrass(this.x, this.y);
        if(grass){
            particles[this.x][this.y] = undefined;
            particles[grass.x][grass.y] = this;
            this.x = grass.x;
            this.y = grass.y;
            this.status = HEALTHY;
        }else{
            if(this.status === HUNGRY && (this.age % this.eatSpeed) === 0){
                this.status = DEAD;
            }else if(this.status === HEALTHY){
                this.status = HUNGRY;
            }else{
                this.swim();
            }
        }
    }

    multiply(){
        let newPos = getNullSpace(this.x, this.y);
        if(newPos)
            particles[newPos.x][newPos.y] = new Fish(newPos.x, newPos.y);
    }
  
    plot() {
        if(this.age > 0){
            image(imgFish[this.status], this.x * particleWidth + padding, this.y * particleHeight + padding, particleWidth - 2 * padding, particleHeight - 2 * padding);
        }
    }
  }