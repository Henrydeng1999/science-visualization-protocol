// 不同形状磁铁的磁场：用磁荷（N/S 磁极）叠加，追踪磁感线
// 形状改变磁极的排布，磁感线从 N 极出发、回到 S 极

const CX = 350;
const CY = 250;

function setup() {
  let canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');

  select('#shape').changed(updateLabels);
  select('#lines').input(updateLabels);
  updateLabels();
}

function updateLabels() {
  const names = { bar: '条形磁铁', horseshoe: 'U 形磁铁', disk: '圆形磁铁' };
  select('#shape-value').html(names[select('#shape').value()]);
  select('#lines-value').html(select('#lines').value());
}

function draw() {
  background(12, 16, 28);

  const shape = select('#shape').value();
  const numLines = parseInt(select('#lines').value());
  const charges = getCharges(shape);

  // 追踪并绘制磁感线（从每个 N 极发出）
  for (const c of charges) {
    if (c.q <= 0) continue;
    for (let k = 0; k < numLines; k++) {
      const a = (TWO_PI / numLines) * k;
      const seed = createVector(c.x + 18 * cos(a), c.y + 18 * sin(a));
      traceFieldLine(seed, charges);
    }
  }

  // 磁铁本体盖在磁感线之上
  drawMagnet(shape);

  // 鼠标小磁针：探测该点磁场方向
  drawCompass(charges);

  // 提示
  noStroke();
  fill(200);
  textSize(13);
  text('切换磁铁形状，观察磁感线从 N 极出发、回到 S 极', 20, height - 30);
  text('移动鼠标，小磁针的红端指向该点磁场方向', 20, height - 12);
}

// 各形状的磁极（磁荷）位置：q>0 为 N 极，q<0 为 S 极
function getCharges(shape) {
  if (shape === 'horseshoe') {
    return [
      { x: CX - 72, y: CY - 80, q: 1 },  // 左上 N
      { x: CX + 72, y: CY - 80, q: -1 }  // 右上 S
    ];
  }
  if (shape === 'disk') {
    return [
      { x: CX + 38, y: CY, q: 1 },   // 右 N
      { x: CX - 38, y: CY, q: -1 }   // 左 S
    ];
  }
  // 默认：条形磁铁
  return [
    { x: CX + 95, y: CY, q: 1 },   // 右端 N
    { x: CX - 95, y: CY, q: -1 }   // 左端 S
  ];
}

// 某点磁场向量（磁荷模型，方向 ∝ 1/r²）
function fieldAt(x, y, charges) {
  let bx = 0, by = 0;
  for (const c of charges) {
    const dx = x - c.x, dy = y - c.y;
    let r2 = dx * dx + dy * dy;
    if (r2 < 1) r2 = 1;
    const r = sqrt(r2);
    const f = c.q / r2;
    bx += (f * dx) / r;
    by += (f * dy) / r;
  }
  return createVector(bx, by);
}

// 从种子点沿磁场方向追踪一条磁感线，直到回到 S 极或离开画布
function traceFieldLine(seed, charges) {
  const ds = 4;
  const maxSteps = 600;
  let pos = seed.copy();

  noFill();
  stroke(120, 200, 255, 90);
  strokeWeight(1.5);
  beginShape();
  for (let step = 0; step < maxSteps; step++) {
    vertex(pos.x, pos.y);

    const B = fieldAt(pos.x, pos.y, charges);
    if (B.mag() < 1e-6) break;
    B.normalize();

    // 在中段画一个箭头，指示磁场方向（N → S）
    if (step === 26) {
      endShape();
      drawArrow(pos.x, pos.y, B.heading(), color(150, 210, 255, 200));
      beginShape();
      vertex(pos.x, pos.y);
    }

    pos.add(B.mult(ds));

    // 回到某个 S 极附近则停止
    let done = false;
    for (const c of charges) {
      if (c.q < 0 && dist(pos.x, pos.y, c.x, c.y) < 14) { done = true; break; }
    }
    if (done) break;
    if (pos.x < -20 || pos.x > width + 20 || pos.y < -20 || pos.y > height + 20) break;
  }
  endShape();
}

function drawMagnet(shape) {
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);

  if (shape === 'horseshoe') {
    // U 形：两根竖条 + 底部连接，开口朝上
    fill(120, 130, 150);
    rect(CX - 92, CY - 90, 40, 150);
    rect(CX + 52, CY - 90, 40, 150);
    rect(CX - 92, CY + 40, 184, 30);
    // 极面
    fill(255, 80, 80); rect(CX - 92, CY - 90, 40, 26); // N
    fill(60, 120, 255); rect(CX + 52, CY - 90, 40, 26); // S
    fill(255);
    text('N', CX - 72, CY - 77);
    text('S', CX + 72, CY - 77);
  } else if (shape === 'disk') {
    // 圆形磁铁，左右半圆异极
    fill(255, 80, 80);
    arc(CX, CY, 150, 150, -HALF_PI, HALF_PI, PIE); // 右半 N
    fill(60, 120, 255);
    arc(CX, CY, 150, 150, HALF_PI, 3 * HALF_PI, PIE); // 左半 S
    fill(255);
    text('N', CX + 45, CY);
    text('S', CX - 45, CY);
  } else {
    // 条形磁铁
    fill(60, 120, 255); rect(CX - 130, CY - 28, 130, 56); // 左 S
    fill(255, 80, 80); rect(CX, CY - 28, 130, 56);        // 右 N
    fill(255);
    text('S', CX - 95, CY);
    text('N', CX + 95, CY);
  }

  textAlign(LEFT, BASELINE);
}

// 鼠标处的小磁针：红端指向磁场方向，蓝端相反
function drawCompass(charges) {
  let mx = mouseX, my = mouseY;
  if (mx === 0 && my === 0) { mx = CX; my = CY - 150; }
  mx = constrain(mx, 0, width);
  my = constrain(my, 0, height);

  const B = fieldAt(mx, my, charges);
  if (B.mag() < 1e-6) return;
  const ang = B.heading();
  const L = 16;

  // 红端（指向 B）
  drawArrow(mx + L * cos(ang), my + L * sin(ang), ang, color(255, 90, 90));
  stroke(255, 90, 90);
  strokeWeight(3);
  line(mx, my, mx + L * cos(ang), my + L * sin(ang));
  // 蓝端（相反）
  stroke(90, 150, 255);
  line(mx, my, mx - L * cos(ang), my - L * sin(ang));
  // 转轴
  noStroke();
  fill(230);
  circle(mx, my, 5);
}

// 在 (x,y) 处画指向 angle 的三角箭头
function drawArrow(x, y, angle, c) {
  push();
  translate(x, y);
  rotate(angle);
  noStroke();
  fill(c);
  triangle(0, 0, -9, -4, -9, 4);
  pop();
}
