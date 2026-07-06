// 点电荷电场线演示：电荷量改变电场线疏密，箭头表示电场方向

function setup() {
  let canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');

  select('#charge').input(updateLabels);
  select('#field-mode').changed(updateLabels);
  select('#source-sign').changed(updateLabels);
  select('#test-sign').changed(updateLabels);
  updateLabels();
}

function updateLabels() {
  select('#charge-value').html(select('#charge').value());
  const modeNames={single:'单个中心电荷',dipole:'电偶极子',same:'同号双电荷'};
  select('#field-mode-value').html(modeNames[select('#field-mode').value()]);
  select('#source-sign-value').html(select('#source-sign').value() === '1' ? '正电荷 +' : '负电荷 -');
  select('#test-sign-value').html(select('#test-sign').value() === '1' ? '正试探电荷 +' : '负试探电荷 -');
}

function draw() {
  background(10, 12, 20);

  let qMag = parseFloat(select('#charge').value());
  let mode = select('#field-mode').value();
  let sourceSign = parseFloat(select('#source-sign').value());
  let testSign = parseFloat(select('#test-sign').value());
  let cx = width / 2;
  let cy = height / 2 - 20;
  let charges = buildCharges(mode, cx, cy, qMag, sourceSign);

  drawFieldLines(charges, qMag);

  charges.forEach(drawSourceCharge);

  // 试探电荷位置（鼠标，默认右侧）
  let mx = mouseX, my = mouseY;
  if (mx === 0 && my === 0) { mx = cx + 180; my = cy; }
  mx = constrain(mx, 0, width);
  my = constrain(my, 0, height);

  // 电场和库仑力。softening 防止 r 很小时 1/r² 发散过快。
  let field = electricFieldAt(mx, my, charges);
  let fieldMag = field.mag();
  let forceMag = fieldMag * 10;
  let fieldDir = fieldMag > 0.001 ? field.copy().normalize() : createVector(1, 0);
  let forceDir = testSign > 0 ? fieldDir.copy() : fieldDir.copy().mult(-1);
  let fieldLen = constrain(22 + fieldMag * 4.8, 22, 82);
  let forceLen = constrain(24 + forceMag * 0.55, 24, 96);

  // 试探电荷
  fill(testSign > 0 ? color(100, 255, 180) : color(170, 130, 255));
  noStroke();
  circle(mx, my, 20);
  fill(15, 22, 32);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(testSign > 0 ? "+" : "-", mx, my + 1);
  textAlign(LEFT, BASELINE);

  drawVectorArrow(mx, my, fieldDir, fieldLen, color(120, 220, 255), "E");
  drawVectorArrow(mx, my, forceDir, forceLen, color(255, 220, 100), "F");

  // 提示
  fill(200);
  noStroke();
  textSize(13);
  text("移动鼠标改变试探电荷位置；E 为电场方向，F 为该试探电荷受力方向", 20, height - 30);
  text("电场强度：" + fieldMag.toFixed(2) + "    力大小：" + forceMag.toFixed(1) + "    场景：" + select('#field-mode-value').html(), 20, height - 10);
}

function buildCharges(mode, cx, cy, qMag, sourceSign) {
  if (mode === "dipole") {
    return [
      { x: cx - 92, y: cy, q: qMag, label: "+" },
      { x: cx + 92, y: cy, q: -qMag, label: "-" }
    ];
  }
  if (mode === "same") {
    return [
      { x: cx - 92, y: cy, q: qMag * sourceSign, label: sourceSign > 0 ? "+" : "-" },
      { x: cx + 92, y: cy, q: qMag * sourceSign, label: sourceSign > 0 ? "+" : "-" }
    ];
  }
  return [{ x: cx, y: cy, q: qMag * sourceSign, label: sourceSign > 0 ? "+" : "-" }];
}

