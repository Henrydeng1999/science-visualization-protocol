// 放射性衰变：随机粒子消失 + 实时观测曲线

let sample = [];
let history = [];
let startFrame = 0;
let lastAtoms = 0;
let lastHalfLife = 0;
let allGoneFrame = null;
let windowMaxT = 10;

function readParams() {
  return {
    halfLife: parseFloat(select('#halfLife').value()),
    atoms: parseInt(select('#atoms').value(), 10)
  };
}

function setupControls() {
  select('#halfLife').input(resetExperiment);
  select('#atoms').input(resetExperiment);
  select('#restart').mousePressed(resetExperiment);
}

function updateLabels() {
  select('#halfLife-value').html(select('#halfLife').value() + ' s');
  select('#atoms-value').html(select('#atoms').value() + ' 个');
}

function setup() {
  const canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');
  setupControls();
  resetExperiment();
}

function resetExperiment() {
  updateLabels();
  const p = readParams();
  lastAtoms = p.atoms;
  lastHalfLife = p.halfLife;
  startFrame = frameCount;
  allGoneFrame = null;
  history = [];
  sample = [];

  const lambda = log(2) / p.halfLife;
  for (let i = 0; i < p.atoms; i++) {
    const u = max(random(), 0.000001);
    sample.push({
      x: random(78, 316),
      y: random(118, 382),
      r: random(4.5, 7.5),
      decayTime: -log(u) / lambda,
      phase: random(TWO_PI)
    });
  }

  const lastDecay = sample.reduce((m, particle) => max(m, particle.decayTime), 0);
  windowMaxT = max(10, p.halfLife * 4, lastDecay + 1.2);
}

function draw() {
  const p = readParams();
  if (p.atoms !== lastAtoms || p.halfLife !== lastHalfLife) resetExperiment();

  background(12, 16, 28);
  drawFrame();

  const elapsed = (frameCount - startFrame) / 30;
  const maxT = windowMaxT;
  const alive = sample.filter((particle) => particle.decayTime > elapsed);
  const expected = p.atoms * pow(0.5, elapsed / p.halfLife);

  const fadeDone = sample.every((particle) => elapsed - particle.decayTime >= 1.2);
  if (fadeDone && allGoneFrame === null) {
    allGoneFrame = frameCount;
  }
  if (allGoneFrame !== null && (frameCount - allGoneFrame) / 30 >= 5) {
    resetExperiment();
    return;
  }

  if (frameCount % 2 === 0 && elapsed <= maxT) {
    history.push({ t: elapsed, n: alive.length, expected });
  }

  drawParticlePanel(alive, sample, elapsed, p);
  drawCurvePanel(history, p, elapsed);
  drawReadout(alive.length, expected, elapsed, p);
}

function drawFrame() {
  noStroke();
  fill(230);
  textSize(17);
  text('放射性衰变', 24, 30);
  fill(150, 165, 190);
  textSize(12);
  text('随机过程：每个粒子独立衰变，整体数量服从指数下降趋势', 24, 50);
}

function drawPanel(x, y, w, h, title) {
  noStroke();
  fill(18, 25, 40, 240);
  rect(x, y, w, h, 8);
  stroke(48, 64, 90);
  strokeWeight(1);
  rect(x, y, w, h, 8);
  noStroke();
  fill(220);
  textSize(14);
  text(title, x + 14, y + 24);
}

function drawParticlePanel(alive, allParticles, elapsed, p) {
  const x = 48, y = 78, w = 300, h = 340;
  drawPanel(x, y, w, h, '粒子样本');

  noStroke();
  fill(34, 47, 66);
  rect(x + 18, y + 44, w - 36, h - 72, 6);

  for (const particle of allParticles) {
    if (particle.decayTime <= elapsed) {
      const fade = constrain(1 - (elapsed - particle.decayTime) / 1.2, 0, 1);
      if (fade <= 0) continue;
      fill(255, 125, 110, 90 * fade);
      circle(particle.x, particle.y, particle.r * 2.7);
      continue;
    }
    const pulse = 1 + 0.12 * sin(frameCount * 0.08 + particle.phase);
    fill(120, 235, 170, 220);
    circle(particle.x, particle.y, particle.r * 2 * pulse);
    fill(205, 255, 220, 180);
    circle(particle.x - particle.r * 0.35, particle.y - particle.r * 0.35, particle.r * 0.55);
  }

  fill(150, 165, 190);
  textSize(12);
  text('绿色：尚未衰变    红色闪烁：刚刚衰变', x + 20, y + h - 22);
}

function drawCurvePanel(history, p, elapsed) {
  const x = 380, y = 78, w = 270, h = 340;
  const gx = x + 42, gy = y + h - 48, gw = w - 66, gh = h - 92;
  const maxT = windowMaxT;
  drawPanel(x, y, w, h, '实时衰变曲线');

  stroke(64, 82, 110);
  strokeWeight(1);
  for (let i = 0; i <= 4; i++) {
    const yy = gy - gh * i / 4;
    line(gx, yy, gx + gw, yy);
  }
  for (let i = 0; i <= 4; i++) {
    const xx = gx + gw * i / 4;
    line(xx, gy, xx, gy - gh);
  }

  stroke(130, 150, 178);
  strokeWeight(2);
  line(gx, gy, gx + gw, gy);
  line(gx, gy, gx, gy - gh);
  noStroke();
  fill(150, 165, 190);
  textSize(11);
  text('N', gx - 22, gy - gh + 8);
  text('t', gx + gw + 10, gy + 4);

  drawExpectedCurve(gx, gy, gw, gh, maxT, p);

  noFill();
  stroke(255, 215, 100);
  strokeWeight(3);
  beginShape();
  for (const point of history) {
    if (point.t > maxT) continue;
    const px = gx + constrain(point.t / maxT, 0, 1) * gw;
    const py = gy - constrain(point.n / p.atoms, 0, 1) * gh;
    vertex(px, py);
  }
  endShape();

  const newest = history[history.length - 1];
  if (newest) {
    const px = gx + constrain(newest.t / maxT, 0, 1) * gw;
    const py = gy - constrain(newest.n / p.atoms, 0, 1) * gh;
    noStroke();
    fill(255, 215, 100);
    circle(px, py, 7);
  }

  fill(120, 210, 255);
  rect(gx + 8, y + 44, 16, 3);
  fill(255, 215, 100);
  rect(gx + 8, y + 63, 16, 3);
  fill(170, 185, 205);
  textSize(11);
  text('理论期望', gx + 30, y + 48);
  text('随机样本', gx + 30, y + 67);
  text('显示窗口：0-' + maxT.toFixed(0) + ' s', gx, y + h - 20);
}

function drawExpectedCurve(gx, gy, gw, gh, maxT, p) {
  noFill();
  stroke(120, 210, 255, 160);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i <= 160; i++) {
    const t = maxT * i / 160;
    const n = pow(0.5, t / p.halfLife);
    vertex(gx + gw * i / 160, gy - n * gh);
  }
  endShape();
}

function drawReadout(alive, expected, elapsed, p) {
  noStroke();
  fill(220);
  textSize(13);
  text('当前时间 t = ' + elapsed.toFixed(1) + ' s', 48, 454);
  text('剩余粒子：' + alive + ' / ' + p.atoms, 220, 454);
  text('理论期望：' + expected.toFixed(1), 392, 454);
  fill(150, 165, 190);
  text('每个粒子的衰变时刻随机生成；总体趋势才接近 N = N₀·(1/2)^(t/T₁/₂)。', 48, 478);
}
