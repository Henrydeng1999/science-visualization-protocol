// 黑体辐射与普朗克：温度决定辐射光谱的峰值波长与物体颜色
// 这是「能量量子化」的历史起点——普朗克为解释这条曲线提出了能量一份份发出

const ML = 62, MR = 30, MT = 40, MB = 56; // 绘图区边距
const LAMBDA_MAX_NM = 2000;               // 横轴最大波长

function setup() {
  let canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');
  select('#temp').input(updateLabels);
  updateLabels();
}

function updateLabels() {
  select('#temp-value').html(select('#temp').value() + ' K');
}

function draw() {
  background(12, 16, 28);
  const T = parseFloat(select('#temp').value());

  const plotW = width - ML - MR;
  const plotH = height - MT - MB;
  const x0 = ML, y0 = height - MB;

  // 可见光彩带背景（380–750nm）
  noStroke();
  for (let wl = 380; wl <= 750; wl += 2) {
    const c = wavelengthToColor(wl);
    c.setAlpha(45);
    fill(c);
    const px = x0 + (wl / LAMBDA_MAX_NM) * plotW;
    rect(px, MT, (2 / LAMBDA_MAX_NM) * plotW + 1, plotH);
  }

  // 计算普朗克曲线并找峰值用于归一化
  const vals = [];
  let vmax = 0;
  for (let px = 0; px <= plotW; px++) {
    const wl = (px / plotW) * LAMBDA_MAX_NM;
    const v = wl > 0 ? planck(wl, T) : 0;
    vals.push(v);
    if (v > vmax) vmax = v;
  }

  // 坐标轴
  stroke(120, 140, 170);
  strokeWeight(1.5);
  line(x0, MT, x0, y0);
  line(x0, y0, x0 + plotW, y0);
  noStroke();
  fill(160, 175, 200);
  textSize(12);
  textAlign(CENTER, TOP);
  text('波长 λ (nm)', x0 + plotW / 2, y0 + 30);
  for (let wl = 0; wl <= LAMBDA_MAX_NM; wl += 500) {
    const px = x0 + (wl / LAMBDA_MAX_NM) * plotW;
    text(wl, px, y0 + 6);
  }
  push();
  translate(16, MT + plotH / 2);
  rotate(-HALF_PI);
  text('辐射强度', 0, 0);
  pop();

  // 普朗克曲线
  noFill();
  stroke(255, 230, 120);
  strokeWeight(2.5);
  beginShape();
  for (let px = 0; px <= plotW; px++) {
    vertex(x0 + px, y0 - (vals[px] / vmax) * plotH);
  }
  endShape();

  // 峰值波长（维恩位移定律 λ_max·T = 2.898×10⁶ nm·K）
  const peakWl = 2.898e6 / T;
  if (peakWl < LAMBDA_MAX_NM) {
    const px = x0 + (peakWl / LAMBDA_MAX_NM) * plotW;
    stroke(255, 120, 120);
    strokeWeight(1);
    drawingContext.setLineDash([5, 4]);
    line(px, MT, px, y0);
    drawingContext.setLineDash([]);
    noStroke();
    fill(255, 150, 150);
    textAlign(LEFT, BOTTOM);
    text('峰值 ' + peakWl.toFixed(0) + ' nm', px + 4, MT + 14);
  }

  // 物体颜色块
  const col = blackbodyColor(T);
  noStroke();
  fill(col);
  circle(width - 72, MT + 28, 44);
  noFill();
  stroke(90);
  strokeWeight(1);
  circle(width - 72, MT + 28, 44);
  noStroke();
  fill(190);
  textSize(12);
  textAlign(CENTER, TOP);
  text('物体颜色', width - 72, MT + 54);

  // 读数
  fill(210);
  textAlign(LEFT, TOP);
  textSize(13);
  text('温度越高 → 峰值左移（维恩）、总辐射 ∝ T⁴', x0 + 8, MT + 4);
  text('总辐射 ≈ ' + pow(T / 5800, 4).toFixed(2) + '× 太阳(5800K)', x0 + 8, MT + 22);
  textAlign(LEFT, BASELINE);
}

// 普朗克公式（相对强度，λ 以 nm 计）：1/λ⁵ · 1/(e^(hc/λkT) − 1)
function planck(wl, T) {
  const x = 1.4388e7 / (wl * T); // hc/k = 1.4388×10⁷ nm·K
  return 1.0 / (pow(wl, 5) * (exp(x) - 1));
}

// 可见光波长 → 近似 RGB
function wavelengthToColor(wl) {
  let r = 0, g = 0, b = 0;
  if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
  else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
  else if (wl < 510) { g = 1; b = -(wl - 510) / 20; }
  else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
  else if (wl < 645) { r = 1; g = -(wl - 645) / 65; }
  else if (wl <= 780) { r = 1; }
  return color(r * 255, g * 255, b * 255);
}

// 色温 → 近似黑体颜色（Tanner Helland 算法简化版）
function blackbodyColor(T) {
  const t = T / 100;
  let r, g, b;
  if (t <= 66) r = 255; else r = 329.7 * pow(t - 60, -0.1332);
  if (t <= 66) g = 99.47 * log(t) - 161.1; else g = 288.1 * pow(t - 60, -0.0755);
  if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = 138.5 * log(t - 10) - 305.0;
  return color(constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255));
}
