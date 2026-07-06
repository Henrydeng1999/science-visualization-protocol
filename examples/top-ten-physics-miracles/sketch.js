// 十大物理神迹实验：大画布互动展台

const experiments = {
  galileo: {
    title: '伽利略斜面',
    a: '斜面角度',
    b: '时间推进',
    hint: '调节斜面和时间，观察小球每过同样时间会走得越来越远。',
    conclusion: '距离不是均匀增加，而是按时间平方变大。'
  },
  cavendish: {
    title: '卡文迪许扭秤',
    a: '大球质量',
    b: '大球距离',
    hint: '调节大球质量和距离，看微弱引力怎样被激光光斑放大。',
    conclusion: '看不见的引力，会让扭杆转一点点。'
  },
  'double-slit': {
    title: '杨氏双缝',
    a: '光的波长',
    b: '双缝间距',
    hint: '调节波长和缝距，看随机光点怎样慢慢堆出明暗条纹。',
    conclusion: '单个光子像点，很多光子一起露出波纹。'
  },
  faraday: {
    title: '法拉第电磁感应',
    a: '磁铁速度',
    b: '线圈匝数',
    hint: '调节磁铁运动和线圈匝数，看电流表和灯泡如何变亮。',
    conclusion: '磁场变化越快，线圈里生出的电越强。'
  },
  michelson: {
    title: '迈克耳孙-莫雷',
    a: '假想以太风',
    b: '旋转角度',
    hint: '调节假想以太风和转角，对比“应该漂移”和“实际几乎不漂移”。',
    conclusion: '条纹没有按以太风模型漂移，旧直觉失败。'
  },
  rutherford: {
    title: '卢瑟福金箔',
    a: '原子核电荷',
    b: '粒子能量',
    hint: '调节原子核吸引和粒子能量，观察直穿、偏转和反弹的比例。',
    conclusion: '原子大多是空的，中间有小而重的核。'
  },
  millikan: {
    title: '密立根油滴',
    a: '电场强度',
    b: '目标油滴电荷',
    hint: '调节电场和油滴电荷，看油滴只会落在整数倍电荷台阶上。',
    conclusion: '电荷不是连续的，而是一份一份的。'
  },
  photoelectric: {
    title: '光电效应',
    a: '光频率',
    b: '光强',
    hint: '调节频率和光强，观察低频强光为什么也打不出电子。',
    conclusion: '频率决定能不能打出电子，光强主要决定数量。'
  },
  'stern-gerlach': {
    title: '斯特恩-盖拉赫',
    a: '磁场梯度',
    b: '束流宽度',
    hint: '调节磁场和束流宽度，看银原子不是散成一片，而是分成两束。',
    conclusion: '自旋测量只有上下两种结果。'
  },
  bell: {
    title: '贝尔不等式检验',
    a: '测量夹角',
    b: '纠缠纯度',
    hint: '调节测量夹角和纠缠纯度，看量子相关能否超过经典红线。',
    conclusion: '纠缠相关可以强到经典解释装不下。'
  }
};

let currentKey = 'galileo';
let photonHits = [];
let scatterEvents = [];
let oilDrops = [];
let spinHits = [];
let lastResetKey = '';
let galileoAutoPlay = false;

function setup() {
  const canvas = createCanvas(1200, 720);
  canvas.parent('canvas-container');
  pixelDensity(displayDensity());
  textFont('Arial, "Microsoft YaHei", sans-serif');
  textStyle(NORMAL);

  select('#experiment').changed(onExperimentChanged);
  select('#param-a').input(onParameterChanged);
  select('#param-b').input(onParameterChanged);
  select('#auto-play').mousePressed(toggleGalileoAutoPlay);

  const params = new URLSearchParams(window.location.search);
  const initialExperiment = params.get('exp');
  if (experiments[initialExperiment]) select('#experiment').value(initialExperiment);

  const initialA = parseFloat(params.get('a'));
  const initialB = parseFloat(params.get('b'));
  if (!Number.isNaN(initialA)) select('#param-a').value(constrain(initialA, 0, 100));
  if (!Number.isNaN(initialB)) select('#param-b').value(constrain(initialB, 0, 100));
  onExperimentChanged();
}

function onExperimentChanged() {
  currentKey = select('#experiment').value();
  resetExperimentState();
  const meta = experiments[currentKey];
  select('#param-a-label').html(meta.a);
  select('#param-b-label').html(meta.b);
  select('#hint').html(meta.hint);
  updateAutoPlayControl();
  updateLabels();
  updateUrlState();
}

