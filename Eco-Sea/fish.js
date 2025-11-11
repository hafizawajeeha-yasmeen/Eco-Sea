class OceanElement {
  constructor(type = "fish", x = random(width), y = random(height)) {
    //random posiion vector with vel ,acc and other variable for each fish
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D(); //random vector 0-1
    this.vel.setMag(random(2, 5));
    this.acc = createVector(); //0 vector
    //every fish will try to follow another fishes thare in this range
    this.findRange = 100;
    this.maxForce = 0.7;
    this.maxSpeed = random(2, 4);
    this.angle = 0;
    this.type = type;
    this.col1 = [random(150,255),random(150,255),random(150,255)];
    this.col2 = [random(100),random(100),random(100)];
    //if this is a trash we need to pick a random image for it
    if(this.type=="trash"){
      this.trashImg = trashImgs[floor(random(3))];
    }
  }

  //we need a function that draws fish using position vector
  show() {
    if (this.type == "fish") {
      push();
      translate(this.pos.x, this.pos.y); //translate origing to fish's location
      rotate(atan2(this.vel.y, this.vel.x)+PI/2); //add rotation as fish's vector
      fill(this.col1);
      stroke(this.col1);
      ellipse(0, 0, 10,15);
      line(0,0,0,20);
      
      fill(this.col2);
      stroke(this.col2);
      line(8,-3,8,0);
      line(-8,-3,-8,0);
      
      triangle(0,15,5,25,-5,25);
      strokeWeight(2);
      point(-3,-6);
      point(3,-6);
      
      pop();
    } else {
      push();
      translate(this.pos.x, this.pos.y); //translate origing to fish's location
      rotate(atan2(this.vel.y, this.vel.x)); //add rotation as fish's vector
      image(this.trashImg,0,0,40,40);
      pop();
    }
  }
  //update fish's vector
  update() {
    if (this.type == "fish") {
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
    }

    //I want a fish to re-appear in the left if it leaves in via right
    let margin = 100;
    if (this.pos.x > width + margin) {
      this.pos.x = -margin;
    }
    if (this.pos.x < -margin) {
      this.pos.x = width + margin;
    }
    if (this.pos.y > height + margin) {
      this.pos.y = -margin;
    }
    if (this.pos.y < -margin) {
      this.pos.y = height + margin;
    }
  }
  flock(nearByFishes) {
    this.acc.set(0, 0);
    let alignment = this.goToNearbyFishes(nearByFishes);
    let cohesion = this.cohesion(nearByFishes);
    let seperation = this.seperation(nearByFishes);

    if (this.type == "fish") {
      this.acc.add(seperation);
      this.acc.add(alignment);
      this.acc.add(cohesion);
    }
  }

  //fish uses this function to find nearby fish to go to
  goToNearbyFishes(nearByFishes) {
    let fishVelocities = createVector();
    let goingForce = createVector();
    let nearbyFishCount = 0;
    for (let i = 0; i < nearByFishes.length; i++) {
      //
      let nearbyFishDistance = dist(
        nearByFishes[i].pos.x,
        nearByFishes[i].pos.y,
        this.pos.x,
        this.pos.y
      );
      if (nearByFishes[i] != this && nearbyFishDistance < this.findRange) {
        fishVelocities.add(nearByFishes[i].vel);
        nearbyFishCount++;
      }
    }
    if (nearbyFishCount > 0) {
      fishVelocities.div(nearbyFishCount);
      fishVelocities.setMag(this.maxSpeed);
      goingForce = fishVelocities.sub(this.vel).limit(this.maxForce);
    }
    return goingForce;
  }

  //fish uses this function to find nearby fish and go to their combined center
  cohesion(nearByFishes) {
    let fishPositions = createVector();
    let goingForce = createVector();
    let nearbyFishCount = 0;
    for (let i = 0; i < nearByFishes.length; i++) {
      //
      let nearbyFishDistance = dist(
        nearByFishes[i].pos.x,
        nearByFishes[i].pos.y,
        this.pos.x,
        this.pos.y
      );
      if (nearByFishes[i] != this && nearbyFishDistance < this.findRange) {
        fishPositions.add(nearByFishes[i].pos);
        nearbyFishCount++;
      }
    }
    if (nearbyFishCount > 0) {
      fishPositions.div(nearbyFishCount);
      fishPositions.sub(this.pos);
      fishPositions.setMag(this.maxSpeed);
      goingForce = fishPositions.sub(this.vel).limit(this.maxForce);
    }
    return goingForce;
  }
  //fish uses this function to find nearby fish and avoid crashing into it
  seperation(nearByFishes) {
    let fishPositions = createVector();
    let goingForce = createVector();
    let nearbyFishCount = 0;
    for (let i = 0; i < nearByFishes.length; i++) {
      //
      let nearbyFishDistance = dist(
        nearByFishes[i].pos.x,
        nearByFishes[i].pos.y,
        this.pos.x,
        this.pos.y
      );
      if (nearByFishes[i] != this && nearbyFishDistance < this.findRange) {
        let diff = p5.Vector.sub(this.pos, nearByFishes[i].pos);
        if (diff.div(nearbyFishDistance)) {
          diff.div(nearbyFishDistance);
          fishPositions.add(diff);
          nearbyFishCount++;
        }
      }
    }
    if (nearbyFishCount > 0) {
      fishPositions.div(nearbyFishCount);
      fishPositions.setMag(this.maxSpeed);
      goingForce = fishPositions.sub(this.vel).limit(this.maxForce);
    }
    return goingForce;
  }
}
