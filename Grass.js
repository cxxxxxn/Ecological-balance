class Grass {
    constructor(x, y) {
        this.type = "grass";

        this.x = x;
        this.y = y;

        this.growSpeed = random(0.005, 0.03);
        this.status = HEALTHY;
        this.age = 0;
    }

    grow() {
        this.age++;
        if(this.age > 18){//disappear
            particles[this.x][this.y] = undefined;
        }else if(this.age > 15){
            this.status = DEAD;
        }else if((this.age % 4) === 0){
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
            switch (this.status) {
                case DEAD: 
                    fill(200);  //gray
                    break;
                case HEALTHY:
                    fill(102, 205, 0);  // Green
                    break;
            }
                
            ellipse(this.x * particleWidth + padding, this.y * particleHeight + padding, particleWidth - 2 * padding, particleHeight - 2 * padding);
        }
    }
  }