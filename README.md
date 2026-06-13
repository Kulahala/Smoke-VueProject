# BestLinksz B2B 静态商品展示站

这是一个 Vue 3 + Vite 的静态商品展示网站，定位是 ToB 批发目录站：客户浏览产品、分类、规格和交付信息，通过邮箱发起询盘，不做购物车、支付、库存和实时下单。

## 怎么运行

```sh
npm install
npm run dev
```

构建正式文件：

```sh
npm run build
```

构建结果在 `dist/` 文件夹。

## 小白改内容，只看这里

主要改一个文件：

```txt
src/store/index.js
```

图片放这里：

```txt
public/电子烟/
```

网页里写图片路径时，格式是：

```js
image: '/电子烟/你的图片名.jpg'
```

注意前面有 `/电子烟/`，不要写 `public`。

## 修改邮箱

打开 `src/store/index.js`，改这一行：

```js
export const inquiryEmail = 'benson.lee@bestlinksz.com';
```

改成你的接单邮箱即可。所有按钮、页脚和详情页询盘邮件都会自动跟着改。

## 修改首页大图

打开 `src/store/index.js`，找到：

```js
export const heroSlides = [
  {
    image: '/电子烟/placeholders/pod-slim.svg',
    title: 'Wholesale vape catalogue',
    titleZh: '批发电子烟产品目录',
  },
];
```

把 `image` 换成新图片路径。首页大图会优先加载，建议用压缩后的 JPG/WebP，不要直接上传特别大的原图。

## 当前占位图说明

现在商品图使用的是项目内生成的轻量 SVG 占位图，目录在：

```txt
public/电子烟/placeholders/
```

这些图不是最终真实 SKU，只是为了让网站在没有完整商品图时也能先完整展示。优点是加载很快、风格统一、没有外部版权依赖。

后面有真实产品图时，只需要把商品里的 `image` 改成真实图片路径，例如：

```js
image: '/电子烟/real-product-01.jpg'
```

分类页顶部图则改 `categoryGroups` 里对应分类的 `heroImage`。

## 修改多级菜单

菜单层级在 `categoryGroups`。

一级菜单是 `categoryGroups` 里的每一组，比如：

```js
{
  id: 'devices',
  name: 'Devices',
  description: 'Core vape hardware families...',
  children: []
}
```

二级分类写在 `children` 里，比如：

```js
{
  id: 'pod-systems',
  name: 'Pod Systems',
  shortName: 'Pods',
  description: 'Compact refillable...',
  heroImage: '/电子烟/微信图片_20250805234550_1211.jpg',
}
```

几个规则：

- `id` 不要用中文，不要有空格，推荐小写英文加 `-`，例如 `disposable-vapes`。
- `name` 是页面和菜单显示的分类名。
- `shortName` 是商品卡片上的短标签。
- `heroImage` 是分类页顶部大图。
- 想调整菜单级别，只改 `categoryGroups` 和它的 `children`。
- 新增二级分类后，记得给商品的 `category` 填同一个 `id`，否则分类页会是空的。

## 新增商品

目前商品数据已经进行了模块化解耦，每个产品均在以下目录以独立的 `.json` 文件保存：

```txt
src/data/products/
```

如果需要新增商品，请**不要**修改 `src/store/index.js`。你只需在上述目录下**复制并重命名一个现有的 `.json` 文件**（例如新建 `14.json`），然后直接修改其中的属性：

```json
{
  "id": 14,
  "name": "New Product Name",
  "nameZh": "新产品中文名称",
  "image": "/电子烟/new-product.jpg",
  "images": [
    "/电子烟/new-product.jpg"
  ],
  "category": "pod-systems",
  "description": "Short product description for business buyers.",
  "descriptionZh": "给中文模式看的产品说明。",
  "highlights": ["Highlight 1", "Highlight 2"],
  "highlightsZh": ["中文卖点 1", "中文卖点 2"],
  "specs": [
    { "label": "Battery", "value": "500 mAh" },
    { "label": "MOQ", "value": "1000 pcs" }
  ],
  "specsZh": [
    { "label": "电池", "value": "500 mAh" },
    { "label": "起订量", "value": "1000 件" }
  ],
  "moq": "1000 pcs",
  "moqZh": "1000 件",
  "leadTime": "10-18 days",
  "leadTimeZh": "10-18 天",
  "badge": "OEM Ready",
  "badgeZh": "支持 OEM"
}
```

几个规则：

- `id` 不能重复。
- `category` 必须等于某个二级分类的 `id`，例如 `pod-systems`。
- `image` 使用 `public/电子烟/` 里的图片。
- `highlights` 建议 2-4 条，不要太长。
- `specs` 可以自由加减，会自动显示在详情页规格表里。
- `descriptionZh`、`highlightsZh`、`specsZh`、`moqZh`、`leadTimeZh`、`badgeZh` 是中文切换时显示的内容；如果不填，系统会回退显示英文。

## 图片建议

为了加载快、展示稳：

- 首页大图建议宽度 1600-2200px，JPG/WebP，单张尽量小于 500KB。
- 商品图建议宽度 900-1400px，JPG/WebP/PNG 都可以，单张尽量小于 300KB。
- 不同比例图片都能显示：大图区域会铺满，商品图会完整显示在自适应底色里，不会硬露黑白边。
- 商品图和分类图已有悬停动画，不需要额外做动图。

## 当前网站结构

