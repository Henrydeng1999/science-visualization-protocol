// 双缝干涉：用两路光程差解释明暗条纹，并演示单光子累积

const SRC_X = 70;
const BARRIER_X = 220;
const SCREEN_X = 610;
const CENTER_Y = 250;
let photonHits = [];
let lastPhotonParams = '';

function setup() {
  const canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');

  select('#wavelength').input(updateLabels);
  select('#slit-distance').input(updateLabels);
  select('#screen-distance').input(updateLabels);
  select('#mode').changed(updateLabels);
  select('#show-waves').changed(updateLabels);
  updateLabels();
}

function updateLabels() {
  select('#wavelength-value').html(select('#wavelength').value() + ' px');
  select('#slit-distance-value').html(select('#slit-distance').value() + ' px');
  select('#screen-distance-value').html(select('#screen-distance').value() + ' px');
  const names = { continuous: '连续光', photon: '单光子累积' };
  select('#mode-value').html(names[select('#mode').value()]);
}

function draw() {
  background(12, 16, 28);

  const wavelength = parseFloat(select('#wavelength').value());
  const slitDistance = parseFloat(select('#slit-distance').value());
  const screenDistance = parseFloat(select('#screen-distance').value());
  const mode = select('#mode').value();
  const showWaves = select('#show-waves').elt.checked;
  const screenX = min(BARRIER_X + screenDistance, width - 76);
  const slitA = createVector(BARRIER_X, CENTER_Y - slitDistance / 2);
  const slitB = createVector(BARRIER_X, CENTER_Y + slitDistance / 2);

  drawSetup(slitA, slitB, screenX);
  if (showWaves) drawWavefronts(slitA, slitB, wavelength, screenX);

  if (mode === 'continuous') {
    photonHits = [];
    drawContinuousPattern(slitA, slitB, screenX, wavelength);
  } else {
    drawPhotonPattern(slitA, slitB, screenX, wavelength, slitDistance, screenDistance);
  }

  drawFormulaReadout(wavelength, slitDistance, screenDistance);
}

function drawSetup(slitA, slitB, screenX) {
  noStroke();
  fill(255, 230, 125);
  circle(SRC_X, CENTER_Y, 18);
  fill(170, 185, 210);
  textSize(12);
  textAlign(CENTER, TOP);
  text('光源', SRC_X, CENTER_Y + 18);

  stroke(255, 230, 125, 90);
  strokeWeight(2);
  line(SRC_X + 12, CENTER_Y, BARRIER_X, slitA.y);
  line(SRC_X + 12, CENTER_Y, BARRIER_X, slitB.y);

  stroke(130, 145, 170);
  strokeWeight(7);
  line(BARRIER_X, 60, BARRIER_X, slitA.y - 12);
  line(BARRIER_X, slitA.y + 12, BARRIER_X, slitB.y - 12);
  line(BARRIER_X, slitB.y + 12, BARRIER_X, height - 60);
  noStroke();
  fill(110, 230, 255);
  circle(slitA.x, slitA.y, 8);
  circle(slitB.x, slitB.y, 8);

  stroke(185, 195, 215);
  strokeWeight(3);
  line(screenX, 60, screenX, height - 60);
  noStroke();
  fill(170, 185, 210);
  text('双缝', BARRIER_X, height - 44);
  text('屏幕', screenX, height - 44);
  textAlign(LEFT, BASELINE);
}

function drawWavefronts(slitA, slitB, wavelength, screenX) {
  const phase = (frameCount * 1.4) % wavelength;
  noFill();
  strokeWeight(1);
  for (const slit of [slitA, slitB]) {
    for (let r = phase; r < screenX - slit.x + 110; r += wavelength) {
      const alpha = map(r, 0, 440, 115, 18, true);
      stroke(90, 190, 255, alpha);
      arc(slit.x, slit.y, r * 2, r * 2, -HALF_PI, HALF_PI);
    }
  }
}

function drawContinuousPattern(slitA, slitB, screenX, wavelength) {
  const top = 76;
  const bottom = height - 76;
  noStroke();
  for (let y = top; y <= bottom; y += 2) {
    const intensity = interferenceIntensity(slitA, slitB, screenX, y, wavelength);
    const bright = 28 + 227 * intensity;
    fill(bright, bright * 0.9, 80 + 130 * intensity);
    rect(screenX + 8, y, 44, 2);
  }
  drawIntensityCurve(slitA, slitB, screenX, wavelength, top, bottom);
}

function drawIntensityCurve(slitA, slitB, screenX, wavelength, top, bottom) {
  noFill();
  stroke(120, 245, 170);
  strokeWeight(2);
  beginShape();
  for (let y = top; y <= bottom; y += 3) {
    const intensity = interferenceIntensity(slitA, slitB, screenX, y, wavelength);
    vertex(screenX + 62 + intensity * 40, y);
  }
  endShape();
}

function drawPhotonPattern(slitA, slitB, screenX, wavelength, slitDistance, screenDistance) {
  const params = [wavelength, slitDistance, screenDistance].join('|');
  if (params !== lastPhotonParams) {
    photonHits = [];
    lastPhotonParams = params;
  }

  for (let i = 0; i < 8; i++) {
    photonHits.push(samplePhotonHit(slitA, slitB, screenX, wavelength));
  }
  if (photonHits.length > 1800) photonHits.splice(0, photonHits.length - 1800);

  noStroke();
  for (const hit of photonHits) {
    fill(255, 235, 125, hit.alpha);
    circle(screenX + random(12, 48), hit.y, 2.2);
  }

  fill(185, 200, 220);
  textSize(12);
  text('已累积光子：' + photonHits.length, 24, height - 18);
}

function samplePhotonHit(slitA, slitB, screenX, wavelength) {
  const top = 76;
  const bottom = height - 76;
  for (let tries = 0; tries < 80; tries++) {
    const y = random(top, bottom);
    const intensity = interferenceIntensity(slitA, slitB, screenX, y, wavelength);
    if (random() < intensity) return { y, alpha: random(80, 210) };
  }
  return { y: random(top, bottom), alpha: 60 };
}

function interferenceIntensity(slitA, slitB, screenX, y, wavelength) {
  const p = createVector(screenX, y);
  const r1 = p5.Vector.dist(p, slitA);
  const r2 = p5.Vector.dist(p, slitB);
  const delta = abs(r1 - r2);
  const phase = TWO_PI * delta / wavelength;
  const interference = pow(cos(phase / 2), 2);
  const envelope = exp(-pow((y - CENTER_Y) / 185, 2));
  return constrain(interference * envelope, 0, 1);
}

function drawFormulaReadout(wavelength, slitDistance, screenDistance) {
  const spacing = wavelength * screenDistance / slitDistance;
  noStroke();
  fill(220);
  textSize(13);
  text('条纹间距近似：Δy ≈ λL / d', 24, 26);
  fill(155, 170, 195);
  text('当前估计 Δy ≈ ' + spacing.toFixed(1) + ' px', 24, 46);
}
