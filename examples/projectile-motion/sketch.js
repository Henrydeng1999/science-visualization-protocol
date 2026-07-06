// 抛物运动演示：轨迹、速度分解、最大高度和水平射程

let progress = 0;

function setup() {
  const canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');

  select('#v0').input(resetAnim);
  select('#angle').input(resetAnim);
  select('#g').input(resetAnim);
  updateLabels();
}

function resetAnim() {
  progress = 0;
  updateLabels();
}

function updateLabels() {
  select('#v0-value').html(select('#v0').value() + ' m/s');
  select('#angle-value').html(select('#angle').value() + '°');
  select('#g-value').html(select('#g').value() + ' m/s²');
}

function draw() {
  background(14, 18, 30);

  const v0 = parseFloat(select('#v0').value());
  const angle = parseFloat(select('#angle').value());
  const g = parseFloat(select('#g').value());
  const theta = radians(angle);
  const vx = v0 * cos(theta);
  const vy0 = v0 * sin(theta);
  const flightTime = 2 * vy0 / g;
  const range = vx * flightTime;
  const maxH = (vy0 * vy0) / (2 * g);
  const groundY = height - 62;
  const startX = 62;
  const axisEndX = width - 42;
  const usableW = axisEndX - startX;
  const scale = getWorldScale(usableW);
  const landingX = startX + range * scale;
  const peakX = startX + (range / 2) * scale;
  const peakY = groundY - maxH * scale;

  drawAxes(startX, groundY);
  drawTrajectory(startX, groundY, vx, vy0, g, flightTime, scale);
  drawReferenceLines(startX, groundY, landingX, peakX, peakY, maxH, range);

  progress += 0.006;
  if (progress > 1) progress = 0;
  const t = progress * flightTime;
  const x = startX + vx * t * scale;
  const y = groundY - (vy0 * t - 0.5 * g * t * t) * scale;
  const vy = vy0 - g * t;

  drawMovingPoint(x, y, groundY, vx, vy);
  drawLaunchVectors(startX, groundY, vx, vy0, theta);
  drawReadout(v0, angle, g, range, maxH, t, x, y, startX, groundY, scale);
}

function getWorldScale(usableW) {
  const vMax = parseFloat(select('#v0').elt.max);
  const gMin = parseFloat(select('#g').elt.min);
  const maxPossibleRange = vMax * vMax / gMin;
  return usableW / max(maxPossibleRange, 1);
}

function drawAxes(startX, groundY) {
  stroke(92, 112, 145);
  strokeWeight(2);
  line(startX - 30, groundY, width - 42, groundY);
  line(startX, groundY + 26, startX, 84);
  drawArrowHead(width - 42, groundY, 1, 0, color(92, 112, 145));
  drawArrowHead(startX, 84, 0, -1, color(92, 112, 145));
  noStroke();
  fill(145, 160, 185);
  textSize(12);
  text('水平 x', width - 94, groundY - 10);
  text('高度 y', startX + 12, 94);

  stroke(36, 48, 70);
  strokeWeight(1);
  for (let gx = startX; gx < width - 44; gx += 48) line(gx, 88, gx, groundY);
  for (let gy = groundY; gy > 88; gy -= 40) line(startX - 24, gy, width - 46, gy);
}

function drawTrajectory(startX, groundY, vx, vy0, g, flightTime, scale) {
  noFill();
  stroke(95, 245, 180, 82);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i <= 140; i++) {
    const t = flightTime * i / 140;
    const x = startX + vx * t * scale;
    const y = groundY - (vy0 * t - 0.5 * g * t * t) * scale;
    vertex(x, y);
  }
  endShape();

  stroke(120, 255, 200);
  strokeWeight(4);
  beginShape();
  const end = floor(progress * 140);
  for (let i = 0; i <= end; i++) {
    const t = flightTime * i / 140;
    const x = startX + vx * t * scale;
    const y = groundY - (vy0 * t - 0.5 * g * t * t) * scale;
    vertex(x, y);
  }
  endShape();
}

