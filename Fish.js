class Fish {
    constructor(x, y) {
        this.type = "fish";

        this.x = x;
        this.y = y;

        this.status = HEALTHY;
        this.age = 0;

        this.eatSpeed = parseInt(random(2, 4));
        this.growSpeed = parseInt(random(10, 20));
        this.maxAge = parseInt(random(18, 36));
    }

    grow() {
        this.age++;
        if(this.age > this.maxAge + 1){//disappear
            particles[this.x][this.y] = undefined;
        }else if(this.age > this.maxAge){
            this.status = DEAD;
        }else{
            if((this.age % this.eatSpeed) === 0 || this.status === HUNGRY){
                this.eatGrass();
            }
            if((this.age % this.growSpeed) === 0 && this.status === HEALTHY){
                this.multiply();
            }
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
            if(this.status === HUNGRY){
                this.status = DEAD;
            }else if(this.status === HEALTHY){
                this.status = HUNGRY;
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
            switch (this.status) {
                case DEAD:
                    fill(200);  //gray
                    break;
                case HUNGRY:
                    fill(255, 0, 0);
                    break;
                case HEALTHY:
                    fill(0, 0, 255);  // Blue
                    break;
            }
            rect(this.x * particleWidth + padding, this.y * particleHeight + padding, particleWidth - 2 * padding, particleHeight - 2 * padding);
        }
    }
  }