function resetExperimentState() {
  if (lastResetKey === currentKey) return;
  photonHits = [];
  scatterEvents = [];
  spinHits = [];
  oilDrops = [];
  for (let i = 0; i < 24; i++) {
    oilDrops.push({
      x: 130 + (i % 8) * 72 + random(-10, 10),
      q: 1 + (i % 5),
      phase: random(TWO_PI),
      r: random(8, 12)
    });
  }
  lastResetKey = currentKey;
}

function updateLabels() {
  const a = Number(select('#param-a').value()) / 100;
  const b = Number(select('#param-b').value()) / 100;
  const values = parameterText(currentKey, a, b);
  select('#param-a-value').html(values[0]);
  select('#param-b-value').html(values[1]);
}

function parameterText(key, a, b) {
  if (key === 'galileo') return [nf(map(a, 0, 1, 12, 44), 1, 0) + '°', nf(b * 6, 1, 1) + ' 秒'];
  if (key === 'cavendish') return [nf(map(a, 0, 1, 1, 4.2), 1, 1) + ' 倍质量', nf(map(b, 0, 1, 170, 92), 1, 0) + ' cm'];
  if (key === 'double-slit') return [nf(map(a, 0, 1, 420, 680), 1, 0) + ' nm', nf(map(b, 0, 1, 150, 45), 1, 0) + ' 像素'];
  if (key === 'faraday') return [nf(map(a, 0, 1, 0.5, 5), 1, 1) + ' 倍速度', floor(map(b, 0, 1, 3, 12)) + ' 匝'];
  if (key === 'michelson') return [nf(map(a, 0, 1, 0, 1), 1, 2) + ' 强度', nf(map(b, 0, 1, 0, 180), 1, 0) + '°'];
  if (key === 'rutherford') return [nf(map(a, 0, 1, 0.8, 3), 1, 1) + ' 倍吸引', nf(map(b, 0, 1, 0.7, 3), 1, 1) + ' 倍能量'];
  if (key === 'millikan') return [nf(map(a, 0, 1, 0.4, 1.9), 1, 1) + ' 倍电场', round(map(b, 0, 1, 1, 6)) + 'e'];
  if (key === 'photoelectric') return [nf(map(a, 0, 1, 0.2, 1.2), 1, 2) + ' 倍阈频', nf(map(b, 0, 1, 1, 12), 1, 0) + ' 束光'];
  if (key === 'stern-gerlach') return [nf(map(a, 0, 1, 25, 130), 1, 0) + ' 分裂', nf(map(b, 0, 1, 8, 44), 1, 0) + ' 宽度'];
  return [nf(map(a, 0, 1, 0, 180), 1, 0) + '°', nf(map(b, 0, 1, 0.55, 1), 1, 2) + ' 纯度'];
}

function onParameterChanged() {
  if (currentKey === 'galileo') galileoAutoPlay = false;
  updateAutoPlayControl();
  updateLabels();
  updateUrlState();
}

function toggleGalileoAutoPlay() {
  if (currentKey !== 'galileo') return;
  galileoAutoPlay = !galileoAutoPlay;
  if (galileoAutoPlay && Number(select('#param-b').value()) >= 99) select('#param-b').value(0);
  updateAutoPlayControl();
  updateLabels();
  updateUrlState();
}

function updateAutoPlayControl() {
  const button = select('#auto-play');
  if (!button) return;
  button.elt.disabled = currentKey !== 'galileo';
  button.html(galileoAutoPlay && currentKey === 'galileo' ? '⏸ 暂停' : '▶ 播放');
}

function updateUrlState() {
  const url = new URL(window.location.href);
  url.searchParams.set('exp', currentKey);
  url.searchParams.set('a', select('#param-a').value());
  url.searchParams.set('b', select('#param-b').value());
  history.replaceState(null, '', url);
}

