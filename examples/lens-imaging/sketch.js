// 透镜成像：真实光学光路追迹 + 写实镜片截面渲染

const AXIS_Y = 270;
const LENS_X = 430;
const LENS_HALF_H = 150;

function readParams() {
  return {
    type: select('#lens-type').value(),
    focalMag: parseFloat(select('#focal').value()),
    u: parseFloat(select('#object').value()),
    h: parseFloat(select('#height').value())
  };
}

function setupControls() {
  select('#lens-type').changed(updateLabels);
  select('#focal').input(updateLabels);
  select('#object').input(updateLabels);
  select('#height').input(updateLabels);
}

function updateLabels() {
  select('#focal-value').html(select('#focal').value() + ' px');
  select('#object-value').html(select('#object').value() + ' px');
  select('#height-value').html(select('#height').value() + ' px');
}

function setup() {
  const canvas = createCanvas(780, 560);
  canvas.parent('canvas-container');
  setupControls();
  updateLabels();
}

function draw() {
  const p = readParams();
  const converging = p.type === 'convex';
  const f = converging ? p.focalMag : -p.focalMag;

  background(10, 14, 24);
  drawHeader();
  drawGrid();
  drawAxis();

  const geo = computeGeometry(p, f);
  drawFocalMarks(f);
  drawObject(geo);
  drawRays(geo, f);
  drawLensShape(p.type, p.focalMag);
  drawImage(geo);
  updateReadout(p, f, geo);
  drawCaption(p, f, geo);
}

function drawHeader() {
  noStroke();
  fill(230);
  textSize(17);
  text('透镜成像', 24, 30);
  fill(150, 165, 190);
  textSize(12);
  text('关联基本量：长度 m', 24, 50);
}

function drawGrid() {
  stroke(35, 44, 62);
  strokeWeight(1);
  for (let x = 40; x < 760; x += 40) line(x, 70, x, 480);
  for (let y = 70; y < 480; y += 35) line(40, y, 760, y);
}

function drawAxis() {
  stroke(110, 130, 160);
  strokeWeight(1.5);
  line(40, AXIS_Y, 760, AXIS_Y);
  noStroke();
  fill(110, 130, 160);
  textSize(11);
  text('主光轴', 700, AXIS_Y - 8);
}

// 薄透镜近似的矩阵光学：任意光线在透镜处高度 H、入射斜率 s，
// 出射斜率 = 入射斜率 - H/f。对 f 取正负号即可同时描述凸、凹透镜。
function computeGeometry(p, f) {
  const u = p.u, h = p.h;
  const objX = LENS_X - u;

  // v = 1 / (1/f - 1/u)，来自 1/u + 1/v = 1/f
  const denom = 1 / f - 1 / u;
  const hasImage = Math.abs(denom) > 1e-6;
  const v = hasImage ? 1 / denom : Infinity;
  const m = hasImage ? -v / u : NaN;
  const imgX = LENS_X + v;
  const imgH = hasImage ? m * h : NaN;

  return { objX, h, u, f, v, m, imgX, imgH, hasImage };
}

function drawFocalMarks(f) {
  stroke(90, 200, 140);
  strokeWeight(1);
  noFill();
  const af = abs(f);
  const positions = [LENS_X - af, LENS_X + af]; // F1 恒在物方，F2 恒在像方
  positions.forEach((x, i) => {
    line(x, AXIS_Y - 8, x, AXIS_Y + 8);
    noStroke();
    fill(120, 220, 160);
    textSize(11);
    textAlign(CENTER);
    text(i === 0 ? 'F₁' : 'F₂', x, AXIS_Y + 24);
    textAlign(LEFT);
    stroke(90, 200, 140);
    noFill();
  });
}

function drawObject(geo) {
  drawArrow(geo.objX, AXIS_Y, geo.objX, AXIS_Y - geo.h, color(255, 210, 100));
  noStroke();
  fill(255, 210, 100);
  textSize(12);
  textAlign(CENTER);
  text('物', geo.objX, AXIS_Y - geo.h - 12);
  textAlign(LEFT);
}

