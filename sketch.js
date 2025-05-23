let state = 'intro';
let introTimer = 0;
let transitionTimer = 0;
let mainCircleSize = 60;
let circles = [];
let particles = [];
let separationProgress = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(RADIUS);
  noStroke();

  // 4 círculos ao redor do centro
  for (let i = 0; i < 4; i++) {
    let angle = map(i, 0, 4, 0, TWO_PI);
    let x = width / 2 + cos(angle) * 60;
    let y = height / 2 + sin(angle) * 60;
    circles.push({ x, y, radius: 6, alpha: 255 });
  }
}

function draw() {
  background(0);

  if (state === 'intro') {
    drawIntro();
    introTimer++;

    if (introTimer > 90) {
      for (let c of circles) c.alpha -= 4;
      if (circles[0].alpha <= 0) {
        state = 'sellside';
        transitionTimer = 0;
      }
    }
  } else if (state === 'sellside') {
    drawSellSide();
  }
}

function drawIntro() {
  stroke(255);
  strokeWeight(2);
  line(width / 2, height / 2 - 80, width / 2, height / 2 + 80);
  noStroke();
  for (let c of circles) {
    fill(255, c.alpha);
    ellipse(c.x, c.y, c.radius);
  }
}

function drawSellSide() {
  transitionTimer++;
  let maxOffset = 150;
  let offset = easeOutQuad(min(1, transitionTimer / 120)) * maxOffset;

  let leftX = width / 2 - offset;
  let rightX = width / 2 + offset;
  let y = height / 2;

  // Efeito de bolha fluido entre os dois círculos
  for (let i = -mainCircleSize; i <= mainCircleSize; i += 6) {
    let inter = map(i, -mainCircleSize, mainCircleSize, 0, 1);
    let x = lerp(leftX, rightX, 0.5) + sin(frameCount * 0.08 + i * 0.1) * 4;
    let yOff = y + i;
    fill(255, 30);
    ellipse(x, yOff, 2, 2);
  }

  // Os dois círculos principais
  fill(255, 180);
  ellipse(leftX, y, mainCircleSize);
  ellipse(rightX, y, mainCircleSize);
}

function easeOutQuad(t) {
  return t * (2 - t);
}