function draw() {
  background(10, 16, 29);
  drawGrid();
  advanceGalileoAutoPlay();
  const a = Number(select('#param-a').value()) / 100;
  const b = Number(select('#param-b').value()) / 100;

  if (currentKey === 'galileo') drawGalileo(a, b);
  if (currentKey === 'cavendish') drawCavendish(a, b);
  if (currentKey === 'double-slit') drawDoubleSlit(a, b);
  if (currentKey === 'faraday') drawFaraday(a, b);
  if (currentKey === 'michelson') drawMichelson(a, b);
  if (currentKey === 'rutherford') drawRutherford(a, b);
  if (currentKey === 'millikan') drawMillikan(a, b);
  if (currentKey === 'photoelectric') drawPhotoelectric(a, b);
  if (currentKey === 'stern-gerlach') drawSternGerlach(a, b);
  if (currentKey === 'bell') drawBell(a, b);
  drawTitle();
}

function advanceGalileoAutoPlay() {
  if (currentKey !== 'galileo' || !galileoAutoPlay) return;
  const slider = select('#param-b');
  let value = Number(slider.value()) + 0.55;
  if (value > 100) value = 0;
  slider.value(value);
  updateLabels();
  if (frameCount % 15 === 0) updateUrlState();
}

function drawGrid() {
  stroke(48, 62, 86, 85);
  strokeWeight(1);
  for (let x = 0; x <= width; x += 60) line(x, 100, x, height - 150);
  for (let y = 120; y <= height - 160; y += 60) line(0, y, width, y);
}

function drawTitle() {
  const meta = experiments[currentKey];
  noStroke();
  fill(255);
  textSize(28);
  textAlign(LEFT, TOP);
  text(meta.title, 36, 28);
  fill(135, 226, 150);
  textSize(16);
  text(meta.conclusion, 36, 66, 620, 24);
}

function drawConclusion(main, value) {
  const x = 36;
  const y = height - 118;
  const w = width - 72;
  const h = 82;
  noStroke();
  fill(14, 24, 42);
  rect(x, y, w, h, 8);
  stroke(87, 115, 150);
  noFill();
  rect(x, y, w, h, 8);
  noStroke();
  fill(135, 226, 150);
  textSize(17);
  textAlign(LEFT, TOP);
  text('看懂这个结果', x + 22, y + 14);
  fill(255);
  textSize(20);
  text(main, x + 22, y + 40, w - 320, 30);
  fill(255, 212, 96);
  textAlign(RIGHT, TOP);
  text(value, x + w - 22, y + 38, 280, 30);
}

function drawArrow(x1, y1, x2, y2, col) {
  stroke(col);
  strokeWeight(3);
  line(x1, y1, x2, y2);
  const ang = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(ang);
  noStroke();
  fill(col);
  triangle(0, 0, -14, -7, -14, 7);
  pop();
}

function labelText(txt, x, y, align = CENTER) {
  noStroke();
  fill(236);
  textSize(16);
  textAlign(align, CENTER);
  text(txt, x, y);
}

function drawGalileo(angleValue, timeValue) {
  const angle = map(angleValue, 0, 1, 12, 44);
  const start = createVector(105, 160);
  const floorY = 548;
  const maxEndX = 790;
  const maxDrop = floorY - start.y - 26;
  const lenByWidth = maxEndX - start.x;
  const lenByHeight = maxDrop / tan(radians(angle));
  const len = min(lenByWidth, lenByHeight);
  const end = createVector(start.x + len, start.y + tan(radians(angle)) * len);
  const t = timeValue;
  const s = t * t;
  const ball = p5.Vector.lerp(start, end, s);

  stroke(88, 102, 126);
  strokeWeight(3);
  line(70, floorY, 825, floorY);
  fill(38, 54, 76);
  noStroke();
  beginShape();
  vertex(start.x - 24, start.y + 22);
  vertex(end.x + 36, end.y + 22);
  vertex(end.x + 36, floorY);
  vertex(start.x - 24, floorY);
  endShape(CLOSE);

  stroke(104, 166, 240);
  strokeWeight(9);
  line(start.x, start.y, end.x, end.y);
  fill(210);
  noStroke();
  textSize(15);
  textAlign(LEFT, CENTER);
  text('斜面长度会随角度自动缩短，始终留在画布内', 105, floorY + 28);
  stroke(135, 226, 150);
  strokeWeight(2);
  for (let i = 0; i <= 1; i += 0.1) {
    const p = p5.Vector.lerp(start, end, i);
    line(p.x, p.y - 12, p.x, p.y + 12);
  }

  for (let i = 1; i <= 6; i++) {
    const tt = i / 6;
    const pp = p5.Vector.lerp(start, end, tt * tt);
    fill(255, 212, 96, i <= t * 6 ? 210 : 70);
    noStroke();
    circle(pp.x, pp.y - 24, 18 + i * 2);
    labelText(i + '秒', pp.x, pp.y - 56);
  }

  fill(255, 212, 96);
  noStroke();
  circle(ball.x, ball.y - 24, 38);
  drawCurvePanel(840, 178, 270, 190, t);
  drawConclusion('同样是一秒一秒过去，小球走过的间隔越来越大。', '距离比例 ' + nf(s, 1, 2));
}

