let totalFrames = 800; // Duração total da animação
let cor1, cor2;
let t;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  noFill();

  cor1 = color('#37827B'); // Cor dos círculos pequenos
  cor2 = color('#2C6AAE'); // Cor do círculo principal
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  t = frameCount / totalFrames;

  // Executa a animação do círculo Sell-side
  animarSellSide(t);
}

function animarSellSide(t) {
  // Fases da animação (valores entre 0 e 1)
  let t1 = constrain(map(t, 0.0, 0.2, 0, 1), 0, 1); // aproximação
  let t2 = constrain(map(t, 0.2, 0.3, 0, 1), 0, 1); // fusão e pulso
  let t3 = constrain(map(t, 0.3, 0.4, 0, 1), 0, 1); // explosão de partículas

  // 1. Círculos pequenos que se aproximam do centro
  if (t < 0.2) {
    let x1 = lerp(-150, 0, easeOutCubic(t1));
    let x2 = lerp(150, 0, easeOutCubic(t1));
    fill(cor1);
    noStroke();
    ellipse(x1, 0, 12, 12);
    ellipse(x2, 0, 12, 12);
  }

  // 2. Círculo principal com pulso no centro
  if (t >= 0.2 && t < 0.3) {
    let pulse = 20 + sin(t2 * PI) * 10;
    fill(cor2);
    noStroke();
    ellipse(0, 0, pulse, pulse);
  }

  // 3. Partículas suaves saindo do centro
  if (t >= 0.3 && t < 0.4) {
    let numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
      let angle = TWO_PI / numParticles * i;
      let r = easeOutCubic(t3) * 80;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      let alpha = map(t3, 0, 1, 255, 0);
      fill(255, alpha);
      noStroke();
      ellipse(x, y, 4, 4);
    }
  }
}

// Função de easing para suavizar movimento
function easeOutCubic(x) {
  return 1 - pow(1 - x, 3);
}

// Função opcional para transições mais complexas
function easeInOutCubic(x) {
  return x < 0.5
    ? 4 * x * x * x
    : 1 - pow(-2 * x + 2, 3) / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
