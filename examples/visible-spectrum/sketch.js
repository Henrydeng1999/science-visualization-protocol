// 波长与颜色：可见光波长决定颜色，并连接频率与光子能量 E=hf

const C = 2.998e8;
const H = 6.626e-34;
const EV = 1.602e-19;

function setup() {
  const canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');

  select('#wavelength').input(updateLabels);
  updateLabels();
}

function updateLabels() {
  select('#wavelength-value').html(select('#wavelength').value() + ' nm');
}

function draw() {
  background(12, 16, 28);

  const wl = parseFloat(select('#wavelength').value());
  const lightColor = wavelengthToColor(wl);
  const freq = C / (wl * 1e-9);
  const energyEv = (H * freq) / EV;

  drawSpectrumBar(wl);
  drawColoredWave(wl, lightColor);
  drawPhotonMeter(wl, energyEv, lightColor);
  drawReadouts(wl, freq, energyEv);
}

function drawSpectrumBar(wl) {
  const x0 = 70;
  const y = 370;
  const w = 560;
  const h = 42;

  noStroke();
  for (let x = 0; x < w; x++) {
    const cur = map(x, 0, w, 380, 750);
    fill(wavelengthToColor(cur));
    rect(x0 + x, y, 1, h);
  }

  noFill();
  stroke(170, 180, 200);
  strokeWeight(1);
  rect(x0, y, w, h);

  const px = map(wl, 380, 750, x0, x0 + w);
  stroke(255);
  strokeWeight(2);
  line(px, y - 12, px, y + h + 12);
  noStroke();
  fill(235);
  textAlign(CENTER, TOP);
  textSize(12);
  text(wl.toFixed(0) + ' nm', px, y + h + 16);
  textAlign(LEFT, BASELINE);

  fill(160, 172, 195);
  textSize(12);
  text('380 nm 紫', x0, y + h + 16);
  textAlign(RIGHT, BASELINE);
  text('750 nm 红', x0 + w, y + h + 16);
  textAlign(LEFT, BASELINE);
}

function drawColoredWave(wl, c) {
  const left = 55;
  const right = width - 55;
  const midY = 190;
  const visualWavelength = map(wl, 380, 750, 62, 170);
  const phase = frameCount * map(wl, 380, 750, 0.11, 0.045);

  stroke(42, 53, 76);
  strokeWeight(1);
  for (let y = 82; y <= 300; y += 36) line(left, y, right, y);
  stroke(115, 132, 160);
  line(left, midY, right, midY);

  drawingContext.shadowBlur = 22;
  drawingContext.shadowColor = colorToCss(c, 0.8);
  noFill();
  stroke(c);
  strokeWeight(5);
  beginShape();
  for (let x = left; x <= right; x += 2) {
    const y = midY + 56 * sin(TWO_PI * (x - left) / visualWavelength - phase);
    vertex(x, y);
  }
  endShape();
  drawingContext.shadowBlur = 0;

  noStroke();
  fill(c);
  circle(width / 2, 68, 42);
  fill(230);
  textSize(15);
  textAlign(CENTER, CENTER);
  text(colorName(wl), width / 2, 118);
  textAlign(LEFT, BASELINE);
}

function drawPhotonMeter(wl, energyEv, c) {
  const x = 78;
  const y = 318;
  const w = 545;
  const p = map(wl, 750, 380, 0, 1);

  noStroke();
  fill(34, 42, 62);
  rect(x, y, w, 12, 6);
  fill(c);
  rect(x, y, w * p, 12, 6);
  fill(180, 195, 220);
  textSize(12);
  text('单个光子能量趋势 E = hf', x, y - 10);
  textAlign(RIGHT, BASELINE);
  text(energyEv.toFixed(2) + ' eV', x + w, y - 10);
  textAlign(LEFT, BASELINE);
}

function drawReadouts(wl, freq, energyEv) {
  noStroke();
  fill(220);
  textSize(13);
  const freqThz = freq / 1e12;
  text('波长 λ = ' + wl.toFixed(0) + ' nm', 34, height - 42);
  text('频率 f ≈ ' + freqThz.toFixed(0) + ' THz', 218, height - 42);
  text('光子能量 ≈ ' + energyEv.toFixed(2) + ' eV', 414, height - 42);
  fill(150, 165, 190);
  text('短波长 → 高频率 → 单个光子能量更高；长波长 → 低频率 → 单个光子能量更低。', 34, height - 18);
}

function wavelengthToColor(wl) {
  let r = 0, g = 0, b = 0;
  if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
  else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
  else if (wl < 510) { g = 1; b = -(wl - 510) / 20; }
  else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
  else if (wl < 645) { r = 1; g = -(wl - 645) / 65; }
  else if (wl <= 750) { r = 1; }

  let factor = 1;
  if (wl < 420) factor = 0.35 + 0.65 * (wl - 380) / 40;
  else if (wl > 700) factor = 0.35 + 0.65 * (750 - wl) / 50;
  return color(255 * r * factor, 255 * g * factor, 255 * b * factor);
}

function colorName(wl) {
  if (wl < 450) return '紫光';
  if (wl < 495) return '蓝光';
  if (wl < 570) return '绿光';
  if (wl < 590) return '黄光';
  if (wl < 620) return '橙光';
  return '红光';
}

function colorToCss(c, alpha) {
  return 'rgba(' + red(c) + ',' + green(c) + ',' + blue(c) + ',' + alpha + ')';
}

