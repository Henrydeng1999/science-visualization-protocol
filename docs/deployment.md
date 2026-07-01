# 部署说明

本项目是纯静态站点，无构建步骤，可以直接部署到 Cloudflare Pages、GitHub Pages 或任意静态网站服务。

## 本地预览

在项目根目录运行：

```powershell
python -m http.server 8080
```

然后打开：

```text
http://127.0.0.1:8080/index.html
```

也可以直接双击 `index.html` 打开。使用本地 HTTP 服务器更接近真实部署环境。

## Cloudflare Pages：连接 GitHub 仓库

推荐方式是把本项目推送到 GitHub，然后在 Cloudflare Pages 连接仓库。

Cloudflare Pages 配置：

```text
Framework preset: None
Build command: 留空
Build output directory: /
Root directory: /
```

部署完成后，Cloudflare 会生成一个类似下面的地址：

```text
https://science-visualization-protocol.pages.dev
```

## Cloudflare Pages：Wrangler 命令行

本仓库包含 `wrangler.toml`，也可以用 Wrangler 直接部署。

首次使用时登录 Cloudflare：

```powershell
npx wrangler login
```

部署：

```powershell
npx wrangler pages deploy . --project-name science-visualization-protocol
```

## 发布前检查

建议发布前确认：

- 首页所有示例链接可以打开。
- 每个示例页面都能加载 p5.js。
- 画布不是空白。
- 新增示例目录都包含 `index.html`、`sketch.js`、`README.md`。
