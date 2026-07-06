# AI Agent 交接说明

本文面向后续接手本项目的 AI coding agent。目标是让任何 agent 在不了解历史对话的情况下，也能继续扩展、维护和部署本项目。

## 项目一句话

这是一个面向中小学生的科学原理可视化互动原型。项目以 **SI 七个基本物理量** 为主线，用纯静态网页和 p5.js 动画，把抽象物理概念转化为可操作、可观察、可比较的交互实验。

## 当前状态

- 技术形态：纯静态站点，无构建步骤。
- 主要入口：[../index.html](../index.html)
- 当前完成：9 个交互实验页面。
- 长期目标：七个基本物理量 × 每个 5 个实验，形成 35 个交互动画组成的实验库。
- 部署方式：GitHub 仓库连接 Cloudflare Pages 自动部署。
- 当前开发约定：除非用户明确要求“提交 / 推送 / 部署”，否则只做本地修改和本地验证。

## 重要文档

| 文档 | 用途 |
|---|---|
| [../README.md](../README.md) | 项目总览、结构、本地预览、当前示例路线。 |
| [vision.md](vision.md) | 项目定位：从七个基本物理量到量子现象。 |
| [full-experiment-library.md](full-experiment-library.md) | 35 个实验的完整规划和开发优先级。 |
| [workflow.md](workflow.md) | AI Agent 如何把自然语言问题转成实验方案和代码生成 prompt。 |
| [getting-started.md](getting-started.md) | 学生使用说明。 |
| [teaching-guide.md](teaching-guide.md) | 教师课堂使用说明。 |
| [deployment.md](deployment.md) | Cloudflare Pages / Wrangler 部署说明。 |
| [demo-followup-plan.md](demo-followup-plan.md) | Demo 文案、录屏脚本和后续沟通材料。 |

## 文件结构

```text
.
├── index.html
├── README.md
├── wrangler.toml
├── docs/
│   ├── agent-handoff.md
│   ├── deployment.md
│   ├── demo-followup-plan.md
│   ├── full-experiment-library.md
│   ├── getting-started.md
│   ├── teaching-guide.md
│   ├── vision.md
│   ├── workflow.md
│   └── templates/
├── examples/
│   └── <experiment-name>/
│       ├── index.html
│       ├── sketch.js
│       └── README.md
└── templates/
    └── p5js-starter.js
```

## 不要提交的内容

这些内容应保持本地或忽略，不要进入 GitHub：

- `.claude/`
- `CLAUDE.md`
- `demo/`
- `.wrangler/`
- `.vscode/`
- `.idea/`
- `node_modules/`
- 临时日志、录屏、缓存和构建目录

相关规则在 [../.gitignore](../.gitignore)。

## 当前已完成实验

| 顺序 | 路径 | 实验 | 主要物理量 |
|---|---|---|---|
| 1 | `examples/projectile-motion/` | 抛物运动 | 时间 s、质量 kg |
| 2 | `examples/electric-field/` | 点电荷的电场线 | 电流 A |
| 3 | `examples/magnetic-field/` | 不同形状磁铁的磁场 | 电流 A |
| 4 | `examples/light-wave-basics/` | 光是一种波 | 时间 s、长度 m |
| 5 | `examples/visible-spectrum/` | 波长与颜色 | 长度 m、发光强度 cd |
| 6 | `examples/wave-interference/` | 两束光相遇：干涉 | 时间 s、长度 m |
| 7 | `examples/double-slit/` | 双缝干涉 | 长度 m、发光强度 cd |
| 8 | `examples/rainbow-optics/` | 彩虹与光的色散 | 长度 m、发光强度 cd |
| 9 | `examples/blackbody-radiation/` | 黑体辐射与普朗克 | 热力学温度 K |

## 首页信息架构

[../index.html](../index.html) 现在包含这些模块：

1. 顶部项目简介和文档链接。
2. 主操作按钮：开始探索、查看完整实验库规划、进入量子入口。
3. 贯穿七个基本物理量的完整主线。
4. 推荐学习路径。
5. 七个基本物理量实验库。
6. 当前已完成实验分组。

修改首页时要保持：

- 用户能明确看到“进入实验”按钮。
- 已完成实验可以链接到页面。
- 规划中实验不要链接到不存在页面。
- 七个基本物理量的 35 个实验清单要和 `docs/full-experiment-library.md` 保持一致。

## 实验页面结构规范

每个实验目录必须包含：

```text
examples/<experiment-name>/
├── index.html
├── sketch.js
└── README.md
```

### `index.html`

必须包含：

