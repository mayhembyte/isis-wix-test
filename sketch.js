let state = 'intro';
let introTimer = 0;
let transitionTimer = 0;
let mainCircleSize = 60;
let circles = [];
let particles = [];
let maxOffset = 150;
let hasExploded = false;

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
    updateParticles();
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
  let offset = easeOutQuad(min(1, transitionTimer / 120)) * maxOffset;

  let leftX = width / 2 - offset;
  let rightX = width / 2 + offset;
  let y = height / 2;

  // Efeito fluido entre os dois círculos
  for (let i = -mainCircleSize; i <= mainCircleSize; i += 6) {
    let inter = map(i, -mainCircleSize, mainCircleSize, 0, 1);
    let x = lerp(leftX, rightX, 0.5) + sin(frameCount * 0.08 + i * 0.1) * 4;
    let yOff = y + i;
    fill(255, 30);
    ellipse(x, yOff, 2, 2);
  }

  // Círculos principais
  fill(255, 180);
  ellipse(leftX, y, mainCircleSize);
  ellipse(rightX, y, mainCircleSize);

  // Iniciar partículas quando a separação estiver completa
  if (offset >= maxOffset && !hasExploded) {
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle(width / 2, height / 2));
    }
    hasExploded = true;
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    let angle = random(TWO_PI);
    let speed = random(1, 3);
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    this.alpha = 255;
    this.r = random(1.5, 3.5);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98); // atrito
    this.alpha -= 3;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.pos.x, this.pos.y, this.r);
  }
}

function easeOutQuad(t) {
  return t * (2 - t);
}