function electricFieldAt(x, y, charges) {
  let field = createVector(0, 0);
  charges.forEach(ch => {
    let dx = x - ch.x;
    let dy = y - ch.y;
    let d = max(1, sqrt(dx * dx + dy * dy));
    let softenedR2 = dx * dx + dy * dy + 70 * 70;
    let mag = ch.q * 12000 / softenedR2;
    field.add(createVector(dx / d, dy / d).mult(mag));
  });
  return field;
}

function drawFieldLines(charges, qMag) {
  const positive = charges.filter(ch => ch.q > 0);
  const negative = charges.filter(ch => ch.q < 0);
  const isDipole = charges.length === 2 && positive.length === 1 && negative.length === 1;
  if (charges.length === 1) {
    drawSingleChargeLines(charges[0], qMag);
    return;
  }
  if (isDipole) {
    drawMirroredDipole(positive[0], negative[0], qMag);
    return;
  }
  drawIntegralSameCharges(charges, qMag);
}

function drawSingleChargeLines(ch, qMag) {
  const lineCount = makeEven(floor(qMag) * 2 + 12);
  stroke(ch.q > 0 ? color(80, 200, 255, 110) : color(255, 130, 170, 115));
  strokeWeight(1.8);
  for (let k = 0; k < lineCount; k++) {
    const a = TWO_PI * k / lineCount;
    const r0 = 24;
    const r1 = 305;
    line(ch.x + r0 * cos(a), ch.y + r0 * sin(a), ch.x + r1 * cos(a), ch.y + r1 * sin(a));
    const arrowR = 156;
    drawArrowHead(ch.x + arrowR * cos(a), ch.y + arrowR * sin(a), ch.q > 0 ? a : a + PI, ch.q > 0 ? color(80, 200, 255, 170) : color(255, 130, 170, 170));
  }
}

function makeEven(n) {
  return n % 2 === 0 ? n : n + 1;
}

function drawMirroredDipole(pos, neg, qMag) {
  const pairCount = constrain(floor(qMag * 0.28) + 3, 3, 8);
  const angles = [0];
  for (let i = 1; i <= pairCount; i++) {
    const a = map(i, 1, pairCount, 0.34, PI - 0.34);
    angles.push(a, -a);
  }
  angles.push(PI);
  angles.forEach(a => {
    drawDipoleLineFromPositive(pos, neg, a);
    drawDipoleLineFromNegative(pos, neg, PI - a);
  });
}

function drawDipoleLineFromPositive(pos, neg, angle) {
  const start = createVector(pos.x + 24 * cos(angle), pos.y + 24 * sin(angle));
  const points = integrateFieldPath(start, [pos, neg], 1, 620, 1.85);
  drawSmoothPath(points, color(80, 200, 255, 120), 0.56);
}

function drawDipoleLineFromNegative(pos, neg, angle) {
  const start = createVector(neg.x + 24 * cos(angle), neg.y + 24 * sin(angle));
  const points = integrateFieldPath(start, [pos, neg], -1, 620, 1.85).reverse();
  drawSmoothPath(points, color(80, 200, 255, 86), 0.56);
}

function integrateFieldPath(start, charges, direction, maxSteps, stepSize) {
  const points = [start.copy()];
  let p = start.copy();
  for (let i = 0; i < maxSteps; i++) {
    const nearTarget = charges.find(ch => direction > 0 ? ch.q < 0 && dist(p.x, p.y, ch.x, ch.y) < 24 : ch.q > 0 && dist(p.x, p.y, ch.x, ch.y) < 24);
    if (nearTarget && i > 8) break;
    if (p.x < 20 || p.x > width - 20 || p.y < 70 || p.y > height - 55) break;
    const e = electricFieldAt(p.x, p.y, charges);
    if (e.mag() < 0.00008) break;
    e.normalize().mult(stepSize * direction);
    p = createVector(p.x + e.x, p.y + e.y);
    points.push(p.copy());
  }
  return points;
}