- 中文标题。
- p5.js CDN：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
```

- `<div id="canvas-container"></div>` 作为 p5 canvas 挂载点。
- 右侧或旁侧 HTML 控制面板。
- “原理解析”模块。
- “观察任务”或“生活中的例子”模块。
- 底部 `.lesson-nav` 上一个 / 下一个实验导航。
- `<script src="sketch.js"></script>`。

### `sketch.js`

必须遵守：

- 使用 p5.js。
- `setup()` 中创建 `700 × 500` 画布：

```js
const canvas = createCanvas(700, 500);
canvas.parent('canvas-container');
```

- 控件从 HTML 读取，例如：

```js
select('#wavelength').value()
```

- 滑块或选择器变化后调用 `updateLabels()` 更新显示值。
- 深色背景，优先使用：

```js
background(12, 16, 28);
```

- 动画要优先表达趋势和因果关系，不追求精密仿真。
- 可以放大、简化或近似物理量，但 README 中应说明。

### `README.md`

建议包含：

- 示例标题和编号。
- 关联基本物理量。
- 科学概念。
- 可调参数。
- 观察目标。
- 实现说明。
- 运行方式。

## 新增实验流程

新增一个实验时，按以下步骤做：

1. 在 [full-experiment-library.md](full-experiment-library.md) 中确认实验属于哪个基本物理量。
2. 在 `examples/` 下新建目录。
3. 添加 `index.html`、`sketch.js`、`README.md`。
4. 在首页 `index.html` 对应的“七个基本物理量实验库”中把状态从“规划”改为“已完成”，并添加链接。
5. 如果该实验应进入当前展示分组，也在下方实验卡片区新增卡片。
6. 更新相邻实验页的 `.lesson-nav`。
7. 更新 [README.md](../README.md) 的项目结构和当前路线。
8. 更新 [vision.md](vision.md) 或 [full-experiment-library.md](full-experiment-library.md) 中的状态。
9. 运行本地验证。

## 当前推荐开发优先级

根据完整实验库规划，下一批最适合补：

1. 衍射
2. 偏振
3. 光电效应
4. 距离与亮度平方反比
5. 单摆周期
6. 碰撞与动量守恒
7. 简单电路
8. 通电导线磁场
9. 气体分子热运动
10. 阿伏伽德罗常数

优先建议：

- 如果目标是 Demo 和领导汇报：先做“光电效应、偏振、衍射”。
- 如果目标是补齐七个基本量：先做“单摆周期、碰撞、简单电路、气体分子热运动、阿伏伽德罗常数”。
- 如果目标是课程化：先给所有实验页补“关键结论”和“实验记录表”。

## 本地预览

在项目根目录运行：

```powershell
python -m http.server 8080
```

打开：

```text
http://127.0.0.1:8080/index.html
```

## 验证流程

### 1. JS 语法检查

```powershell
Get-ChildItem -Recurse -Filter *.js examples,templates | ForEach-Object { node --check $_.FullName }
```

### 2. 本地服务检查

```powershell
Invoke-WebRequest -Uri http://127.0.0.1:8080/index.html -UseBasicParsing
```

### 3. 手动浏览器检查

至少检查：

- 首页打开正常。
- 首页所有“进入实验”按钮可点击。
- 每个实验页 canvas 不为空。
- 控制面板滑块和下拉框可操作。
- 上一个 / 下一个实验导航正确。

### 4. 自动浏览器检查

如果可用 Playwright，检查：

- 首页所有链接返回 200。
- 所有示例页存在 `canvas`。
- canvas 尺寸为 `700 × 500`。
- 控制台没有脚本错误。

## Git 和部署约定

默认采用开发模式：

- 允许本地修改。
- 允许本地验证。
- 不要自动提交。
- 不要自动推送。
- 除非用户明确说“提交”“推送”“部署”“发版”。

如果用户要求发版：

```powershell
git status --short
git add -A
git commit -m "<message>"
git push
```

Cloudflare Pages 已连接 GitHub 时，`git push` 会触发自动部署。

## 科学表达原则

- 清晰度优先于数值精确。
- 面向小初高学生，避免过深公式堆叠。
- 可以使用简化模型，但要说明“这是近似”。
- 动画要体现可调参数和观察结果之间的关系。
- 每个页面至少回答：
  - 这个现象是什么？
  - 可以调什么？
  - 调了以后应该看什么？
  - 它和哪个基本物理量有关？
  - 它通向哪个更深的物理概念？

## 常见维护提醒

- 新页面不要只加到 `examples/`，还要同步首页和文档。
- 不要把本地录屏文件提交到仓库。
- 不要恢复 `CLAUDE.md` 到 GitHub。
- 修改导航顺序时，要同步所有相邻页面的 `.lesson-nav`。
- 首页“规划”项不要链接到不存在的页面。
- 如果部署后页面访问旧内容，先检查 Cloudflare Pages 最新部署是否完成。