function drawCurvePanel(x0, y0, w, h, t) {
  stroke(83, 100, 128);
  noFill();
  rect(x0, y0, w, h, 8);
  line(x0 + 30, y0 + h - 30, x0 + w - 20, y0 + h - 30);
  line(x0 + 30, y0 + h - 30, x0 + 30, y0 + 20);
  stroke(135, 226, 150);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let i = 0; i <= 1; i += 0.03) vertex(x0 + 30 + i * (w - 55), y0 + h - 30 - i * i * (h - 60));
  endShape();
  const px = x0 + 30 + t * (w - 55);
  const py = y0 + h - 30 - t * t * (h - 60);
  noStroke();
  fill(255, 212, 96);
  circle(px, py, 14);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text('s ∝ t²', x0 + w / 2, y0 + h + 22);
  fill(225);
  textSize(15);
  text('距离 ∝ 时间的平方', x0 + w / 2, y0 + h + 50);
}

function drawCavendish(massValue, distanceValue) {
  const mass = map(massValue, 0, 1, 1, 4.2);
  const d = map(distanceValue, 0, 1, 170, 92);
  const force = mass / sq(d / 110);
  const twist = constrain(force * 2.2, 1, 12);
  const center = createVector(555, 335);
  const laserSource = createVector(105, 195);
  const screenX = 1060;
  const mirror = rotatedPoint(center, 0, -22, radians(twist));
  const reflection = reflectedLaserSpot(laserSource, mirror, radians(twist), screenX, 135, 540);

  drawCavendishLaser(laserSource, mirror, screenX, reflection.y, twist);
  push();
  translate(center.x, center.y);
  stroke(200);
  strokeWeight(2);
  line(0, -170, 0, 0);
  rotate(radians(twist));
  strokeWeight(8);
  stroke(190, 210, 235);
  line(-125, 0, 125, 0);
  strokeWeight(4);
  line(-28, -22, 28, -22);
  noStroke();
  fill(135, 226, 150);
  circle(-125, 0, 34);
  circle(125, 0, 34);
  fill(104, 166, 240);
  circle(-d, -70, 48 + mass * 5);
  circle(d, 70, 48 + mass * 5);
  pop();
  drawArrow(440, 260, 455, 315, color(255, 212, 96));
  drawArrow(670, 410, 652, 356, color(255, 212, 96));
  drawConclusion('大球轻轻吸小球，镜子转一点；激光把这一点放大成明显光斑。', '光斑偏移 ' + nf(reflection.y - 338, 1, 0) + ' px');
}

function drawCavendishLaser(source, mirror, screenX, spotY, twist) {
  stroke(255, 82, 108);
  strokeWeight(3);
  line(source.x, source.y, mirror.x, mirror.y);
  line(mirror.x, mirror.y, screenX, spotY);
  noStroke();
  fill(255, 82, 108);
  circle(source.x, source.y, 14);
  circle(mirror.x, mirror.y, 10);
  stroke(205, 220, 240);
  strokeWeight(5);
  line(screenX, 135, screenX, 540);
  strokeWeight(1);
  for (let y = 150; y <= 525; y += 25) line(screenX - 16, y, screenX + 16, y);
  stroke(135, 226, 150);
  line(screenX - 28, 338, screenX + 28, 338);
  noStroke();
  fill(255, 82, 108);
  circle(screenX, spotY, 19);
  labelText('激光光斑', screenX - 58, spotY);
  labelText('小镜子', mirror.x, mirror.y - 36);
  labelText('激光器', source.x, source.y + 30);
}