function drawSmoothPath(points, c, arrowT) {
  if (points.length < 3) return;
  stroke(c);
  strokeWeight(1.8);
  noFill();
  beginShape();
  curveVertex(points[0].x, points[0].y);
  points.forEach(p => curveVertex(p.x, p.y));
  const last = points[points.length - 1];
  curveVertex(last.x, last.y);
  endShape();
  const idx = constrain(floor(points.length * arrowT), 1, points.length - 2);
  const p = points[idx];
  const q = points[idx + 1];
  drawArrowHead(p.x, p.y, atan2(q.y - p.y, q.x - p.x), c);
}

function drawIntegralSameCharges(charges, qMag) {
  const left = charges[0].x < charges[1].x ? charges[0] : charges[1];
  const right = charges[0].x < charges[1].x ? charges[1] : charges[0];
  const midX = (left.x + right.x) / 2;
  const pairCount = constrain(floor(qMag * 0.25) + 3, 3, 8);
  const angles = [];
  for (let i = 0; i < pairCount; i++) {
    angles.push(map(i, 0, pairCount - 1, 0.52, PI - 0.52));
  }
  angles.forEach(a => {
    const upper = getSameIntegralLine(left, a, left.q > 0);
    const lower = getSameIntegralLine(left, -a, left.q > 0);
    drawSmoothPath(upper, left.q > 0 ? color(80, 200, 255, 105) : color(255, 130, 170, 115), 0.50);
    drawSmoothPath(lower, left.q > 0 ? color(80, 200, 255, 105) : color(255, 130, 170, 115), 0.50);
    drawSmoothPath(mirrorPathX(upper, midX), right.q > 0 ? color(80, 200, 255, 105) : color(255, 130, 170, 115), 0.50);
    drawSmoothPath(mirrorPathX(lower, midX), right.q > 0 ? color(80, 200, 255, 105) : color(255, 130, 170, 115), 0.50);
  });
  noStroke();
  fill(150, 165, 190);
  textSize(12);
  text('同号相斥，中间电场线向外分开', 250, 92);
}

function getSameIntegralLine(ch, angle, outward) {
  const start = createVector(ch.x + 25 * cos(angle), ch.y + 25 * sin(angle));
  if (outward) {
    return integrateFieldPath(start, buildSamePairFromCharge(ch), 1, 560, 1.9);
  }
  return integrateFieldPath(start, buildSamePairFromCharge(ch), -1, 560, 1.9).reverse();
}

function mirrorPathX(points, midX) {
  return points.map(p => createVector(2 * midX - p.x, p.y));
}

function buildSamePairFromCharge(ch) {
  const mode = select('#field-mode').value();
  const qMag = parseFloat(select('#charge').value());
  const sourceSign = parseFloat(select('#source-sign').value());
  return buildCharges(mode, width / 2, height / 2 - 20, qMag, sourceSign);
}

function drawSourceCharge(ch) {
  fill(ch.q > 0 ? color(255, 90, 90) : color(90, 150, 255));
  stroke(ch.q > 0 ? color(255, 150, 150) : color(150, 200, 255));
  strokeWeight(3);
  circle(ch.x, ch.y, 40);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text(ch.label, ch.x, ch.y);
  textAlign(LEFT, BASELINE);
}

function drawVectorArrow(x, y, dir, len, c, label) {
  let sx = x + dir.x * 15;
  let sy = y + dir.y * 15;
  let ex = sx + dir.x * len;
  let ey = sy + dir.y * len;
  stroke(c);
  strokeWeight(3);
  line(sx, sy, ex, ey);
  drawArrowHead(ex, ey, atan2(dir.y, dir.x), c);
  noStroke();
  fill(c);
  textSize(12);
  text(label, ex + 7, ey - 5);
}

// 在 (x,y) 处画一个指向 angle 方向的三角箭头
function drawArrowHead(x, y, angle, c) {
  push();
  translate(x, y);
  rotate(angle);
  noStroke();
  if (c) fill(c); else fill(80, 200, 255, 180);
  triangle(0, 0, -10, -4, -10, 4);
  pop();
}
