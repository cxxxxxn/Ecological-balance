class Grass {
    constructor(x, y) {
        this.type = "grass";
        
        this.x = x;
        this.y = y;

        this.growSpeed = random(0.005, 0.03);
        this.status = 1;//LIVE:1, DEAD:0
    }
  
    plot() {
      switch (this.status) {
        case 0: //DEAD
            fill(200);  //gray
            break;
        case 1: //LIVE
            fill(102, 205, 0);  // Green
            break;
        }
        
        ellipse(this.x + padding, this.y + padding, particleWidth - 2 * padding, particleHeight - 2 * padding);
    }
  }