function drawDoubleSlit(waveValue, slitValue) {
  const wavelength = map(waveValue, 0, 1, 16, 44);
  const slit = map(slitValue, 0, 1, 150, 45);
  const screenX = 820;
  const top = 130;
  const bottom = 545;

  stroke(205);
  strokeWeight(7);
  line(250, 105, 250, 310 - slit / 2);
  line(250, 310 + slit / 2, 250, 545);
  line(screenX, top, screenX, bottom);
  drawWaveRings(250, 310 - slit / 2, wavelength);
  drawWaveRings(250, 310 + slit / 2, wavelength);

  noStroke();
  for (let y = top; y < bottom; y += 4) {
    const intensity = doubleSlitIntensity(y, wavelength, slit);
    fill(255 * intensity, 212 * intensity, 70 + 150 * intensity);
    rect(screenX + 12, y, 70, 4);
  }
  for (let i = 0; i < 10; i++) photonHits.push(sampleDoubleSlitHit(wavelength, slit, top, bottom));
  if (photonHits.length > 1200) photonHits.splice(0, photonHits.length - 1200);
  for (const hit of photonHits) {
    fill(255, 235, 145, hit.a);
    circle(screenX + 110 + random(-1, 1), hit.y, hit.r);
  }
  drawConclusion('每个光子落点像随机点，但越积越多后，会自己排成明暗条纹。', '光子数 ' + photonHits.length);
}

function doubleSlitIntensity(y, wavelength, slit) {
  const phase = TWO_PI * abs(y - 338) / max(8, wavelength * 115 / slit);
  return pow(cos(phase / 2), 2) * exp(-sq((y - 338) / 240));
}

function drawFaraday(speedValue, turnsValue) {
  const speed = map(speedValue, 0, 1, 0.5, 5);
  const turns = floor(map(turnsValue, 0, 1, 3, 12));
  const phase = frameCount * 0.025 * speed;
  const magnetX = 155 + (sin(phase) + 1) * 245;
  const signal = cos(phase) * speed * turns / 11;
  const brightness = constrain(abs(signal) / 3.5, 0, 1);

  noFill();
  stroke(104, 166, 240);
  strokeWeight(3);
  for (let i = 0; i < turns; i++) ellipse(600 + i * 7, 330, 76, 210);
  drawFluxLines(magnetX + 55, 330, 600, 330, brightness);
  noStroke();
  fill(226, 75, 82);
  rect(magnetX, 285, 110, 44, 6);
  fill(70, 140, 235);
  rect(magnetX, 329, 110, 44, 6);
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text('N', magnetX + 55, 307);
  text('S', magnetX + 55, 351);
  drawMeter(830, 328, signal);
  drawBulb(1000, 328, brightness);
  drawConclusion('磁铁来回穿过线圈，磁场变化越猛，电流表和灯泡反应越明显。', '电流强度 ' + nf(abs(signal), 1, 2));
}

function drawMichelson(etherValue, angleValue) {
  const angle = map(angleValue, 0, 1, 0, 180);
  const expected = etherValue * sin(radians(angle * 2)) * 42;
  const observed = expected * 0.05;
  const cx = 455;
  const cy = 320;

  stroke(255, 212, 96);
  strokeWeight(4);
  line(120, cy, cx, cy);
  line(cx, cy, 820, cy + observed);
  line(cx, cy, cx + observed, 135);
  stroke(135, 226, 150);
  line(cx, cy, 700, 505);
  noStroke();
  fill(185, 200, 225);
  rect(cx - 10, cy - 34, 20, 68, 4);
  rect(810, cy - 20 + observed, 75, 12);
  rect(cx - 35 + observed, 128, 75, 12);
  drawFringes(150, 470, expected, observed);
  drawComparisonBar(880, 190, expected, observed);
  drawConclusion('如果有以太风，条纹应大幅漂移；实验看到的漂移几乎贴着零。', '实际漂移 ' + nf(abs(observed), 1, 1) + ' 格');
}

function drawFringes(x, y, expected, observed) {
  for (let i = 0; i < 17; i++) {
    const bright = 120 + 100 * sin(i * 1.6 + observed * 0.18);
    fill(bright, bright, 235);
    noStroke();
    rect(x + i * 18, y, 12, 78);
  }
  stroke(255, 90, 90);
  strokeWeight(2);
  line(x + 150 + expected * 0.2, y - 20, x + 150 + expected * 0.2, y + 105);
  labelText('红线是假想应漂移位置', x + 190, y + 122);
}

function drawComparisonBar(x, y, expected, observed) {
  labelText('应有漂移', x, y - 28, LEFT);
  fill(255, 90, 90);
  rect(x, y, constrain(abs(expected) * 4, 2, 180), 24, 4);
  labelText('实际漂移', x, y + 54, LEFT);
  fill(135, 226, 150);
  rect(x, y + 82, constrain(abs(observed) * 4, 2, 180), 24, 4);
}

