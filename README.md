# 科学原理可视化原型项目

面向小初高学生，用自然语言描述科学现象，AI 生成可交互的 p5.js 动画演示。

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
├── docs/
│   ├── getting-started.md         # 学生快速入门
│   ├── workflow.md                # AI Agent 工作流
│   ├── vision.md                  # 七个基本物理量到量子现象路线
│   ├── deployment.md              # 部署说明
│   ├── teaching-guide.md          # 教师使用手册
│   └── templates/
│       ├── experiment-template.md # 实验方案模板
│       └── prompt-template.md     # AI Prompt 模板
├── templates/
│   └── p5js-starter.js            # p5.js 起步代码
└── examples/
    ├── rainbow-optics/            # 示例 1：彩虹折射
    ├── projectile-motion/         # 示例 2：抛物运动
    ├── electric-field/            # 示例 3：电场线
    ├── magnetic-field/            # 示例 4：不同形状磁铁的磁场
    ├── blackbody-radiation/       # 示例 5：黑体辐射与普朗克
    ├── light-wave-basics/         # 示例 6：光是一种波
    ├── visible-spectrum/          # 示例 7：波长与颜色
    └── wave-interference/         # 示例 8：两束光相遇：干涉
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
- 部署发布：阅读 [docs/deployment.md](docs/deployment.md)。

## 当前示例路线

### 经典力学与场

- **抛物运动**：时间、速度、重力与轨迹。
- **点电荷的电场线**：电场方向、距离与力的大小。
- **不同形状磁铁的磁场**：磁极排布如何改变磁感线。

### 光的波动性

- **光是一种波**：波长、频率、振幅与传播。
- **波长与颜色**：可见光谱、频率与单个光子能量。
- **两束光相遇：干涉**：相长、相消与双缝实验前置概念。
- **彩虹与光的色散**：不同波长光在水滴中的折射差异。

### 量子入口

- **黑体辐射与普朗克**：从热辐射曲线进入能量量子化。
