# 科学原理可视化原型项目

面向小初高学生，用自然语言描述科学现象，AI 生成或扩展可交互的 p5.js 动画演示。

## 项目定位

本项目以 **SI 七个基本物理量**（时间 s、长度 m、质量 kg、电流 A、热力学温度 K、物质的量 mol、发光强度 cd）为线索，做一系列**基础实验的可视化模拟**，并以此为台阶，带学生从经典现象逐步走向 **量子力学 / 量子现象** 的直观理解。详见 [docs/vision.md](docs/vision.md)。

## 核心理念

1. 学生用日常语言提问（如“彩虹为什么是弯的？”）。
2. 按模板填写实验要素，得到一段给 AI 的 Prompt。
3. AI 生成 p5.js 动画代码。
4. 学生在浏览器里直接运行、调整参数、观察现象。

## 技术栈

- **p5.js**：浏览器即可运行，擅长动画和交互，代码短、效果直观。
- 可选：参数复杂时可用 **Streamlit (Python)** 做数据交互版。

## 本地预览

本项目是纯静态站点，无需构建。推荐在项目根目录启动一个本地 HTTP 服务：

```powershell
python -m http.server 8080
```

然后打开：

```text
http://127.0.0.1:8080/index.html
```

也可以直接用浏览器打开 `index.html`。

## 项目结构

```
.
├── README.md                      # 项目总览
├── index.html                     # 总览导航页：两个入口可高亮切换
├── library.html                   # 七个基本物理量总结入口
├── docs/
│   ├── getting-started.md         # 学生快速入门
│   ├── workflow.md                # AI Agent 工作流
│   ├── agent-handoff.md           # AI Agent 接手说明
│   ├── vision.md                  # 七个基本物理量到量子现象路线
│   ├── deployment.md              # 部署说明
│   ├── demo-followup-plan.md      # Demo 文案、录屏脚本与后续规划
│   ├── full-experiment-library.md # 七个基本物理量完整实验库规划
│   ├── teaching-guide.md          # 教师使用手册
│   └── templates/
│       ├── experiment-template.md # 实验方案模板
│       └── prompt-template.md     # AI Prompt 模板
├── templates/
│   └── p5js-starter.js            # p5.js 起步代码
└── examples/
    ├── */                         # 七大物理量基础实验，每个目录含 index.html / sketch.js / README.md
    └── top-ten-physics-miracles/  # 独立入口：十大物理神迹导航与模拟
```

## 快速开始

1. 打开 [p5.js Web Editor](https://editor.p5js.org/)。
2. 复制 `templates/p5js-starter.js` 的内容到编辑器。
3. 填写 `docs/templates/experiment-template.md`，生成 Prompt。
4. 将 Prompt 交给 AI，把生成的代码替换进编辑器，点击运行。

## 下一步

- 学生：阅读 [docs/getting-started.md](docs/getting-started.md)。
- 教师：阅读 [docs/teaching-guide.md](docs/teaching-guide.md)。
- Agent 设计：阅读 [docs/workflow.md](docs/workflow.md)。
- Agent 接手：阅读 [docs/agent-handoff.md](docs/agent-handoff.md)。
- 部署发布：阅读 [docs/deployment.md](docs/deployment.md)。
- Demo 跟进：阅读 [docs/demo-followup-plan.md](docs/demo-followup-plan.md)。
- 完整实验库：阅读 [docs/full-experiment-library.md](docs/full-experiment-library.md)。

## 入口组织

首页是总览导航页，保留两个始终可见、可高亮切换的入口：

1. **七大物理量总结**：把基础实验统一整理到 SI 七个基本物理量下，作为系统学习和课程化使用的主入口。
2. **十大物理神迹实验模拟**：独立于七大物理量基础库，用一个可切换的互动展厅总览十个改变物理直觉的经典实验。

点击任一入口后，该入口会高亮，下方内容切换到对应导航预览；两个入口不会消失，可以随时来回切换。完整导航页分别是 `library.html` 和 `examples/top-ten-physics-miracles/index.html`。

七大物理量基础实验完整清单见 [docs/full-experiment-library.md](docs/full-experiment-library.md)。

### 七大物理量总结

- **时间 s**：抛物运动、单摆周期、弹簧振子、波传播、放射性衰变。
- **长度 m**：波长与颜色、双缝干涉、衍射、透镜成像、德布罗意波长。
- **质量 kg**：抛物运动、碰撞与动量守恒、斜面运动、万有引力、质能关系示意。
- **电流 A**：点电荷的电场线、简单电路、通电导线磁场、螺线管磁场、电磁感应。
- **热力学温度 K**：气体分子热运动、热传导、相变、麦克斯韦速度分布、黑体辐射。
- **物质的量 mol**：阿伏伽德罗常数、摩尔质量换算、气体粒子数与压强、化学反应配比、能级布居。
- **发光强度 cd**：距离与亮度平方反比、光的色散、偏振、光电效应、激光与普通光。

### 十大物理神迹独立入口

- **导航页面**：[examples/top-ten-physics-miracles/index.html](examples/top-ten-physics-miracles/index.html)
- **模拟页面**：[examples/top-ten-physics-miracles/simulate.html](examples/top-ten-physics-miracles/simulate.html)
- **包含实验**：伽利略斜面、卡文迪许扭秤、杨氏双缝、法拉第电磁感应、迈克耳孙-莫雷、卢瑟福金箔、密立根油滴、光电效应、斯特恩-盖拉赫、贝尔不等式检验。