function drawImage(geo) {
  if (!geo.hasImage) return;
  const real = geo.v > 0;
  const x = geo.imgX;
  const y = AXIS_Y - geo.imgH;
  if (x < 40 || x > 760) return; // 超出画面，不绘制
  const c = real ? color(120, 240, 170) : color(160, 170, 255);
  if (real) {
    drawArrow(x, AXIS_Y, x, y, c);
  } else {
    drawDashedLine(x, AXIS_Y, x, y, c);
    noStroke();
    fill(c);
    circle(x, y, 6);
    circle(x, AXIS_Y, 4);
  }
  noStroke();
  fill(c);
  textSize(12);
  textAlign(CENTER);
  text(real ? '实像' : '虚像', x, y + (geo.imgH >= 0 ? -12 : 20));
  textAlign(LEFT);
}

// 三条特殊光线：平行光→过像方焦点；过光心直行；过物方焦点→平行出射
function drawRays(geo, f) {
  const { objX, h, u } = geo;
  const T = { x: objX, y: h };

  const ray1 = { hAtLens: h, slopeIn: 0 };
  const slopeIn2 = (0 - h) / (LENS_X - objX);
  const ray2 = { hAtLens: 0, slopeIn: slopeIn2 };
  const slopeIn3 = (0 - h) / ((LENS_X - f) - objX);
  const hAtLens3 = h + slopeIn3 * u;
  const ray3 = { hAtLens: hAtLens3, slopeIn: slopeIn3 };

  [ray1, ray2, ray3].forEach((ray, idx) => {
    const slopeOut = ray.slopeIn - ray.hAtLens / f;
    const cols = [color(255, 140, 130), color(130, 200, 255), color(255, 210, 120)];
    drawSingleRay(T, ray.hAtLens, ray.slopeIn, slopeOut, cols[idx]);
  });
}

function drawSingleRay(T, hAtLens, slopeIn, slopeOut, col) {
  // 入射段：物体顶点 -> 透镜处
  const p1 = toPixel(T.x, T.y);
  const p2 = toPixel(LENS_X, hAtLens);
  stroke(col);
  strokeWeight(2);
  line(p1.x, p1.y, p2.x, p2.y);

  // 出射段：透镜处沿 slopeOut 延伸到画面右边
  const farX = 760;
  const hFar = hAtLens + slopeOut * (farX - LENS_X);
  const p3 = toPixel(farX, hFar);
  line(p2.x, p2.y, p3.x, p3.y);

  // 若出射光线在物方（向左）反向延长会经过虚像位置，画虚线辅助
  const nearX = 40;
  const hNear = hAtLens + slopeOut * (nearX - LENS_X);
  if (nearX < LENS_X) {
    const p4 = toPixel(nearX, hNear);
    drawDashedLine(p2.x, p2.y, p4.x, p4.y, color(red(col), green(col), blue(col), 110));
  }
}

function toPixel(x, h) { return { x, y: AXIS_Y - h }; }

function drawDashedLine(x1, y1, x2, y2, col) {
  stroke(col);
  strokeWeight(1.5);
  const d = dist(x1, y1, x2, y2);
  const steps = max(2, floor(d / 8));
  for (let i = 0; i < steps; i += 2) {
    const t1 = i / steps, t2 = min(1, (i + 1) / steps);
    line(lerp(x1, x2, t1), lerp(y1, y2, t1), lerp(x1, x2, t2), lerp(y1, y2, t2));
  }
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
  triangle(0, 0, -10, -5, -10, 5);
  pop();
}

