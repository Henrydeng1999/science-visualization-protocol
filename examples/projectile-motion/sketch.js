// 抛物运动演示：小球沿轨迹运动，并显示理论射程与最大高度

let progress = 0; // 动画进度（0..1）

function setup() {
  let canvas = createCanvas(700, 500);
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
  background(20, 24, 35);

  let v0 = parseFloat(select('#v0').value());
  let angle = parseFloat(select('#angle').value());
  let g = parseFloat(select('#g').value());

  let groundY = height - 60;
  let startX = 50;
  let dt = 0.05;
  let scale = 4;

  // 地面
  stroke(100);
  strokeWeight(2);
  line(50, groundY, width - 50, groundY);

  // 计算完整轨迹点
  let vx = v0 * cos(radians(angle));
  let vy0 = v0 * sin(radians(angle));
  let pts = [];
  let x = startX, y = groundY, vy = -vy0;
  do {
    pts.push(createVector(x, y));
    x += vx * dt * scale;
    y += vy * dt * scale;
    vy += g * dt;
  } while (y <= groundY && x <= width - 50 && pts.length < 2000);

  // 轨迹引导线（淡）
  noFill();
  stroke(100, 255, 180, 80);
  strokeWeight(2);
  beginShape();
  for (let p of pts) vertex(p.x, p.y);
  endShape();

  // 落点标记
  let landing = pts[pts.length - 1];
  fill(255, 200, 80);
  noStroke();
  circle(landing.x, groundY, 12);

  // 动画小球沿轨迹运动
  progress += 0.008;
  if (progress > 1) progress = 0;
  let idx = floor(progress * (pts.length - 1));

  // 已飞过的拖尾
  noFill();
  stroke(120, 255, 200);
  strokeWeight(3);
  beginShape();
  for (let k = 0; k <= idx; k++) vertex(pts[k].x, pts[k].y);
  endShape();

  // 小球
  fill(120, 220, 255);
  noStroke();
  circle(pts[idx].x, pts[idx].y, 16);

  // 理论读数
  let range = (v0 * v0 * sin(radians(2 * angle))) / g;
  let maxH = (vy0 * vy0) / (2 * g);
  fill(220);
  textSize(13);
  text("水平射程 ≈ " + range.toFixed(1) + " m", 20, 30);
  text("最大高度 ≈ " + maxH.toFixed(1) + " m", 20, 50);
  text("改变参数，观察轨迹、射程与最大高度的变化", 20, height - 20);
}