- `Home`：首页、产品线、商品展示、邮箱询盘。
- `Products`：多级目录，下拉展示一级组和二级分类。
- `Company`：公司能力、OEM 支持、邮件订单流程。
- `Resources`：询盘准备说明、目录结构和加载策略说明。
- `Product Detail`：商品图、卖点、规格、MOQ、交期和邮件询盘。

## 中英文切换

网站默认英文，顶部有 `EN / 中文` 语言切换。用户选择后会保存在浏览器 `localStorage`。

主要翻译也在 `src/store/index.js`：

```js
translations: {
  en: {},
  zh: {},
}
```

如果要改按钮、标题、流程说明，就改这里对应的 key。商品和分类的中文内容直接写在各自数据里的 `xxxZh` 字段。

## SEO 基础

已添加这些基础项：

- `index.html`：标题、描述、关键词、OG/Twitter 分享信息、初始 JSON-LD。
- `src/App.vue`：按页面动态更新标题、描述、canonical、OG 信息和结构化数据。
- `public/robots.txt`：允许搜索引擎抓取。
- `public/sitemap.xml`：列出首页、分类页、产品页。

现在默认域名是：

```txt
https://www.bestlinksz.com/
```

如果真实上线域名不同，需要同步改：

- `index.html` 里的 canonical / og:url / og:image。
- `src/App.vue` 里的 `siteUrl`。
- `public/robots.txt` 里的 sitemap 地址。
- `public/sitemap.xml` 里的所有链接。

注意：这个项目是 Vue 单页应用，部署到静态托管时需要把所有路径回退到 `index.html`，否则用户直接打开 `/product/1` 可能 404。Vercel、Netlify、Cloudflare Pages 都能配置这个规则。

## 设计和性能原则

- 参考电子烟品牌站的产品展示节奏，但不复制外站布局和文案。
- 配色是深色工业感 + 克制青绿色点缀，不做过于鲜艳的零售风。
- 支持 `System / Light / Dark` 三种模式，`System` 会读取浏览器系统主题。
- 支持 `EN / 中文` 切换，主语言仍然按海外客户使用场景保持英文。
- 首屏图优先加载，下面图片懒加载。
- 动效使用轻量 CSS，不安装重型 UI 库，避免拖慢客户打开速度。
- 当前占位图是 SVG，体积很小；真实商品图上线前建议先压缩。

## 零代码后台管理部署与激活步骤 (Netlify Identity)

项目已集成 Decap CMS（可视化管理后台），在本地开发环境下，你可以通过以下链接进入后台预览其界面结构：
```txt
http://localhost:5173/admin/
```

要在 Netlify 线上正式激活该后台，供不懂代码的客户登录、修改文字和上传图片，请按照以下步骤操作：

### 第一步：将代码推送并部署到 Netlify
1. 将当前分支推送至 GitHub：
   ```sh
   git push origin main
   ```
2. Netlify 会自动从 `main` 分支构建部署。

### 第二步：在 Netlify 开启身份验证 (Identity)
1. 在 Netlify 该站点的控制面板中，点击顶部菜单的 **Site configuration**（站点设置）。
2. 在左侧导航栏找到 **Identity**（身份验证），点击 **Services**，然后点击 **Enable Identity**（启用身份验证）按钮。
3. 启用后，建议在下方进行如下安全配置：
   - **Registration preferences**（注册偏好）：建议设置为 **Invite only**（仅限邀请），这样可以防止外部陌生人注册后台账号。

### 第三步：启用 Git 网关 (Git Gateway)
1. 依然在 **Identity** 设置页面中，向下滚动找到 **Services** -> **Git Gateway**。
2. 点击 **Enable Git Gateway**（启用 Git 网关）按钮。
3. 系统会弹窗要求 GitHub 授权，点击 **Authorize** 允许 Netlify 访问你的 GitHub 仓库（这一步非常关键，它允许客户在网页后台保存时，由 Netlify 代理向 GitHub 提交代码以实现静态更新）。

### 第四步：邀请客户并登录使用
1. 在 Netlify 控制面板中，进入顶部大菜单的 **Identity** 标签页。
2. 点击 **Invite users**（邀请用户）按钮，输入你客户的邮箱发送邀请。
3. 你的客户会在邮箱里收到一封邀请信，点击邮件里的链接激活并设置其登录密码。
4. 密码设置完毕后，客户直接访问 `你的网站域名/admin/`（例如 `https://www.bestlinksz.com/admin/`），就可以用刚才的邮箱和密码登录可视化后台，进行打字、传图和增删商品了！每次点击保存，网站都会在几分钟内自动构建并实时更新。

### 附：本地开发免密可视化调试步骤

由于我们在 `config.yml` 中配置了本地开发接口（`local_backend: true`），你也可以直接在本地无网/免密环境下使用可视化后台编辑产品和栏目，这会将更改直接同步写入你本地代码目录中的 JSON 数据文件中，非常方便开发调试。

1. **第一步：启动本地后台代理服务器**
   在项目根目录下开启一个新的终端，运行以下命令（端口为 `8081`，作为本地磁盘读写代理）：
   ```sh
   npx decap-server
   ```
2. **第二步：启动开发服务器**
   在另一个终端正常运行开发服务器：
   ```sh
   npm run dev
   ```
3. **第三步：登录本地可视化后台**
   - 访问本地链接：[http://localhost:5173/admin/](http://localhost:5173/admin/)
   - 若首次打开弹出 `Development Settings`（配置关联站点），在输入框填入线上的网址：`https://bestlinksz.com` 并保存。
   - 随后登录框会自动消失，页面只呈现一个绿色的 **Login** 按钮，直接点击即可**免密登录**进入后台，对商品、分类和全局配置进行可视化编辑与保存。

