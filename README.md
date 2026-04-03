# GetThere

GetThere 是一个帮助老人和孩子出行的问路卡片生成器，支持：

- 自定义行程步骤（高铁/地铁/公交/出租车/步行/飞机/轮渡/换乘）
- 票务细节展示（车次、时间、检票口、座位等）
- 一键导出图片和 PDF
- 本地存储（不依赖后端）

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 启动开发环境

```bash
npm run dev
```

3. 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

## 上传到 GitHub

如果你还没有初始化仓库，可以按下面操作：

```bash
git init
git add .
git commit -m "feat: init GetThere project"
git branch -M main
git remote add origin https://github.com/ipfamily/GetThere.git
git push -u origin main
```

如果仓库已存在，只需正常提交并推送：

```bash
git add .
git commit -m "chore: update project"
git push
```

## 部署到 GitHub Pages（自动）

本项目已内置工作流文件：`.github/workflows/deploy.yml`。

### 第一次启用步骤

1. 打开 GitHub 仓库页面
2. 进入 `Settings` -> `Pages`
3. 在 `Build and deployment` 里选择 `Source: GitHub Actions`
4. 推送到 `main` 分支后会自动构建并部署


## 部署到其他平台

如果你部署到 Vercel、Netlify、Cloudflare Pages 等，一般不需要额外改动，直接使用 `npm run build` 的 `dist/` 目录即可。

如果部署路径不是根路径，可通过环境变量设置 Vite 的基础路径：

```bash
VITE_BASE_PATH=/your-base-path/ npm run build
```
