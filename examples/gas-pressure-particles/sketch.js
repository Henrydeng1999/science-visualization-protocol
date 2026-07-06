// 气体粒子数与压强
// 自动生成的 p5.js 交互演示：清晰趋势优先于精密仿真。
function readParams(){return {particles: parseFloat(select('#particles').value()),temperature: parseFloat(select('#temperature').value()),volume: parseFloat(select('#volume').value())};}
function setupControls(){select('#particles').input(updateLabels);select('#temperature').input(updateLabels);select('#volume').input(updateLabels);}
function updateLabels(){select('#particles-value').html(select('#particles').value() + '');select('#temperature-value').html(select('#temperature').value() + ' K');select('#volume-value').html(select('#volume').value() + '');}

function setup(){ const canvas=createCanvas(700,500); canvas.parent('canvas-container'); setupControls(); updateLabels(); }
function draw(){ const p=readParams(); background(12,16,28); drawFrame('气体粒子数与压强', '物质的量 mol · 热力学温度 K'); drawScene(p); }
function drawFrame(title, qty){ noStroke(); fill(230); textSize(17); text(title,24,30); fill(150,165,190); textSize(12); text('关联基本量：'+qty,24,50); stroke(45,56,78); strokeWeight(1); for(let x=40;x<660;x+=40) line(x,80,x,430); for(let y=80;y<430;y+=35) line(40,y,660,y); }
function drawScene(p){
  const k='gaspressure';
  if(k==='pendulum') return drawPendulum(p);
  if(k==='spring') return drawSpring(p);
  if(k==='decay') return drawDecay(p);
  if(k==='diffraction') return drawDiffraction(p);
  if(k==='lens') return drawLens(p);
  if(k==='debroglie') return drawDebroglie(p);
  if(k==='collision') return drawCollision(p);
  if(k==='incline') return drawIncline(p);
  if(k==='gravity') return drawGravity(p);
  if(k==='massenergy') return drawMassEnergy(p);
  if(k==='circuit') return drawCircuit(p);
  if(k==='wirefield') return drawWireField(p);
  if(k==='solenoid') return drawSolenoid(p);
  if(k==='induction') return drawInduction(p);
  if(k==='gas') return drawGas(p);
  if(k==='conduction') return drawConduction(p);
  if(k==='phase') return drawPhase(p);
  if(k==='maxwell') return drawMaxwell(p);
  if(k==='avogadro') return drawAvogadro(p);
  if(k==='molarmass') return drawMolarMass(p);
  if(k==='gaspressure') return drawGasPressure(p);
  if(k==='stoich') return drawStoich(p);
  if(k==='levels') return drawLevels(p);
  if(k==='inverselight') return drawInverseLight(p);
  if(k==='polarization') return drawPolarization(p);
  if(k==='photoelectric') return drawPhotoelectric(p);
  if(k==='laser') return drawLaser(p);
}
function caption(lines){ noStroke(); fill(210); textSize(13); lines.forEach((s,i)=>text(s,24,455+i*18)); }
function drawPendulum(p){ const pivot=createVector(350,110), L=p.length*1.7, T=TWO_PI*sqrt(p.length/max(p.gravity,0.1)), a=radians(p.angle)*cos(frameCount*0.035/T*6); const bob=createVector(pivot.x+L*sin(a), pivot.y+L*cos(a)); stroke(220); strokeWeight(2); line(pivot.x,pivot.y,bob.x,bob.y); fill(255,210,100); circle(bob.x,bob.y,34); caption(['周期 T ≈ 2π√(L/g) = '+T.toFixed(2)+' s','摆长变长，周期变长；重力变大，周期变短。']); }
function drawSpring(p){ const mid=350, y=240, omega=sqrt(p.stiffness/p.mass), x=mid+p.amplitude*cos(frameCount*0.05*omega); stroke(100,190,255); strokeWeight(3); noFill(); beginShape(); for(let i=0;i<30;i++){ vertex(120+i*(x-120)/29, y+sin(i*PI)*22); } endShape(); fill(255,200,90); rect(x,y-30,60,60,8); caption(['周期趋势 T ∝ √(m/k)','质量越大振得越慢，弹簧越硬振得越快。']); }
function drawDecay(p){ const t=(frameCount%360)/36, remain=p.atoms*pow(0.5,t/p.halfLife); fill(110,220,150); noStroke(); for(let i=0;i<remain;i++){ circle(80+(i%18)*28,110+floor(i/18)*28,9); } stroke(255,210,100); noFill(); beginShape(); for(let x=0;x<520;x++){ const tt=x/52; vertex(90+x,400-p.atoms*1.7*pow(0.5,tt/p.halfLife)); } endShape(); caption(['剩余粒子数 ≈ N₀·(1/2)^(t/T₁/₂)','半衰期越短，衰减越快。']); }
function drawDiffraction(p){ const slitX=260, screenX=560, cy=250; stroke(170); strokeWeight(6); line(slitX,80,slitX,cy-p.slit/2); line(slitX,cy+p.slit/2,slitX,420); stroke(120,200,255,90); noFill(); for(let r=(frameCount%p.wavelength);r<330;r+=p.wavelength) arc(slitX,cy,r*2,r*2,-HALF_PI,HALF_PI); noStroke(); for(let y=90;y<410;y+=3){ let theta=atan((y-cy)/p.distance), beta=PI*p.slit*sin(theta)/p.wavelength, I=beta===0?1:pow(sin(beta)/beta,2); fill(255*I,220*I,80); rect(screenX,y,48,3); } caption(['狭缝越窄或波长越长，衍射越明显。','屏幕上的亮暗来自不同方向的波叠加。']); }
function drawLens(p){ const lensX=350, axis=250, objX=lensX-p.object, h=p.height, f=p.focal; const v=1/(1/f-1/p.object), imgX=lensX+v, imgH=-v/p.object*h; stroke(130,180,255); line(60,axis,640,axis); stroke(100,220,255); strokeWeight(4); line(lensX,90,lensX,410); drawArrow(objX,axis,objX,axis-h,color(255,210,100)); if(v>0&&v<3000) drawArrow(imgX,axis,imgX,axis+imgH,color(120,240,170)); stroke(255,150,120); line(objX,axis-h,lensX,axis-h); line(lensX,axis-h,imgX,axis+imgH); caption(['透镜公式：1/f = 1/u + 1/v','改变焦距和物距，观察像的位置和大小。']); }
function drawDebroglie(p){ const lambda=360/(p.mass*p.speed); stroke(120,220,255); noFill(); beginShape(); for(let x=70;x<640;x+=2) vertex(x,250+70*sin((x-70)/max(lambda,2))); endShape(); fill(255,210,100); circle(120+frameCount%460,250,16); caption(['德布罗意关系：λ = h/p，本页用相对尺度演示。','质量或速度越大，动量越大，波长越短。']); }
function drawCollision(p){ const t=(frameCount%180)/180, x1=140+210*t, x2=560-160*t, v2=(p.m1*p.v1*p.elastic)/(p.m2+p.m1); fill(255,200,90); circle(x1,250,22+p.m1*3); fill(120,200,255); circle(x2,250,22+p.m2*3); stroke(200); line(80,310,620,310); caption(['总动量 p = m₁v₁ + m₂v₂ 近似守恒。','质量越大，碰撞后速度变化通常越不明显。']); }
function drawIncline(p){ const a=radians(p.angle), base=createVector(150,360), top=createVector(550,360-400*tan(a)); stroke(180); strokeWeight(3); line(base.x,base.y,top.x,top.y); const acc=max(0,9.8*(sin(a)-p.friction*cos(a))); const s=(frameCount%180)/180, x=lerp(top.x,base.x,s*s), y=lerp(top.y,base.y,s*s); fill(255,210,100); rect(x-18,y-18,36,36,6); caption(['加速度趋势：a ≈ g(sinθ - μcosθ) = '+acc.toFixed(2),'坡度越大越容易下滑，摩擦越大越难下滑。']); }
function drawGravity(p){ const r=p.distance, c1=createVector(350-r/2,250), c2=createVector(350+r/2,250), F=p.m1*p.m2/(r*r)*1200; fill(255,210,100); circle(c1.x,c1.y,20+p.m1); fill(120,200,255); circle(c2.x,c2.y,20+p.m2); stroke(120,240,170); strokeWeight(3); line(c1.x,c1.y,c1.x+F*40,c1.y); line(c2.x,c2.y,c2.x-F*40,c2.y); caption(['引力趋势：F ∝ M₁M₂/r²','质量越大引力越强，距离越远引力迅速减小。']); }
function drawMassEnergy(p){ const E=p.mass*p.scale*p.scale; fill(255,210,100); rect(90,330-p.mass*2,120,p.mass*2,8); fill(120,240,170); rect(300,330-min(E,260),240,min(E,260),8); fill(220); text('质量变化',105,355); text('对应能量',375,355); caption(['质能关系：E = mc²。这里用相对尺度展示能量量级。','少量质量变化可以对应很大的能量。']); }
function drawCircuit(p){ const I=p.voltage/p.resistance; stroke(200); strokeWeight(4); noFill(); rect(160,150,380,200,18); fill(255,210,100); rect(210,135,70,30); fill(120,200,255); rect(420,135,80,30); for(let i=0;i<I*18;i++){ fill(120,240,170); circle(170+(i*31+frameCount*3)%360,250,6); } caption(['欧姆定律：I = U/R = '+I.toFixed(2)+' A','电压越高电流越大，电阻越大电流越小。']); }
function drawWireField(p){ const dir=p.direction<0.5?1:-1; translate(350,250); stroke(120,200,255); noFill(); for(let r=35;r<190;r+=28){ ellipse(0,0,r*2,r*2); drawArrow(r/sqrt(2),dir*r/sqrt(2),r/sqrt(2)-dir*10,dir*r/sqrt(2)+10,color(120,240,170)); } fill(255,210,100); circle(0,0,36); fill(20); textAlign(CENTER,CENTER); text(dir>0?'⊙':'⊗',0,1); textAlign(LEFT,BASELINE); resetMatrix(); caption(['通电导线周围磁场呈环形。','电流方向反转，磁场环绕方向也反转。']); }
function drawSolenoid(p){ stroke(120,200,255); noFill(); for(let i=0;i<p.turns;i++){ const x=180+i*(p.length/p.turns); ellipse(x,250,36,120); } stroke(120,240,170); strokeWeight(3); for(let y=210;y<=290;y+=20) line(170,y,530,y); caption(['螺线管内部磁场较集中。','电流和匝数越大，磁场越强。']); }
function drawInduction(p){ const coilX=420, magnetX=130+(frameCount*p.speed)%420; stroke(120,200,255); noFill(); for(let i=0;i<p.turns;i++) ellipse(coilX+i*3,250,40,135); fill(255,80,80); rect(magnetX,225,48,50); fill(255); text('N',magnetX+16,255); const induced=p.speed*p.turns*p.field/20; stroke(120,240,170); strokeWeight(3); line(500,250,500,250-induced*20); caption(['感应强度趋势 ∝ 磁场变化速度 × 匝数。','磁铁运动越快，感应电流越明显。']); }
function drawGas(p){ const box=map(p.volume,180,360,220,380), x0=350-box/2,y0=250-box/2; noFill(); stroke(180); rect(x0,y0,box,box); noStroke(); for(let i=0;i<p.particles;i++){ const x=x0+15+((i*37+frameCount*p.temperature/60)%(box-30)); const y=y0+15+((i*53+frameCount*p.temperature/85)%(box-30)); fill(120,200,255); circle(x,y,5); } caption(['温度越高，分子热运动越剧烈。','大量无规则运动形成宏观温度和压强。']); }
function drawConduction(p){ const n=36; noStroke(); for(let i=0;i<n;i++){ const mix=i/(n-1), temp=lerp(p.hot,p.cold,mix); fill(map(temp,0,180,50,255),80,map(temp,0,180,255,50)); rect(80+i*15,200,15,90); } caption(['热量从高温端传向低温端。','导热率越高，温度分布越快趋于平缓。']); }
function drawPhase(p){ const T=min(130, p.time*p.power/(p.mass*2)); let temp=T<35?T:T<75?35:T-40; stroke(255,210,100); noFill(); beginShape(); for(let x=0;x<500;x++){ let tt=x/5, tv=min(130,tt*p.power/(p.mass*2)); let yy=tv<35?tv:tv<75?35:tv-40; vertex(100+x,380-yy*2); } endShape(); fill(120,200,255); textSize(24); text(temp<35?'固态':temp<75?'相变中':'液态/气态',300,190); caption(['相变时持续吸热，但温度可能保持平台。','平台段体现能量用于改变物质状态。']); }
function drawMaxwell(p){ const peak=sqrt(p.temperature/p.mass); noFill(); stroke(120,240,170); strokeWeight(3); beginShape(); for(let x=0;x<520;x++){ const v=x/70, y=pow(v,2)*exp(-v*v/(peak*peak))*180; vertex(80+x,390-y); } endShape(); caption(['速度分布随温度升高向高速移动。','分子质量越大，同温下速度分布越偏低。']); }
function drawAvogadro(p){ const count=min(220, floor(p.moles*60)); noStroke(); for(let i=0;i<count;i++){ fill(120,200,255,170); circle(90+(i%22)*24,120+floor(i/22)*24,4+p.scale/2); } caption(['真实 1 mol ≈ 6.02×10²³ 个粒子。','本页用缩放点阵建立“极大量粒子”的直觉。']); }
function drawMolarMass(p){ const n=p.mass/p.molar; fill(255,210,100); rect(120,330-p.mass,120,p.mass,8); fill(120,240,170); rect(360,330-min(n*70,240),120,min(n*70,240),8); caption(['n = m/M = '+n.toFixed(2)+' mol','同样质量下，摩尔质量越大，物质的量越小。']); }
function drawGasPressure(p){ const pressure=p.particles*p.temperature/p.volume/20; fill(120,200,255,150); rect(190,120,320,240); for(let i=0;i<p.particles;i++){ fill(255,210,100); circle(205+((i*31+frameCount*p.temperature/60)%290),135+((i*47+frameCount*p.temperature/80)%210),4); } stroke(255,120,120); strokeWeight(5); line(530,350,530,350-pressure*120); caption(['压强趋势：P ∝ NT/V','粒子越多、温度越高、体积越小，压强越大。']); }
function drawStoich(p){ const product=min(p.a/2,p.b/1), excessA=max(0,p.a-2*product), excessB=max(0,p.b-product); fill(255,120,120); rect(90,350-p.a*10,90,p.a*10); fill(120,200,255); rect(220,350-p.b*10,90,p.b*10); fill(120,240,170); rect(390,350-product*20,130,product*20); caption(['示例反应：2A + B → 产物。产物 = '+product.toFixed(1),'过量 A：'+excessA.toFixed(1)+'，过量 B：'+excessB.toFixed(1)]); }
function drawLevels(p){ const pops=[]; let sum=0; for(let i=0;i<5;i++){ const val=exp(-i*p.gap/(p.temperature/300)); pops.push(val); sum+=val; } for(let i=0;i<5;i++){ const h=pops[i]/sum*p.particles*2; fill(120,200+i*10,255-i*30); rect(120+i*100,380-h,60,h); fill(180); text('E'+i,135+i*100,405); } caption(['温度越高，高能级占据比例越大。','能级间隔越大，高能级越难被占据。']); }
function drawInverseLight(p){ const brightness=p.intensity/(p.distance*p.distance)*6000; fill(255,230,120); circle(160,250,32); noFill(); stroke(255,230,120,70); for(let r=40;r<p.distance;r+=35) circle(160,250,r*2); fill(255,230,120,constrain(brightness*255,20,255)); rect(160+p.distance,170,90,160); caption(['照度趋势：E ∝ I/r²','距离越远，单位面积接收到的光越少。']); }
function drawPolarization(p){ const trans=p.intensity*pow(cos(radians(p.angle)),2); stroke(120,200,255); for(let y=120;y<380;y+=22) line(100,y,260,y+20*sin(frameCount*0.05+y)); push(); translate(350,250); rotate(radians(p.angle)); stroke(220); for(let x=-70;x<=70;x+=15) line(x,-100,x,100); pop(); fill(255,230,120,trans*2.55); rect(470,160,100,180); caption(['马吕斯定律：I = I₀cos²θ，透过强度 ≈ '+trans.toFixed(1),'两个偏振方向越接近垂直，透过越暗。']); }
function drawPhotoelectric(p){ const energy=p.frequency, excess=energy-p.work; fill(255,230,120); rect(80,180,170,80); fill(170); rect(360,210,180,70); if(excess>0){ for(let i=0;i<p.intensity/10;i++){ fill(120,240,170); circle(360+frameCount*2+i*18%180,190-i*7,7); } } caption([excess>0?'频率超过阈值：电子逸出':'频率低于阈值：没有电子逸出','光强影响电子数量，频率决定单个光子能量。']); }
function drawLaser(p){ const laserY=210, normalY=310; stroke(120,240,170); strokeWeight(3); for(let i=0;i<8;i++) line(100,laserY+i*3,590,laserY+i*3+sin(frameCount*0.03+i)*p.spread/6); stroke(255,210,100,130); for(let i=0;i<18;i++) line(100,normalY,590,normalY+random(-p.spread*2,p.spread*2)); fill(220); noStroke(); text('激光：方向集中、相干性高',100,180); text('普通光：方向和波长更分散',100,350); caption(['相干性越高、发散角越小，越接近激光特征。','波长分散越大，光源越不单色。']); }
function drawArrow(x1,y1,x2,y2,c){ stroke(c); strokeWeight(3); line(x1,y1,x2,y2); noStroke(); fill(c); circle(x2,y2,7); }
