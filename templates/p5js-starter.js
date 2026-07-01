// p5.js 起步模板
// 复制到 https://editor.p5js.org/ 即可运行

let slider1;

function setup() {
  createCanvas(800, 500);
  
  // 创建一个滑块：最小值，最大值，默认值，步长
  slider1 = createSlider(0, 100, 50, 1);
  slider1.position(20, 20);
}

function draw() {
  background(20, 24, 35);
  
  // 读取滑块值
  let value = slider1.value();
  
  // 绘制提示文字
  fill(255);
  noStroke();
  textSize(16);
  text("参数 1：" + value, 160, 35);
  
  // 在中间画一个圆，大小随滑块变化
  fill(100, 180, 255);
  circle(width / 2, height / 2, value * 2);
}
