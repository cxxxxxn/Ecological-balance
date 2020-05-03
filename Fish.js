class Fish {
    constructor(x, y) {
        this.type = "fish";

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
          fill(0, 0, 255);  // Blue
          break;
        }
        rect(this.x + padding, this.y + padding, particleWidth - 2 * padding, particleHeight - 2 * padding);
    }
  }