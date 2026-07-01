// 彩虹与光的色散：光线在水滴内部折射-反射-折射出
// 不同颜色光折射率不同，因此偏折角度不同，白光被分解成光谱
// 注：真实水的折射率差极小（红 1.331～紫 1.344），为让色散看得清，这里放大了各色差距

const SPECTRUM = [
  { name: "红", n: 1.33, c: [255, 70, 70] },
  { name: "橙", n: 1.35, c: [255, 140, 40] },
  { name: "黄", n: 1.37, c: [255, 215, 60] },
  { name: "绿", n: 1.40, c: [90, 220, 110] },
  { name: "蓝", n: 1.44, c: [80, 150, 255] },
  { name: "紫", n: 1.49, c: [175, 85, 255] }
];

function setup() {
  let canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');

  select('#angle').input(updateLabels);
  updateLabels();
}

function updateLabels() {
  select('#angle-value').html(select('#angle').value() + '°');
}

function draw() {
  background(10, 14, 26);

  let incidentAngle = parseFloat(select('#angle').value());
  let R = 80; // 水滴半径固定：尺寸只是整体缩放，不影响色散现象
  let cx = width / 2;
  let cy = height / 2;

  // 水滴
  noFill();
  stroke(180, 220, 255, 120);
  strokeWeight(2);
  circle(cx, cy, R * 2);

  // 入射点 A：水滴顶部
  let A = createVector(cx, cy - R);

  // 入射方向：从左上方向下射向 A
  let inDir = p5.Vector.fromAngle(radians(incidentAngle));

  // 白光入射段
  let inStart = p5.Vector.sub(A, inDir.copy().mult(250));
  strokeWeight(4);
  stroke(255);
  line(inStart.x, inStart.y, A.x, A.y);

  // A 点法线（圆心指向入射点，向上）
  let normalA = createVector(0, -1);

  // 各色光分别计算路径
  for (const s of SPECTRUM) {
    drawLightPath(cx, cy, R, A, inDir, normalA, s.n, color(s.c[0], s.c[1], s.c[2]));
  }

  drawLegend();
}

function drawLightPath(cx, cy, R, A, inDir, normalA, n, c) {
  // 折射方向：从入射方向向法线偏折
  let refractDir = refract(inDir, normalA, n);
  if (refractDir === null) return;

  // 折射光线与水滴内壁交点 B
  let B = lineCircleIntersect(A, refractDir, cx, cy, R, false);
  if (B === null) return;

  // B 点法线
  let normalB = p5.Vector.sub(B, createVector(cx, cy)).normalize();

  // 内壁反射
  let reflectDir = reflect(refractDir, normalB);

  // 反射光线与内壁交点 C
  let C = lineCircleIntersect(B, reflectDir, cx, cy, R, false);
  if (C === null) return;

  // C 点法线
  let normalC = p5.Vector.sub(C, createVector(cx, cy)).normalize();

  // 从 C 点折射出
  let outDir = refract(reflectDir.copy().mult(-1), normalC.copy().mult(-1), 1 / n);
  if (outDir === null) return;
  outDir.mult(-1);

  // 水滴内部光线 A -> B -> C
  stroke(c);
  strokeWeight(2);
  line(A.x, A.y, B.x, B.y);
  line(B.x, B.y, C.x, C.y);

  // 出射光线（加长，让各色光在末端张得更开）
  let outEnd = p5.Vector.add(C, outDir.copy().mult(340));
  strokeWeight(3);
  line(C.x, C.y, outEnd.x, outEnd.y);
}

// 折射：inDir 入射方向（指向界面），normal 界面法线（指向入射介质）
function refract(inDir, normal, n) {
  let I = inDir.copy().normalize();
  let N = normal.copy().normalize();
  let cosI = -I.dot(N);
  let sinT2 = (1.0 / (n * n)) * (1.0 - cosI * cosI);
  if (sinT2 > 1.0) return null; // 全反射
  let cosT = sqrt(1.0 - sinT2);
  return p5.Vector.add(I.copy().mult(1 / n), N.copy().mult((1 / n) * cosI - cosT)).normalize();
}

// 反射
function reflect(inDir, normal) {
  let I = inDir.copy().normalize();
  let N = normal.copy().normalize();
  return p5.Vector.sub(I, N.copy().mult(2 * I.dot(N))).normalize();
}

// 直线与圆交点。start 在圆上，dir 方向，返回另一交点
function lineCircleIntersect(start, dir, cx, cy, R, returnFirst) {
  let d = dir.copy().normalize();
  let f = p5.Vector.sub(start, createVector(cx, cy));
  let a = d.dot(d);
  let b = 2 * f.dot(d);
  let c = f.dot(f) - R * R;
  let discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null;

  let t1 = (-b - sqrt(discriminant)) / (2 * a);
  let t2 = (-b + sqrt(discriminant)) / (2 * a);
  let t = returnFirst ? min(t1, t2) : (abs(t1) > abs(t2) ? t1 : t2);
  return p5.Vector.add(start, d.copy().mult(t));
}

function drawLegend() {
  let x = width - 70;
  let y = 30;
  textSize(13);
  for (let k = 0; k < SPECTRUM.length; k++) {
    let s = SPECTRUM[k];
    noStroke();
    fill(s.c[0], s.c[1], s.c[2]);
    circle(x, y + k * 22, 12);
    fill(230);
    text(s.name + "光", x + 14, y + k * 22 + 5);
  }
}
