class Fish {
    constructor(x, y) {
        this.type = "fish";

        this.x = x;
        this.y = y;

        this.status = HEALTHY;
        this.age = 0;

        this.eatSpeed = parseInt(random(5));
        this.growSpeed = parseInt(random(5,10));
        this.maxAge = parseInt(random(14,30));
    }

    grow() {
        this.age++;
        if(this.age > 3 * this.maxAge){//disappear
            particles[this.x][this.y] = undefined;
        }else if(this.age > this.maxAge){
            this.status = DEAD;
        }else{
            if((this.age % this.eatSpeed) === 0){
                this.eatGrass();
            }
            if((this.age % this.growSpeed) === 0){
                this.multiply();
            }
        }
    }

    eatGrass(){
        
    }

    multiply(){

    }
  
    plot() {
      switch (this.status) {
        case DEAD:
          fill(200);  //gray
          break;
        case HEALTHY:
          fill(0, 0, 255);  // Blue
          break;
        }
        rect(this.x * particleWidth + padding, this.y * particleHeight + padding, particleWidth - 2 * padding, particleHeight - 2 * padding);
    }
  }