function drawRutherford(chargeValue, energyValue) {
  const charge = map(chargeValue, 0, 1, 0.8, 3);
  const energy = map(energyValue, 0, 1, 0.7, 3);
  noStroke();
  fill(255, 212, 96);
  circle(520, 330, 38 + charge * 11);
  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text('+', 520, 330);

  for (let i = 0; i < 7; i++) scatterEvents.push(makeScatterEvent(charge, energy));
  if (scatterEvents.length > 230) scatterEvents.splice(0, scatterEvents.length - 230);
  let back = 0;
  let deflect = 0;
  let straight = 0;
  for (const event of scatterEvents) {
    event.age += 1;
    const alpha = map(event.age, 0, 230, 230, 35, true);
    stroke(event.kind === 'back' ? color(255, 95, 95, alpha) : event.kind === 'deflect' ? color(255, 212, 96, alpha) : color(135, 226, 150, alpha));
    strokeWeight(event.kind === 'back' ? 4 : 2);
    noFill();
    beginShape();
    vertex(80, event.y);
    vertex(300, event.y);
    vertex(520, event.mid);
    vertex(event.kind === 'back' ? 250 : 940, event.out);
    endShape();
    if (event.kind === 'back') back += 1;
    else if (event.kind === 'deflect') deflect += 1;
    else straight += 1;
  }
  drawCountBars(880, 190, [['直穿', straight, color(135, 226, 150)], ['偏转', deflect, color(255, 212, 96)], ['反弹', back, color(255, 95, 95)]]);
  drawConclusion('绝大多数粒子直穿，极少数被反弹，说明原子核又小又重。', '反弹数 ' + back);
}

function makeScatterEvent(charge, energy) {
  const y = random(145, 520);
  const closeness = 1 / (abs(y - 330) + 18);
  const strength = charge / energy * closeness * 48;
  let kind = 'straight';
  if (strength > 1.2 && random() < 0.45) kind = 'back';
  else if (strength > 0.42 || random() < 0.10) kind = 'deflect';
  const sign = y < 330 ? -1 : 1;
  const bend = kind === 'back' ? sign * random(100, 190) : kind === 'deflect' ? sign * random(40, 130) : sign * random(0, 12);
  return { y, mid: y + bend * 0.36, out: kind === 'back' ? y - sign * random(90, 180) : y + bend, kind, age: 0 };
}

function drawMillikan(fieldValue, chargeValue) {
  const field = map(fieldValue, 0, 1, 0.4, 1.9);
  const target = round(map(chargeValue, 0, 1, 1, 6));
  stroke(205, 220, 240);
  strokeWeight(5);
  line(110, 145, 760, 145);
  line(110, 505, 760, 505);
  stroke(104, 166, 240, 120);
  strokeWeight(2);
  for (let x = 135; x < 745; x += 38) drawArrow(x, 480, x, 180, color(104, 166, 240, 120));

  for (let q = 1; q <= 6; q++) {
    const yy = 545 - q * 62;
    stroke(83, 100, 128);
    line(820, yy, 1060, yy);
    labelText(q + 'e 台阶', 1088, yy, LEFT);
  }
  for (const drop of oilDrops) {
    const balance = field * drop.q - 3.2;
    const y = constrain(330 - balance * 45 + sin(frameCount * 0.03 + drop.phase) * 10, 165, 485);
    const ladderY = 545 - drop.q * 62;
    noStroke();
    fill(drop.q === target ? color(255, 212, 96) : color(210, 220, 235));
    circle(drop.x, y, drop.r * 2);
    fill(255, 212, 96, drop.q === target ? 220 : 70);
    circle(850 + drop.q * 28 + random(-2, 2), ladderY + random(-3, 3), 8);
  }
  drawConclusion('油滴电荷只落在 1e、2e、3e 这些台阶上，中间没有半格。', '目标油滴 ' + target + 'e');
}