function drawReferenceLines(startX, groundY, landingX, peakX, peakY, maxH, range) {
  drawingContext.setLineDash([7, 7]);
  stroke(255, 210, 100, 150);
  strokeWeight(2);
  line(peakX, peakY, peakX, groundY);
  line(startX, peakY, peakX, peakY);
  drawingContext.setLineDash([]);

  noStroke();
  fill(255, 210, 100);
  circle(peakX, peakY, 9);
  textSize(12);
  text('最高点', peakX + 10, peakY - 8);
  text('Hmax ≈ ' + maxH.toFixed(1) + ' m', startX + 12, peakY - 8);

  fill(255, 185, 80);
  circle(landingX, groundY, 12);
  text('落点', landingX - 14, groundY + 26);

  drawDoubleArrow(startX, groundY + 28, landingX, groundY + 28, color(255, 185, 80));
  fill(255, 185, 80);
  text('水平射程 R ≈ ' + range.toFixed(1) + ' m', startX + max(70, (landingX - startX) / 2 - 70), groundY + 56);
}

function drawMovingPoint(x, y, groundY, vx, vy) {
  drawingContext.setLineDash([5, 7]);
  stroke(120, 170, 230, 140);
  strokeWeight(1.5);
  line(x, y, x, groundY);
  drawingContext.setLineDash([]);

  fill(120, 220, 255);
  noStroke();
  circle(x, y, 18);
  fill(210, 245, 255);
  circle(x - 5, y - 5, 6);

  const speedScale = 0.55;
  drawArrow(x, y, x + vx * speedScale, y - vy * speedScale, color(120, 220, 255));
  fill(120, 220, 255);
  textSize(12);
  text('v', x + vx * speedScale + 8, y - vy * speedScale);
}

function drawLaunchVectors(startX, groundY, vx, vy0, theta) {
  const scale = 1.05;
  const vxEndX = startX + vx * scale;
  const vyEndY = groundY - vy0 * scale;
  drawArrow(startX, groundY, vxEndX, groundY, color(90, 170, 255));
  drawArrow(startX, groundY, startX, vyEndY, color(255, 160, 120));
  drawArrow(startX, groundY, vxEndX, vyEndY, color(255, 230, 120));
  fill(90, 170, 255);
  textSize(12);
  text('vₓ', vxEndX + 8, groundY - 6);
  fill(255, 160, 120);
  text('vᵧ', startX + 8, vyEndY - 8);

  noFill();
  stroke(255, 230, 120);
  strokeWeight(2);
  arc(startX, groundY, 72, 72, -theta, 0);
  fill(255, 230, 120);
  noStroke();
  text('θ', startX + 42, groundY - 12);

  drawArrow(width - 105, 130, width - 105, 180, color(255, 120, 120));
  fill(255, 120, 120);
  text('g', width - 92, 160);
}

function drawReadout(v0, angle, g, range, maxH, t, x, y, startX, groundY, scale) {
  noStroke();
  fill(18, 25, 40, 235);
  rect(448, 22, 222, 112, 8);
  fill(220);
  const realX = (x - startX) / scale;
  const realY = (groundY - y) / scale;
  textSize(13);
  text('v₀ = ' + v0.toFixed(0) + ' m/s   θ = ' + angle.toFixed(0) + '°', 464, 46);
  text('g = ' + g.toFixed(1) + ' m/s²', 464, 66);
  text('R ≈ ' + range.toFixed(1) + ' m   H ≈ ' + maxH.toFixed(1) + ' m', 464, 86);
  fill(150, 165, 190);
  textSize(12);
  text('当前 t = ' + t.toFixed(2) + ' s', 464, 108);
  text('x = ' + realX.toFixed(1) + ' m   y = ' + realY.toFixed(1) + ' m', 464, 126);
}

function drawArrow(x1, y1, x2, y2, c) {
  stroke(c);
  strokeWeight(3);
  line(x1, y1, x2, y2);
  const angle = atan2(y2 - y1, x2 - x1);
  noStroke();
  fill(c);
  push();
  translate(x2, y2);
  rotate(angle);
  triangle(0, 0, -9, -5, -9, 5);
  pop();
}

function drawArrowHead(x, y, dx, dy, c) {
  noStroke();
  fill(c);
  const angle = atan2(dy, dx);
  push();
  translate(x, y);
  rotate(angle);
  triangle(0, 0, -10, -5, -10, 5);
  pop();
}

function drawDoubleArrow(x1, y1, x2, y2, c) {
  stroke(c);
  strokeWeight(2);
  line(x1, y1, x2, y2);
  noStroke();
  fill(c);
  triangle(x2, y2, x2 - 9, y2 - 5, x2 - 9, y2 + 5);
  triangle(x1, y1, x1 + 9, y1 - 5, x1 + 9, y1 + 5);
}
