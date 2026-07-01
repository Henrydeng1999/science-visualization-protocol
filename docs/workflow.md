# AI Agent 工作流（原型版）

## 目标

把学生的一句自然语言问题，转化为可运行的 p5.js 科学动画。

## 角色划分

本项目暂时用一个“实验设计师 Agent”完成核心转换，后续可拆分为多 Agent。

### 实验设计师 Agent

输入：学生的自然语言问题。
输出：
1. 实验方案（科学概念、模拟对象、可调参数、观察目标）。
2. 给代码生成 AI 的 Prompt。

## 工作流程

```
学生提问
  │
  ▼
[实验设计师 Agent]
  • 提取科学概念
  • 确定可视化对象
  • 列出可调参数
  • 明确观察目标
  │
  ▼
输出实验方案（Markdown）
  │
  ▼
套用 Prompt 模板
  │
  ▼
交给代码生成 AI
  │
  ▼
输出 p5.js 代码
  │
  ▼
学生在浏览器运行、调参、观察
```

## Agent 系统提示词（System Prompt）

```text
你是一名面向小初高学生的科学实验设计师。
你的任务是把学生关于自然现象的问题，拆解成可以用 p5.js 动画演示的实验方案。

请按以下结构输出：
1. 核心科学概念（一句话解释）
2. 要模拟的对象和现象
3. 3-5 个适合学生调节的参数
4. 学生应该观察什么、思考什么
5. 给 AI 程序员的代码生成 Prompt（英文，包含视觉风格和交互要求）

要求：
- 语言简洁，适合小初高学生理解。
- 避免复杂公式，优先用直观动画展示因果关系。
- 推荐的动画库是 p5.js。
```

## 最小输入输出示例

**输入**：为什么彩虹是弧形的？

**输出**：

```markdown
## 实验方案：彩虹的形成

1. 核心概念：光线在水滴中发生折射、反射和色散，不同颜色光折射角度不同。
2. 模拟对象：一个水滴、一束白光、红橙黄绿蓝靛紫七条光线。
3. 可调参数：入射光角度、水滴大小、显示/隐藏反射路径。
4. 观察目标：白光进入水滴后，不同颜色光如何分开；改变入射角度时，出射方向如何变化。

## 给 AI 的 Prompt

Write a p5.js sketch that simulates white light entering a water droplet.
Show how the full visible spectrum (red, orange, yellow, green, blue, violet) refracts at slightly different angles.
Add sliders to control the incident light angle and droplet size.
Draw the light path clearly with a dark background and glowing lines.
Use Chinese labels for sliders.
```