function drawPhotoelectric(freqValue, intensityValue) {
  const threshold = 0.43;
  const photons = floor(map(intensityValue, 0, 1, 5, 18));
  const electrons = freqValue > threshold ? photons : 0;
  stroke(185, 200, 225);
  strokeWeight(5);
  line(560, 145, 560, 530);
  noStroke();
  fill(150, 165, 190);
  rect(530, 145, 60, 385, 6);
  for (let i = 0; i < photons; i++) {
    const y = 170 + i * 19;
    const col = freqValue > threshold ? color(135, 226, 150) : color(255, 95, 95);
    drawArrow(105, y + sin(frameCount * 0.05 + i) * 12, 525, 265 + sin(i) * 130, col);
  }
  for (let i = 0; i < electrons; i++) {
    const x = 615 + (frameCount * (1.5 + freqValue * 4) + i * 42) % 330;
    const y = 175 + (i % 9) * 35;
    fill(255, 212, 96);
    circle(x, y, 11);
  }
  drawThresholdLine(120, 585, 820, threshold, freqValue);
  drawConclusion(freqValue > threshold ? '频率跨过红线，电子立刻飞出；光更强时，电子更多。' : '频率没过红线，光再强也只能照亮金属，打不出电子。', '电子数 ' + electrons);
}

function drawThresholdLine(x, y, w, threshold, freqValue) {
  stroke(205);
  strokeWeight(4);
  line(x, y, x + w, y);
  const tx = x + threshold * w;
  stroke(255, 95, 95);
  line(tx, y - 22, tx, y + 22);
  noStroke();
  fill(freqValue > threshold ? color(135, 226, 150) : color(255, 95, 95));
  circle(x + freqValue * w, y, 18);
  labelText('红线是最低频率', tx + 80, y + 36);
}

function drawSternGerlach(gradientValue, widthValue) {
  const split = map(gradientValue, 0, 1, 25, 130);
  const spread = map(widthValue, 0, 1, 8, 44);
  for (let i = 0; i < 9; i++) spinHits.push({ up: random() > 0.5, x: 835 + random(-22, 22), age: 0 });
  if (spinHits.length > 460) spinHits.splice(0, spinHits.length - 460);

  stroke(255, 212, 96, 140);
  strokeWeight(2);
  for (let i = 0; i < 26; i++) {
    const y0 = 330 + random(-spread, spread);
    const up = i % 2 === 0;
    line(95, y0, 350, y0);
    line(350, y0, 800, 330 + (up ? -split : split) + random(-spread * 0.2, spread * 0.2));
  }
  noStroke();
  fill(104, 166, 240);
  rect(315, 210, 110, 65, 6);
  fill(226, 75, 82);
  rect(315, 385, 110, 65, 6);
  fill(135, 226, 150, 120);
  ellipse(855, 330 - split, 90, 90);
  ellipse(855, 330 + split, 90, 90);
  for (const hit of spinHits) {
    hit.age += 1;
    const y = 330 + (hit.up ? -split : split) + random(-18, 18);
    fill(255, 235, 145, map(hit.age, 0, 460, 230, 35));
    circle(hit.x, y, 4);
  }
  labelText('上束', 950, 330 - split);
  labelText('下束', 950, 330 + split);
  drawConclusion('屏幕上不是一团模糊云，而是清清楚楚分成上、下两堆。', '结果 2 束');
}

function drawBell(angleValue, purityValue) {
  const angle = map(angleValue, 0, 1, 0, 180);
  const purity = map(purityValue, 0, 1, 0.55, 1);
  const quantum = 2 * sqrt(2) * purity * abs(cos(radians(angle / 2)));
  const classical = 2;
  const base = 520;
  const scale = 115;
  stroke(205);
  strokeWeight(2);
  line(150, base, 760, base);
  line(150, base, 150, 165);
  noStroke();
  fill(104, 166, 240);
  rect(285, base - classical * scale, 105, classical * scale);
  fill(135, 226, 150);
  rect(525, base - min(3, quantum) * scale, 105, min(3, quantum) * scale);
  stroke(255, 95, 95);
  strokeWeight(4);
  line(135, base - classical * scale, 790, base - classical * scale);
  labelText('经典上限红线 S=2', 805, base - classical * scale - 24, LEFT);
  labelText('经典', 338, base + 26);
  labelText('量子', 578, base + 26);
  drawEntangledPair(930, 300, angle, purity);
  drawConclusion(quantum > 2 ? '绿色量子柱超过红线，说明纠缠相关比经典规则允许的更强。' : '当前参数还没越过红线，继续调高纠缠纯度或换角度试试。', 'S = ' + nf(quantum, 1, 2));
}

