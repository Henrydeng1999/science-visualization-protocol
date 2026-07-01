// 光是一种波：用横波演示波长、频率、振幅与传播

function setup() {
  const canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');

  select('#wavelength').input(updateLabels);
  select('#frequency').input(updateLabels);
  select('#amplitude').input(updateLabels);
  select('#show-guides').changed(updateLabels);
  updateLabels();
}

function updateLabels() {
  select('#wavelength-value').html(select('#wavelength').value() + ' px');
  select('#frequency-value').html(Number(select('#frequency').value()).toFixed(1) + ' 倍');
  select('#amplitude-value').html(select('#amplitude').value() + ' px');
}

function draw() {
  background(12, 16, 28);

  const wavelength = parseFloat(select('#wavelength').value());
  const frequency = parseFloat(select('#frequency').value());
  const amplitude = parseFloat(select('#amplitude').value());
  const showGuides = select('#show-guides').elt.checked;
  const midY = height / 2;
  const left = 52;
  const right = width - 46;
  const phase = frameCount * 0.045 * frequency;

  drawGrid(midY, left, right);
  drawWave(midY, left, right, wavelength, amplitude, phase);
  drawWaveParticles(midY, left, right, wavelength, amplitude, phase);

  if (showGuides) {
    drawWavelengthGuide(midY, left, wavelength);
  }

  drawPropagationArrow();
  drawReadout(wavelength, frequency, amplitude);
}

function drawGrid(midY, left, right) {
  stroke(42, 53, 76);
  strokeWeight(1);
  for (let y = 90; y <= height - 90; y += 40) {
    line(left, y, right, y);
  }
  for (let x = left; x <= right; x += 50) {
    line(x, 88, x, height - 88);
  }
  stroke(125, 145, 175);
  strokeWeight(1.5);
  line(left, midY, right, midY);
  noStroke();
  fill(150, 165, 190);
  textSize(12);
  text('平衡位置', left, midY - 8);
}

function drawWave(midY, left, right, wavelength, amplitude, phase) {
  noFill();
  stroke(95, 190, 255);
  strokeWeight(4);
  beginShape();
  for (let x = left; x <= right; x += 2) {
    const y = midY + amplitude * sin(TWO_PI * (x - left) / wavelength - phase);
    vertex(x, y);
  }
  endShape();

  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = 'rgba(88,166,255,0.55)';
  stroke(170, 230, 255, 130);
  strokeWeight(1.5);
  beginShape();
  for (let x = left; x <= right; x += 3) {
    const y = midY + amplitude * sin(TWO_PI * (x - left) / wavelength - phase);
    vertex(x, y);
  }
  endShape();
  drawingContext.shadowBlur = 0;
}

function drawWaveParticles(midY, left, right, wavelength, amplitude, phase) {
  noStroke();
  fill(255, 215, 110);
  for (let x = left + 20; x <= right; x += 58) {
    const y = midY + amplitude * sin(TWO_PI * (x - left) / wavelength - phase);
    circle(x, y, 7);
  }
}

function drawWavelengthGuide(midY, left, wavelength) {
  const x1 = left + 40;
  const x2 = x1 + wavelength;
  const y = midY + 142;

  stroke(255, 210, 90);
  strokeWeight(2);
  line(x1, y, x2, y);
  line(x1, y - 8, x1, y + 8);
  line(x2, y - 8, x2, y + 8);
  noStroke();
  fill(255, 220, 115);
  textAlign(CENTER, BOTTOM);
  textSize(13);
  text('一个波长 λ', (x1 + x2) / 2, y - 8);
  textAlign(LEFT, BASELINE);
}

function drawPropagationArrow() {
  const x = width - 154;
  const y = 54;
  stroke(120, 240, 170);
  strokeWeight(3);
  line(x, y, x + 86, y);
  noStroke();
  fill(120, 240, 170);
  triangle(x + 86, y, x + 72, y - 7, x + 72, y + 7);
  fill(180, 230, 200);
  textSize(13);
  text('传播方向', x - 2, y - 12);
}

function drawReadout(wavelength, frequency, amplitude) {
  noStroke();
  fill(220);
  textSize(13);
  text('关系提示：波速 v = λ × f。这里为了观察方便，传播速度按视觉比例演示。', 24, height - 34);
  fill(155, 170, 195);
  text('λ = ' + wavelength.toFixed(0) + ' px    f = ' + frequency.toFixed(1) + ' 倍    A = ' + amplitude.toFixed(0) + ' px', 24, height - 14);
}