// 写实镜片截面：使用贝塞尔曲线和渐变，让镜片边缘更丝滑
function drawLensShape(type, focalMag) {
  const halfH = LENS_HALF_H;
  const convex = type === 'convex';
  const curve = constrain(map(focalMag, 60, 220, 54, 24), 24, 54);
  const edge = convex ? 8 : curve;
  const center = convex ? curve : 10;
  const topY = AXIS_Y - halfH;
  const bottomY = AXIS_Y + halfH;

  const leftTop = LENS_X - edge;
  const leftMid = LENS_X - center;
  const leftBottom = LENS_X - edge;
  const rightTop = LENS_X + edge;
  const rightMid = LENS_X + center;
  const rightBottom = LENS_X + edge;

  const grad = drawingContext.createLinearGradient(LENS_X - curve - 8, 0, LENS_X + curve + 8, 0);
  grad.addColorStop(0, 'rgba(90, 165, 245, 0.12)');
  grad.addColorStop(0.35, 'rgba(170, 220, 255, 0.34)');
  grad.addColorStop(0.5, 'rgba(230, 250, 255, 0.46)');
  grad.addColorStop(0.65, 'rgba(170, 220, 255, 0.34)');
  grad.addColorStop(1, 'rgba(90, 165, 245, 0.12)');

  drawingContext.save();
  drawingContext.fillStyle = grad;
  noStroke();
  beginShape();
  vertex(leftTop, topY);
  bezierVertex(leftMid - 10, topY + 52, leftMid - 10, bottomY - 52, leftBottom, bottomY);
  bezierVertex(LENS_X - 2, bottomY + 8, LENS_X + 2, bottomY + 8, rightBottom, bottomY);
  bezierVertex(rightMid + 10, bottomY - 52, rightMid + 10, topY + 52, rightTop, topY);
  bezierVertex(LENS_X + 2, topY - 8, LENS_X - 2, topY - 8, leftTop, topY);
  endShape(CLOSE);
  drawingContext.restore();

  stroke(125, 205, 255, 130);
  strokeWeight(7);
  noFill();
  beginShape();
  vertex(leftTop, topY);
  bezierVertex(leftMid - 10, topY + 52, leftMid - 10, bottomY - 52, leftBottom, bottomY);
  endShape();
  beginShape();
  vertex(rightTop, topY);
  bezierVertex(rightMid + 10, topY + 52, rightMid + 10, bottomY - 52, rightBottom, bottomY);
  endShape();

  stroke(205, 238, 255, 220);
  strokeWeight(2);
  beginShape();
  vertex(leftTop, topY);
  bezierVertex(leftMid - 10, topY + 52, leftMid - 10, bottomY - 52, leftBottom, bottomY);
  endShape();
  beginShape();
  vertex(rightTop, topY);
  bezierVertex(rightMid + 10, topY + 52, rightMid + 10, bottomY - 52, rightBottom, bottomY);
  endShape();

  stroke(255, 255, 255, 86);
  strokeWeight(1.4);
  const highlightX = convex ? LENS_X - center * 0.42 : LENS_X - edge * 0.64;
  beginShape();
  vertex(highlightX, topY + 36);
  bezierVertex(highlightX - 8, AXIS_Y - 62, highlightX - 8, AXIS_Y + 62, highlightX, bottomY - 36);
  endShape();

  stroke(120, 200, 255, 75);
  strokeWeight(1);
  line(LENS_X, topY + 12, LENS_X, bottomY - 12);
  noStroke();
  fill(170, 220, 255);
  textSize(11);
  textAlign(CENTER);
  text(convex ? '凸透镜' : '凹透镜', LENS_X, topY - 14);
  textAlign(LEFT);
}

function updateReadout(p, f, geo) {
  const el = select('#readout');
  const lensName = { convex: '凸透镜（会聚）', concave: '凹透镜（发散）' }[p.type];
  let html = `<b>透镜</b>：${lensName}，f = ${f} px<br><b>物距</b> u = ${geo.u} px`;
  if (!geo.hasImage) {
    html += '<br><b>像</b>：物体恰在焦点上，出射光线平行，像在无穷远处。';
  } else {
    const real = geo.v > 0;
    const upright = geo.m > 0;
    const scaleWord = abs(geo.m) > 1 ? '放大' : abs(geo.m) < 1 ? '缩小' : '等大';
    html += `<br><b>像距</b> v = ${geo.v.toFixed(1)} px<br><b>放大率</b> m = ${geo.m.toFixed(2)}`;
    html += `<br><b>成像性质</b>：${real ? '实像' : '虚像'}、${upright ? '正立' : '倒立'}、${scaleWord}`;
  }
  el.html(html);
}

function drawCaption(p, f, geo) {
  noStroke();
  fill(210);
  textSize(13);
  const lines = [
    '透镜公式：1/u + 1/v = 1/f，放大率 m = -v/u',
    '红/蓝/黄三条光线分别为：平行光线、过光心光线、过焦点光线，交点即为像的位置。'
  ];
  lines.forEach((s, i) => text(s, 24, 500 + i * 18));
}
