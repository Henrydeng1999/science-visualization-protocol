function readParams() {
  return {
    sourceMass: parseFloat(select('#sourceMass').value()),
    depth: parseFloat(select('#depth').value()),
    baseline: parseFloat(select('#baseline').value()),
    scan: parseFloat(select('#scan').value())
  };
}

function setupControls() {
  ['sourceMass', 'depth', 'baseline', 'scan'].forEach((id) => select('#' + id).input(updateLabels));
}

function updateLabels() {
  select('#sourceMass-value').html(select('#sourceMass').value());
  select('#depth-value').html(select('#depth').value() + ' m');
  select('#baseline-value').html(select('#baseline').value() + ' m');
  select('#scan-value').html(select('#scan').value() + ' m');
}

function setup() {
  const canvas = createCanvas(720, 510);
  canvas.parent('canvas-container');
  setupControls();
  updateLabels();
}

function draw() {
  const p = readParams();
  background(10, 14, 26);
  drawFrame();
  drawScene(p);
}

function drawFrame() {
  noStroke();
  fill(230);
  textSize(17);
  text('量子重力梯度仪原理', 24, 30);
  fill(150, 165, 190);
  textSize(12);
  text('同一台仪器内的两团冷原子差分测量：Γ ≈ (g₂ - g₁) / L', 24, 50);
  stroke(38, 50, 72);
  strokeWeight(1);
  for (let x = 40; x < 680; x += 40) line(x, 80, x, 440);
  for (let y = 80; y < 440; y += 36) line(40, y, 680, y);
}

function drawScene(p) {
  const groundY = 285;
  const centerX = 360;
  const source = createVector(centerX, groundY + p.depth * 1.05);
  const scanX = centerX + p.scan;
  const instrumentCenterY = groundY - 108;
  const visualBaseline = map(p.baseline, 20, 220, 28, 118);
  const upper = createVector(scanX, instrumentCenterY - visualBaseline * 0.5);
  const lower = createVector(scanX, instrumentCenterY + visualBaseline * 0.5);
  const gUpper = gravityVector(upper, source, p.sourceMass);
  const gLower = gravityVector(lower, source, p.sourceMass);
  const delta = gLower.mag() - gUpper.mag();
  const gradient = delta / max(p.baseline, 1);

  drawGround(groundY);
  drawSource(source, p.sourceMass);
  drawInstrument(scanX, instrumentCenterY, visualBaseline, upper, lower, gUpper, gLower, delta);
  drawSignalPanel(p, groundY, centerX);
  drawReadout(delta, gradient, p.baseline);
}

function gravityVector(pos, source, mass) {
  const dx = source.x - pos.x;
  const dy = source.y - pos.y;
  const r2 = dx * dx + dy * dy + 650;
  const strength = mass * 42000 / r2;
  const dir = createVector(dx, dy).normalize();
  return dir.mult(strength);
}

function drawGround(groundY) {
  stroke(95, 125, 110);
  strokeWeight(2);
  line(50, groundY, 670, groundY);
  noStroke();
  fill(28, 46, 40, 190);
  rect(50, groundY, 620, 155);
  fill(95, 125, 110);
  textSize(12);
  text('地表测线', 58, groundY - 10);
}

function drawSource(source, mass) {
  const r = map(mass, 20, 500, 18, 64);
  noStroke();
  for (let i = 4; i >= 1; i--) {
    fill(255, 175, 80, 22);
    circle(source.x, source.y, r * i);
  }
  fill(255, 190, 95);
  circle(source.x, source.y, r);
  fill(40, 24, 12);
  textAlign(CENTER, CENTER);
  textSize(12);
  text('高密度体', source.x, source.y);
  textAlign(LEFT, BASELINE);
}

function drawInstrument(scanX, centerY, visualBaseline, upper, lower, gUpper, gLower, delta) {
  const boxW = 124;
  const boxH = max(132, visualBaseline + 58);
  const boxX = scanX - boxW / 2;
  const boxY = centerY - boxH / 2;

  noStroke();
  fill(18, 28, 44, 235);
  rect(boxX, boxY, boxW, boxH, 8);
  stroke(78, 112, 150);
  strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 8);
  noStroke();
  fill(185, 205, 225);
  textSize(12);
  textAlign(CENTER, BASELINE);
  text('地表量子梯度仪', scanX, boxY - 8);
  textAlign(LEFT, BASELINE);

  stroke(190, 205, 220);
  strokeWeight(3);
  line(upper.x, upper.y, lower.x, lower.y);
  stroke(80, 105, 130);
  strokeWeight(1);
  line(boxX + 12, upper.y, boxX + boxW - 12, upper.y);
  line(boxX + 12, lower.y, boxX + boxW - 12, lower.y);
  noStroke();
  fill(120, 200, 255);
  circle(upper.x, upper.y, 24);
  fill(135, 235, 170);
  circle(lower.x, lower.y, 24);
  fill(225);
  textSize(12);
  text('上原子云', upper.x + 18, upper.y + 4);
  text('下原子云', lower.x + 18, lower.y + 4);

  const arrowScale = 8.5;
  drawArrow(upper.x, upper.y, upper.x + gUpper.x * arrowScale, upper.y + gUpper.y * arrowScale, color(120, 200, 255));
  drawArrow(lower.x, lower.y, lower.x + gLower.x * arrowScale, lower.y + gLower.y * arrowScale, color(135, 235, 170));

  const pulse = 1 + 0.12 * sin(frameCount * 0.08);
  noFill();
  stroke(delta > 0 ? color(255, 215, 100) : color(160, 170, 190));
  strokeWeight(2);
  circle(lower.x, lower.y, constrain(abs(delta) * 90 * pulse, 12, 82));
}

