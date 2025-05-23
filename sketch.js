let totalFrames = 1000;
let t = 0;

let cor1, cor2, verde;

function setup() {
  createCanvas(800, 800);
  frameRate(60);
  cor1 = color('#37827B');
  cor2 = color('#2C6AAE');
  verde = color('#37827B');
  noFill();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  t = frameCount / totalFrames;

  // Etapa 1: Linha vertical
  let linhaProgress = constrain(t * 5, 0, 1);
  let linhaAltura = lerp(0, 400, linhaProgress);
  let linhaCor = lerpColor(cor1, cor2, 0.5);
  stroke(linhaCor);
  strokeWeight(0.8);
  if (t < 0.5) {
    line(0, -linhaAltura / 2, 0, linhaAltura / 2);
  }

  push();

  let rot = 0;
  let pulse = 0;
  if (t > 0.6) {
    rot = (t - 0.6) / 0.4 * TWO_PI;
    pulse = sin((t - 0.6) / 0.4 * TWO_PI) * 10;
  }

  rotate(rot);

  let bolinhaX = [];
  let bolinhaY = [];

  for (let i = 0; i < 4; i++) {
    let appearT = 0.2 + i * 0.07;
    let progress = constrain((t - appearT) / 0.3, 0, 1);
    let r = lerp(0, 100 + i * 30, easeOutCubic(progress)) + pulse;

    let moveT = constrain((t - 0.7 - i * 0.05) / 0.2, 0, 1);
    let finalX = -90 + i * 60;
    let cx = lerp(cos(HALF_PI) * r, finalX, easeInOutCubic(moveT));
    let cy = lerp(sin(HALF_PI) * r, 0, easeInOutCubic(moveT));
    bolinhaX[i] = cx;
    bolinhaY[i] = cy;

    let bolinhaSize = lerp(0, 10, easeOutCubic(moveT));
    let circleAlpha = 255 * (1 - moveT);
    let c = lerpColor(cor1, cor2, map(i, 0, 3, 0, 1));

    let fadeStart = 0.92 + i * 0.01;
    let fadeEnd = fadeStart + 0.02;
    let fadeOutT = constrain((t - fadeStart) / (fadeEnd - fadeStart), 0, 1);
    let alpha = 255 * (1 - fadeOutT);

    if (moveT < 1) {
      stroke(c.levels[0], c.levels[1], c.levels[2], circleAlpha);
      strokeWeight(1.5);
      noFill();
      beginShape(POINTS);
      let steps = 100;
      for (let j = 0; j < steps; j++) {
        let angle = TWO_PI / steps * j;
        let x = cos(angle) * r;
        let y = sin(angle) * r;
        vertex(x, y);
      }
      endShape();
    }

    if (moveT > 0 && alpha > 0) {
      fill(c.levels[0], c.levels[1], c.levels[2], alpha);
      noStroke();
      ellipse(cx, cy, bolinhaSize, bolinhaSize);
    }
  }

  pop();

  for (let i = 0; i < 4; i++) {
    let delayT = 0.955 + i * 0.012;
    let elasT = constrain((t - delayT) / 0.08, 0, 1);
    elasT = easeOutCubic(elasT);

    if (elasT > 0) {
      let x0 = -90 + i * 60;
      let y0 = 0;
      let x1 = i % 2 == 0 ? -width / 2 + 100 : width / 2 - 100;
      let y1 = i < 2 ? -height / 2 + 100 : height / 2 - 100;

      let x = lerp(x0, x1, elasT);
      let y = lerp(y0, y1, elasT);
      let s = lerp(10, 160, elasT);

      if (i == 0) {
        let segments = 60;
        let angleGap = TWO_PI / segments;
        for (let j = 0; j < segments; j++) {
          if (j % 5 != 0) continue;
          let a1 = j * angleGap;
          let a2 = a1 + angleGap * 2;

          let x1seg = x + cos(a1) * s / 2;
          let y1seg = y + sin(a1) * s / 2;
          let x2seg = x + cos(a2) * s / 2;
          let y2seg = y + sin(a2) * s / 2;

          let inter = map(j, 0, segments, 0, 1);
          stroke(lerpColor(cor1, cor2, inter));
          strokeWeight(2);
          line(x1seg, y1seg, x2seg, y2seg);
        }
      } else {
        stroke(verde);
        strokeWeight(2);
        noFill();
        ellipse(x, y, s, s);
      }
    }
  }
}

function easeOutCubic(x) {
  return 1 - pow(1 - x, 3);
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}
