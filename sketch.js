let totalFrames = 800;
let t;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  noStroke();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  t = frameCount / totalFrames;

  animarFusaoMetaball(t);
}

function animarFusaoMetaball(t) {
  // Fases da animação
  let t1 = constrain(map(t, 0.0, 0.25, 0, 1), 0, 1); // aproximação
  let t2 = constrain(map(t, 0.25, 0.4, 0, 1), 0, 1); // fusão líquida
  let t3 = constrain(map(t, 0.4, 0.5, 0, 1), 0, 1); // pulso
  let t4 = constrain(map(t, 0.5, 0.6, 0, 1), 0, 1); // partículas

  let cor = color('#2C6AAE');
  fill(cor);

  // 1. Aproximação com dois círculos
  if (t < 0.25) {
    let x1 = lerp(-100, -20, easeOutCubic(t1));
    let x2 = lerp(100, 20, easeOutCubic(t1));
    circle(x1, 0, 40);
    circle(x2, 0, 40);
  }

  // 2. Fusão estilo metaball
  else if (t < 0.4) {
    let offset = lerp(80, 0, easeOutCubic(t2));
    metaball(-offset / 2, 0, 40, offset / 2, 0, 40);
  }

  // 3. Pulso do círculo central
  else if (t < 0.5) {
    let r = 40 + sin(t3 * PI) * 10;
    circle(0, 0, r);
  }

  // 4. Explosão suave de partículas
  else if (t < 0.6) {
    let numParticles = 24;
    for (let i = 0; i < numParticles; i++) {
      let angle = TWO_PI * i / numParticles;
      let dist = easeOutCubic(t4) * 100;
      let x = cos(angle) * dist;
      let y = sin(angle) * dist;
      fill(255, map(t4, 0, 1, 255, 0));
      ellipse(x, y, 4, 4);
    }
  }
}

// Função metaball simples entre dois círculos
function metaball(x1, y1, r1, x2, y2, r2) {
  let d = dist(x1, y1, x2, y2);
  let maxDist = 100;
  let threshold = 0.5;

  // Desenha os dois círculos
  ellipse(x1, y1, r1 * 2);
  ellipse(x2, y2, r2 * 2);

  if (d < maxDist) {
    // Conecta os dois com uma forma fluida
    let midpoint = createVector((x1 + x2) / 2, (y1 + y2) / 2);
    beginShape();
    for (let a = 0; a < TWO_PI; a += PI / 60) {
      let vx = midpoint.x + cos(a) * (r1 + r2) / 2;
      let vy = midpoint.y + sin(a) * (r1 + r2) / 2;
      let alpha = map(d, 0, maxDist, 255, 0);
      fill(44, 106, 174, alpha);
      vertex(vx, vy);
    }
    endShape(CLOSE);
  }
}

// Easing para suavizar o movimento
function easeOutCubic(x) {
  return 1 - pow(1 - x, 3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