function drawSignalPanel(p, groundY, centerX) {
  const panelX = 505;
  const panelY = 92;
  const panelW = 165;
  const panelH = 140;
  const points = [];
  let maxSignal = 0;
  const referenceSignal = estimatePeakSignal(500, 25, 220, groundY, centerX);

  for (let i = 0; i <= 120; i++) {
    const scan = map(i, 0, 120, -230, 230);
    const source = createVector(centerX, groundY + p.depth * 1.05);
    const x = centerX + scan;
    const instrumentCenterY = groundY - 108;
    const visualBaseline = map(p.baseline, 20, 220, 28, 118);
    const upper = createVector(x, instrumentCenterY - visualBaseline * 0.5);
    const lower = createVector(x, instrumentCenterY + visualBaseline * 0.5);
    const d = gravityVector(lower, source, p.sourceMass).mag() - gravityVector(upper, source, p.sourceMass).mag();
    points.push(d);
    maxSignal = max(maxSignal, abs(d));
  }

  noStroke();
  fill(18, 25, 38, 235);
  rect(panelX, panelY, panelW, panelH, 8);
  fill(210);
  textSize(13);
  text('沿测线的梯度信号', panelX + 14, panelY + 22);
  stroke(68, 82, 105);
  line(panelX + 18, panelY + 108, panelX + panelW - 14, panelY + 108);
  line(panelX + panelW / 2, panelY + 42, panelX + panelW / 2, panelY + 120);

  noFill();
  stroke(255, 215, 100);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < points.length; i++) {
    const normalized = displaySignal(points[i], referenceSignal);
    vertex(panelX + 22 + i, panelY + 108 - normalized * 52);
  }
  endShape();

  const currentIndex = constrain(round(map(p.scan, -230, 230, 0, 120)), 0, points.length - 1);
  const markerX = panelX + 22 + map(p.scan, -230, 230, 0, 120);
  stroke(120, 200, 255);
  line(markerX, panelY + 42, markerX, panelY + 120);
  noStroke();
  fill(120, 200, 255);
  circle(markerX, panelY + 108 - displaySignal(points[currentIndex], referenceSignal) * 52, 6);
  fill(150, 165, 190);
  textSize(11);
  text('固定参考尺度', panelX + 82, panelY + 128);

  noStroke();
  fill(80, 95, 120);
  rect(panelX + 18, panelY + 126, 58, 5, 3);
  fill(255, 215, 100);
  rect(panelX + 18, panelY + 126, constrain(displaySignal(maxSignal, referenceSignal) * 58, 2, 58), 5, 3);
}

function displaySignal(value, referenceSignal) {
  const signValue = value < 0 ? -1 : 1;
  const ratio = constrain(abs(value) / max(referenceSignal, 0.0001), 0, 1);
  return signValue * sqrt(ratio);
}

function estimatePeakSignal(mass, depth, baseline, groundY, centerX) {
  let peak = 0;
  for (let i = 0; i <= 120; i++) {
    const scan = map(i, 0, 120, -230, 230);
    const source = createVector(centerX, groundY + depth * 1.05);
    const x = centerX + scan;
    const instrumentCenterY = groundY - 108;
    const visualBaseline = map(baseline, 20, 220, 28, 118);
    const upper = createVector(x, instrumentCenterY - visualBaseline * 0.5);
    const lower = createVector(x, instrumentCenterY + visualBaseline * 0.5);
    const d = gravityVector(lower, source, mass).mag() - gravityVector(upper, source, mass).mag();
    peak = max(peak, abs(d));
  }
  return peak;
}

function drawReadout(delta, gradient, baseline) {
  fill(210);
  noStroke();
  textSize(13);
  text('读数差 Δg：' + delta.toExponential(2) + ' 相对单位', 24, 466);
  text('梯度 Γ：' + gradient.toExponential(2) + ' /m', 24, 486);
  fill(150, 165, 190);
  text('基线 L = ' + baseline.toFixed(0) + ' m；图中为放大示意，两团原子都在设备内。', 300, 466);
  text('箭头表示地下异常体造成的附加引力，不代表地球整体重力方向。', 300, 486);
}

function drawArrow(x1, y1, x2, y2, c) {
  stroke(c);
  strokeWeight(3);
  line(x1, y1, x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  noStroke();
  fill(c);
  push();
  translate(x2, y2);
  rotate(a);
  triangle(0, 0, -9, -5, -9, 5);
  pop();
}