function drawEntangledPair(cx, cy, angle, purity) {
  stroke(135, 226, 150, 130);
  strokeWeight(2);
  for (let i = 0; i < 8; i++) line(cx - 120, cy + sin(frameCount * 0.03 + i) * 14, cx + 120, cy - sin(frameCount * 0.03 + i) * 14);
  noStroke();
  fill(104, 166, 240);
  circle(cx - 135, cy, 38 + purity * 14);
  fill(135, 226, 150);
  circle(cx + 135, cy, 38 + purity * 14);
  stroke(255, 212, 96);
  strokeWeight(4);
  const a = radians(angle);
  line(cx - 135, cy, cx - 135 + cos(a) * 66, cy + sin(a) * 66);
  line(cx + 135, cy, cx + 135 + cos(-a) * 66, cy + sin(-a) * 66);
  labelText('一对纠缠粒子', cx, cy + 112);
}

function drawWaveRings(x, y, wavelength) {
  noFill();
  strokeWeight(1.5);
  for (let r = (frameCount * 1.4) % wavelength; r < 500; r += wavelength) {
    stroke(104, 166, 240, map(r, 0, 500, 170, 18));
    arc(x, y, r * 2, r * 2, -HALF_PI, HALF_PI);
  }
}

function sampleDoubleSlitHit(wavelength, slit, top, bottom) {
  for (let tries = 0; tries < 80; tries++) {
    const y = random(top, bottom);
    const intensity = doubleSlitIntensity(y, wavelength, slit);
    if (random() < intensity) return { y, r: random(1.6, 3), a: random(90, 225) };
  }
  return { y: random(top, bottom), r: 1.5, a: 60 };
}

function drawFluxLines(x1, y1, x2, y2, power) {
  noFill();
  stroke(135, 226, 150, 80 + power * 120);
  strokeWeight(2);
  for (let i = -5; i <= 5; i++) {
    beginShape();
    vertex(x1, y1 + i * 15);
    bezierVertex(x1 + 95, y1 - 75 + i * 10, x2 - 110, y2 + 75 + i * 10, x2, y2 + i * 17);
    endShape();
  }
}

function drawMeter(x, y, signal) {
  push();
  translate(x, y);
  noFill();
  stroke(205);
  strokeWeight(4);
  arc(0, 0, 150, 150, PI, TWO_PI);
  stroke(135, 226, 150);
  const angle = map(constrain(signal, -5, 5), -5, 5, PI, TWO_PI);
  line(0, 0, cos(angle) * 64, sin(angle) * 64);
  noStroke();
  fill(235);
  textSize(16);
  textAlign(CENTER, CENTER);
  text('电流表', 0, 28);
  pop();
}

function drawBulb(x, y, brightness) {
  noStroke();
  fill(255, 212, 96, 70 + brightness * 185);
  circle(x, y, 70 + brightness * 50);
  fill(255, 245, 170);
  circle(x, y, 54);
  fill(20, 28, 42);
  rect(x - 18, y + 30, 36, 32, 5);
  labelText('灯泡', x, y + 88);
}

function drawCountBars(x, y, items) {
  const total = max(1, items.reduce((sum, item) => sum + item[1], 0));
  for (let i = 0; i < items.length; i++) {
    const [label, value, col] = items[i];
    const yy = y + i * 72;
    fill(225);
    noStroke();
    textSize(18);
    textAlign(LEFT, CENTER);
    text(label, x, yy);
    fill(col);
    rect(x + 68, yy - 13, map(value, 0, total, 0, 210), 26, 5);
    fill(255);
    text(value, x + 300, yy);
  }
}

function rotatedPoint(center, localX, localY, angle) {
  return createVector(
    center.x + localX * cos(angle) - localY * sin(angle),
    center.y + localX * sin(angle) + localY * cos(angle)
  );
}

function reflectedLaserSpot(source, mirror, mirrorAngle, screenX, screenTop, screenBottom) {
  const incoming = p5.Vector.sub(mirror, source).normalize();
  const normal = createVector(-sin(mirrorAngle), cos(mirrorAngle));
  const reflected = p5.Vector.sub(incoming, p5.Vector.mult(normal, 2 * incoming.dot(normal))).normalize();
  if (reflected.x < 0.08) reflected.x = 0.08;
  const rawY = mirror.y + reflected.y / reflected.x * (screenX - mirror.x);
  const y = constrain(rawY, screenTop, screenBottom);
  return { y, rawY };
}
