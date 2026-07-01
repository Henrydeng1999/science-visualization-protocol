// 点电荷电场线演示：电荷量改变电场线疏密，箭头表示电场方向

function setup() {
  let canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');

  select('#charge').input(updateLabels);
  updateLabels();
}

function updateLabels() {
  select('#charge-value').html(select('#charge').value());
}

function draw() {
  background(10, 12, 20);

  let q = parseFloat(select('#charge').value());
  let cx = width / 2;
  let cy = height / 2 - 20;

  // 电场线数量随电荷量变化（电荷越大，线越密 = 场越强）
  let numLines = floor(q) * 2 + 4;
  stroke(80, 200, 255, 110);
  strokeWeight(2);
  for (let k = 0; k < numLines; k++) {
    let a = (TWO_PI / numLines) * k;
    line(cx + 22 * cos(a), cy + 22 * sin(a), cx + 300 * cos(a), cy + 300 * sin(a));
    // 箭头指向外，表示正电荷电场方向
    drawArrowHead(cx + 150 * cos(a), cy + 150 * sin(a), a);
  }

  // 中心正电荷
  fill(255, 80, 80);
  stroke(255, 150, 150);
  strokeWeight(3);
  circle(cx, cy, 40);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text("+", cx, cy);
  textAlign(LEFT, BASELINE);

  // 试探电荷位置（鼠标，默认右侧）
  let mx = mouseX, my = mouseY;
  if (mx === 0 && my === 0) { mx = cx + 180; my = cy; }
  mx = constrain(mx, 0, width);
  my = constrain(my, 0, height);

  // 库仑力
  let dx = mx - cx, dy = my - cy;
  let dist = sqrt(dx * dx + dy * dy);
  if (dist < 30) dist = 30;
  let forceMag = (q * 50000) / (dist * dist);
  let dirA = atan2(dy, dx);
  let fx = cos(dirA) * forceMag;
  let fy = sin(dirA) * forceMag;

  // 试探电荷
  fill(100, 255, 180);
  noStroke();
  circle(mx, my, 20);

  // 力箭头
  stroke(255, 220, 100);
  strokeWeight(4);
  line(mx, my, mx + fx, my + fy);
  drawArrowHead(mx + fx, my + fy, dirA, color(255, 220, 100));

  // 提示
  fill(200);
  noStroke();
  textSize(13);
  text("移动鼠标，观察试探电荷受到的力", 20, height - 30);
  text("距离中心电荷：" + int(dist) + " px    电场力大小：" + forceMag.toFixed(1), 20, height - 10);
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
