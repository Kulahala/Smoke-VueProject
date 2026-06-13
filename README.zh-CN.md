# BestLinksz — B2B 静态商品展示站

一个面向批发买家的静态产品展示站——不做购物车、支付、库存或实时下单。基于 Vue 3 + Vite 构建，通过 Decap CMS 管理内容。

[English](./README.md) | **线上地址：** [bestlinksz.com](https://www.bestlinksz.com/)

## 页面截图

| 首页 | 产品目录 |
|---|---|
| ![首页](docs/home.png) | ![产品目录](docs/catalog.png) |

| 产品详情 | 公司能力 |
|---|---|
| ![产品详情](docs/detail.png) | ![公司能力](docs/company.png) |

## 功能特性

- 多级产品目录，支持分类导航
- 中英双语（EN / 中文），自动检测系统语言
- 深色 / 浅色 / 跟随系统 三种主题
- 邮箱询盘流程（Web3Forms 或 mailto 降级）
- Decap CMS 可视化后台，零代码编辑内容
- SEO 就绪：动态 meta、Open Graph、JSON-LD、sitemap、robots.txt
- 响应式：桌面端和移动端布局
- GitHub Actions 自动将上传的 PNG/JPG 转为 WebP

## 技术栈

| 层级 | 选型 |
|---|---|
| 框架 | Vue 3 (Composition API) |
| 构建 | Vite |
| 样式 | 原生 CSS（自定义属性，无 UI 库） |
| CMS | Decap CMS (git-gateway) |
| 托管 | Netlify（从 `main` 分支自动部署） |
| 图片管线 | GitHub Actions + Sharp (PNG/JPG → WebP) |

## 快速开始

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # 输出到 dist/
npm run preview    # 预览生产构建
```

## 项目结构

```
src/
  views/          # 页面组件（首页、目录、详情、公司、资料）
  components/     # 共享组件（询盘浮窗等）
  composables/    # useSeo、useTheme 等
  store/          # 响应式数据仓库（产品、分类、翻译）
  data/
    products/     # 每个产品一个 JSON 文件（1.json, 2.json, …）
    categories.js # 分类组和层级
    settings.json # 全站设置（邮箱、轮播图、服务说明）
    translations.json  # 所有界面文案（en/zh，扁平 key）
  assets/         # 全局 CSS
public/
  电子烟/          # 产品图片和占位图（WebP + SVG）
  admin/          # Decap CMS 配置和自定义管理界面
```

## 内容编辑

### 通过 CMS 后台（推荐非技术人员使用）

访问线上 `/admin/` 或本地 `localhost:5173/admin/`，通过 Netlify Identity 登录。

后台提供四个编辑区域：
- **Settings（全局设置）** — 询盘邮箱、Web3Forms 密钥、首页轮播大图、服务说明
- **Categories（分类管理）** — 分类层级、分类名、背景大图
- **Products（产品管理）** — 产品名、图片、规格、起订量、交期、排序权重
- **Translations（界面文案）** — 约 150 条中英文界面文字（按钮、标题、流程说明等）

### 通过代码（开发者）

产品数据在 `src/data/products/*.json`，每个文件是一个产品：

```json
{
  "id": 14,
  "name": "New Product Name",
  "nameZh": "新产品中文名称",
  "image": "/电子烟/new-product.webp",
  "images": ["/电子烟/new-product.webp"],
  "category": "pod-systems",
  "description": "Short product description.",
  "descriptionZh": "中文产品说明。",
  "highlights": ["Highlight 1", "Highlight 2"],
  "highlightsZh": ["中文卖点 1", "中文卖点 2"],
  "specs": [{ "label": "Battery", "value": "500 mAh" }],
  "specsZh": [{ "label": "电池", "value": "500 mAh" }],
  "moq": "1000 pcs",
  "moqZh": "1000 件",
  "leadTime": "10-18 days",
  "leadTimeZh": "10-18 天",
  "badge": "OEM Ready",
  "badgeZh": "支持 OEM"
}
```

规则：
- `id` 不能重复（CMS 新建时会自动填充最小可用 ID）
- `category` 必须等于某个二级分类的 `id`（如 `pod-systems`）
- `image` 和 `images` 使用 `public/电子烟/` 里的图片，路径不带 `public`
- `xxxZh` 字段是中文内容，不填则回退显示英文

界面文案在 `src/data/translations.json`（扁平 key 结构，如 `"nav.home"`、`"home.title"`），也可通过 CMS 后台的 Translations 编辑。

分类层级在 `src/data/categories.js` 的 `categoryGroups` 中。`id` 不要用中文和空格，推荐小写英文加 `-`（如 `disposable-vapes`）。新增二级分类后，记得给商品的 `category` 填同一个 `id`。

## 图片规则

- 所有产品图片放 `public/电子烟/`，格式统一用 **WebP**（`placeholders/` 下的 SVG 除外）
- 代码里写路径不带 `public`：`'/电子烟/Product1_1.webp'`
- 上传的 PNG/JPG 原图会在 push 到 `main` 后由 GitHub Actions 自动转为 WebP 并替换引用

### 图片建议

- 首页大图：宽度 1600-2200px，单张 < 500KB
- 商品图：宽度 900-1400px，单张 < 300KB
- 分类背景大图必须是纯净大特写，不含文字和规格图表

## 中英文切换

网站默认英文，顶部有 `EN / 中文` 切换。用户选择后保存在 `localStorage`。

界面文案在 `src/data/translations.json`（扁平 key 结构），商品和分类的中文内容在各数据的 `xxxZh` 字段。

## SEO

- `index.html`：标题、描述、关键词、OG/Twitter 分享信息、初始 JSON-LD
- `src/App.vue`：按页面动态更新标题、描述、canonical、OG 信息和结构化数据
- `public/robots.txt`：允许搜索引擎抓取
- `public/sitemap.xml`：列出首页、分类页、产品页

默认域名是 `https://www.bestlinksz.com/`，换域名时需同步改 `index.html`、`src/App.vue`、`robots.txt`、`sitemap.xml`。

## CMS 本地开发

```sh
# 终端 1：启动本地 CMS 代理
npx decap-server

# 终端 2：启动开发服务器
npm run dev
```

打开 `http://localhost:5173/admin/`，点击绿色 **Login** 按钮即可免密进入。

## 部署

Netlify 从 `main` 分支自动构建部署。推送即部署：

```sh
git push origin main
```

Netlify 已配置 SPA 路由回退（所有路径 → `index.html`）。

### Netlify Identity 激活步骤（用于 CMS 登录）

1. **启用 Identity** — 站点设置 → Identity → Enable
2. **注册设为 Invite only** — 防止外部注册
3. **启用 Git Gateway** — Identity → Services → Git Gateway → Enable
4. **邀请用户** — Identity 标签 → Invite users → 输入邮箱

受邀用户在 `https://你的域名/admin/` 登录即可编辑内容。

## 许可

私有 — 保留所有权利。源代码公开是为了透明和协作，未经书面许可不得再分发或商业使用。