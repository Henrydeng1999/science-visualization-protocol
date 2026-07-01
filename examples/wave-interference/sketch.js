// 两束光相遇：用两列正弦波的叠加演示相长与相消干涉

function setup() {
  const canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');

  select('#phase').input(updateLabels);
  select('#wavelength').input(updateLabels);
  select('#amplitude').input(updateLabels);
  select('#show-components').changed(updateLabels);
  select('#constructive').mousePressed(() => {
    select('#phase').value(0);
    updateLabels();
  });
  select('#destructive').mousePressed(() => {
    select('#phase').value(180);
    updateLabels();
  });
  updateLabels();
}

function updateLabels() {
  select('#phase-value').html(select('#phase').value() + '°');
  select('#wavelength-value').html(select('#wavelength').value() + ' px');
  select('#amplitude-value').html(select('#amplitude').value() + ' px');
}

function draw() {
  background(12, 16, 28);

  const phaseDiff = radians(parseFloat(select('#phase').value()));
  const wavelength = parseFloat(select('#wavelength').value());
  const amplitude = parseFloat(select('#amplitude').value());
  const showComponents = select('#show-components').elt.checked;
  const phase = frameCount * 0.04;

  const left = 56;
  const right = width - 46;

  if (showComponents) {
    drawWaveRow(left, right, 118, wavelength, amplitude, phase, 0, color(90, 190, 255), '波 A');
    drawWaveRow(left, right, 222, wavelength, amplitude, phase, phaseDiff, color(255, 130, 120), '波 B');
  } else {
    drawMutedRow(left, right, 118, '隐藏原始波 A');
    drawMutedRow(left, right, 222, '隐藏原始波 B');
  }

  drawCombinedWave(left, right, 346, wavelength, amplitude, phase, phaseDiff);
  drawInterferenceBadge(phaseDiff);
}

function drawWaveRow(left, right, midY, wavelength, amplitude, phase, offset, c, label) {
  drawRowAxis(left, right, midY, label);
  noFill();
  stroke(c);
  strokeWeight(3);
  beginShape();
  for (let x = left; x <= right; x += 2) {
    const y = midY + amplitude * sin(TWO_PI * (x - left) / wavelength - phase + offset);
    vertex(x, y);
  }
  endShape();
}

function drawCombinedWave(left, right, midY, wavelength, amplitude, phase, phaseDiff) {
  drawRowAxis(left, right, midY, '合成波 A + B');

  let maxAmp = 0;
  noFill();
  stroke(130, 245, 175);
  strokeWeight(4);
  beginShape();
  for (let x = left; x <= right; x += 2) {
    const a = amplitude * sin(TWO_PI * (x - left) / wavelength - phase);
    const b = amplitude * sin(TWO_PI * (x - left) / wavelength - phase + phaseDiff);
    const sum = a + b;
    maxAmp = max(maxAmp, abs(sum));
    vertex(x, midY + sum);
  }
  endShape();

  noStroke();
  fill(180, 225, 195);
  textSize(12);
  text('当前最大振幅约 ' + maxAmp.toFixed(0) + ' px', left, midY + 72);
}

function drawRowAxis(left, right, midY, label) {
  stroke(42, 53, 76);
  strokeWeight(1);
  line(left, midY - 48, right, midY - 48);
  line(left, midY + 48, right, midY + 48);
  stroke(115, 132, 160);
  line(left, midY, right, midY);
  noStroke();
  fill(185, 198, 220);
  textSize(13);
  text(label, left, midY - 56);
}

function drawMutedRow(left, right, midY, label) {
  drawRowAxis(left, right, midY, label);
  noStroke();
  fill(100, 115, 140);
  textSize(12);
  text('勾选右侧开关可显示这一列波', left + 140, midY - 56);
}

function drawInterferenceBadge(phaseDiff) {
  const deg = degrees(phaseDiff);
  let title = '部分干涉';
  let detail = '合成波介于增强和抵消之间';
  let c = color(255, 210, 110);

  if (abs(deg) < 8 || abs(deg - 360) < 8) {
    title = '相长干涉';
    detail = '波峰遇波峰，合成振幅最大';
    c = color(120, 240, 170);
  } else if (abs(deg - 180) < 8) {
    title = '相消干涉';
    detail = '波峰遇波谷，振动互相抵消';
    c = color(255, 130, 120);
  }

  noStroke();
  fill(24, 31, 46);
  rect(width - 226, 24, 198, 58, 8);
  fill(c);
  textSize(15);
  text(title, width - 210, 48);
  fill(178, 192, 215);
  textSize(12);
  text(detail, width - 210, 68);
}

