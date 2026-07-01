# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

面向小初高学生的科学原理可视化原型。**项目定位**：以 SI 七个基本物理量（s/m/kg/A/K/mol/cd）为线索的基础实验模拟，作为通向量子力学 / 量子现象直观理解的台阶（见 `docs/vision.md`）。

核心流程：学生用自然语言提问 → 填写实验方案模板 → 生成 AI Prompt → AI 输出 p5.js 动画代码 → 浏览器直接运行。

## 运行方式

无构建步骤，无依赖安装。

- **本地预览**：用浏览器直接打开 `index.html`（某些浏览器因跨域限制需要本地 HTTP 服务器，可用 `python -m http.server 8080` 或 VS Code Live Server）。
- **单个示例**：打开 `examples/<name>/index.html`。
- **p5.js 在线编辑**：将 `templates/p5js-starter.js` 或示例 `sketch.js` 复制到 [editor.p5js.org](https://editor.p5js.org/) 运行。

## 代码架构

### 两种示例模式

**模式 A：纯 p5.js 滑块**（`templates/p5js-starter.js`）  
适合简单原型。滑块在 `setup()` 内用 `createSlider()` 创建，`draw()` 内用 `.value()` 读取。

**模式 B：HTML 控件 + p5.js 画布**（`examples/*/` 中的示例）  
HTML 文件定义 `<input type="range">` 控件，sketch.js 通过 `select('#id').value()` 读取参数。画布通过 `canvas.parent('canvas-container')` 挂载到指定 DOM 节点，不独立全屏。这是示例的标准模式。

### 示例结构规范

每个 `examples/<name>/` 包含：
- `index.html`：页面布局 + HTML 滑块控件 + 引入 p5.js CDN + 引入 sketch.js
- `sketch.js`：p5.js 动画逻辑，画布尺寸固定为 `700 × 500`
- `README.md`：该示例的科学原理说明

画布背景统一使用深色科技风：`background(20, 24, 35)` 或 `background(10, 14, 26)`。

### AI Agent 工作流

`docs/workflow.md` 定义了"实验设计师 Agent"的系统提示词和输入输出格式——核心是将自然语言问题拆解为「科学概念 + 可视化对象 + 可调参数 + 观察目标 + 代码生成 Prompt」五个部分，再交给代码生成 AI。

### 文档与模板

- `docs/templates/experiment-template.md`：学生填写的实验方案模板（Markdown 填空格式）
- `docs/templates/prompt-template.md`：将实验方案转化为代码生成 Prompt 的模板，固定要求输出纯 p5.js（不额外生成 HTML）、深色背景、中文滑块标签
- `docs/vision.md`：七个基本物理量到量子现象的路线图，新增示例应优先对齐这条路线。

## 新增示例的惯例

1. 在 `examples/` 下新建目录，包含 `index.html`、`sketch.js`、`README.md`。
2. `index.html` 中 HTML 滑块 `id` 需与 `sketch.js` 中 `select('#id')` 保持一致。
3. `sketch.js` 中 `setup()` 末尾调用 `updateLabels()` 初始化显示值；每个滑块绑定 `.input(updateLabels)` 事件。
4. 在根目录 `index.html` 的 `.experiment-list` 中添加入口链接。
5. 在 `README.md` 和 `docs/vision.md` 中同步示例路线，避免首页、文档和实际目录脱节。
