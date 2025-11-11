let fishes = [];
let trashImgs = [];
let fishNumber = 10;
let trashNumber = 0;
let backgroundSound;
let fishSound;
let trashSound;

function preload() {
  backgroundSound = loadSound('sounds/fish-background.mp3');
  fishSound = loadSound('sounds/trash.mp3');
  trashSound = loadSound('sounds/trash.mp3');

  trashImgs[0] = loadImage("images/bagTrash.png");
  trashImgs[1] = loadImage("images/bottleTrash.png");
  trashImgs[2] = loadImage("images/canTrash.png");
}

function setup() {
  
  canvas = createCanvas(600, 400);
  noFill();
  stroke(280);
  strokeWeight(4);
 
  for (let i = 0; i < fishNumber; i++) {
    fishes.push(new OceanElement("fish"));
  }
  for (let i = 0; i < trashNumber; i++) {
    fishes.push(new OceanElement("trash"));
  }
  frameRate(30);
  pixelDensity(1);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  backgroundSound.loop();
  console.log("Press f key to add fish and t key for trash");
  console.log("or press on their icons on canvas");
  console.log("adding a fish removes a trash if any");
  console.log("adding a trash removes a fish if any");
}

function draw() {
  background(0, 88, 155);
  // background(12, 200, 400);
  rect(0, 0, width, height);
  let fishCount = 0;
  let trashCount = 0;

  for (let i = 0; i < fishes.length; i++) {
    fishes[i].show();
    fishes[i].flock(fishes);
    fishes[i].update();
    if (fishes[i].type == "fish") {
      fishCount += 1;
    } else {
      trashCount += 1;
    }
  }

  fishNumber = fishCount;
  trashNumber = trashCount;

  if (mouseX > 525 && mouseX < 575 && mouseY > 335 && mouseY < 385) {
    image(trashImgs[0], 550, 360, 60, 60);
    if (mouseIsPressed) {
      mouseIsPressed = false;
      trashSound.play();
      for (let i = 0; i < fishes.length; i++) {
        if (fishes[i].type == "fish") {
          fishes.splice(i, 1);
          break;
        }
      }
      fishes.push(new OceanElement("trash"));
    }
  } else {
    image(trashImgs[0], 550, 360, 50, 50);
  }

  push();
  translate(50, 360);

  if (mouseX > 25 && mouseX < 75 && mouseY > 335 && mouseY < 385) {
    scale(1.2);
    if (mouseIsPressed) {
      mouseIsPressed = false;
      fishSound.play();
      for (let i = 0; i < fishes.length; i++) {
        if (fishes[i].type == "trash") {
          fishes.splice(i, 1);
          break;
        }
      }
      fishes.push(new OceanElement("fish"));
    }
  }

  rotate(PI / 2);
  fill(255);
  stroke(255);
  ellipse(0, 0, 10, 15);
  line(0, 0, 0, 20);

  fill(0);
  stroke(0);
  line(8, -3, 8, 0);
  line(-8, -3, -8, 0);

  triangle(0, 15, 5, 25, -5, 25);
  strokeWeight(2);
  point(-3, -6);
  point(3, -6);
  pop();

  stroke(255);
  noStroke();
  fill(255);
  text(fishCount, 50, 390);
  text(trashCount, 555, 390);

  fill(19, 125, 80, 180);
  rect(80, 350, map(fishCount, 0, fishes.length, 0, 430), 20);
  noFill();
  stroke(255);
  rect(80, 350, 430, 20);
}

function keyPressed() {
  if (key == "f" || key == "F") {
    fishSound.play();
    for (let i = 0; i < fishes.length; i++) {
      if (fishes[i].type == "trash") {
        fishes.splice(i, 1);
        break;
      }
    }
    fishes.push(new OceanElement("fish", mouseX, mouseY));
  }
  if (key == "t" || key == "T") {
    trashSound.play();
    for (let i = 0; i < fishes.length; i++) {
      if (fishes[i].type == "fish") {
        fishes.splice(i, 1);
        break;
      }
    }
    fishes.push(new OceanElement("trash", mouseX, mouseY));
  }
}
