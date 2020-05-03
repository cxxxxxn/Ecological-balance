class Fish {
    constructor(x, y) {
        this.type = "fish";

        this.x = x;
        this.y = y;

        this.growSpeed = random(0.005, 0.03);
        this.status = HEALTHY;//LIVE:1, DEAD:0
    }

    grow() {

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