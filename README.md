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

打开 `src/store/index.js`，在 `products` 数组里复制一个商品，然后改内容：

```js
{
  id: 11,
  name: 'New Product Name',
  image: '/电子烟/new-product.jpg',
  category: 'pod-systems',
  description: 'Short product description for business buyers.',
  descriptionZh: '给中文模式看的产品说明。',
  highlights: ['Highlight 1', 'Highlight 2', 'Highlight 3'],
  highlightsZh: ['中文卖点 1', '中文卖点 2', '中文卖点 3'],
  specs: [
    { label: 'Battery', value: '500 mAh' },
    { label: 'MOQ', value: '1000 pcs' },
  ],
  specsZh: [
    { label: '电池', value: '500 mAh' },
    { label: '起订量', value: '1000 件' },
  ],
  moq: '1000 pcs',
  moqZh: '1000 件',
  leadTime: '10-18 days',
  leadTimeZh: '10-18 天',
  badge: 'OEM Ready',
  badgeZh: '支持 OEM',
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
