# AGENTS.md

RIPER-5

默认中文。直接回答，不用 "Great question / 很高兴帮忙 / 当然可以" 这类开场。

## 项目定位

- 这是一个 Vue 3 + Vite 静态 ToB 商品展示站。
- 核心目标是展示 BestLinksz B2B vape catalogue，客户通过邮箱询盘。
- 不做购物车、支付、库存、账号系统或实时下单。
- Netlify 会从 GitHub 自动构建部署，推送后线上可能有短暂延迟。

## 常用命令

```sh
npm install
npm run dev
npm run build
npm run preview
```

- 本地开发默认 Vite 端口通常是 `5173`。
- `npm run lint` 会执行 `eslint . --fix`，会自动改文件；运行前先确认是否需要。
- `npm run format` 只格式化 `src/`。

## 主要文件

- `src/store/index.js`：商品、分类、文案、邮箱、翻译的主要数据源。
- `src/views/HomeView.vue`：首页。
- `src/views/ProductCatalogView.vue`：产品目录页。
- `src/views/ProductDetail.vue`：产品详情页。
- `src/App.vue`：全局布局、导航、SEO meta。
- `src/assets/base.css`：全局变量和基础主题。
- `src/assets/main.css`：全局页面样式。
- `public/电子烟/`：商品图片和占位图。

## 内容策略

- 商品目录是给商业买家看的，文字要短、清楚、可扫读。
- 产品卡片优先显示：品类、产品名、2 条左右核心卖点、MOQ、交期。
- 长说明放到详情页或 Resources，不要堆在目录卡片里。
- 目录页不要写成文章页；买家应该能快速比较 SKU 和品类。
- 图片是暂时素材时，可以使用统一风格占位图，但路径必须放在 `public/电子烟/` 下。

## 图片路径规则

- 图片放入 `public/电子烟/` 或 `public/电子烟/placeholders/`。
- 代码里写路径时不要带 `public`。
- 正确：

```js
image: '/电子烟/placeholders/pod-slim.svg'
```

- 错误：

```js
image: 'public/电子烟/placeholders/pod-slim.svg'
```

## 图片展示与比例规范

- **分类组背景大图**：大分类的 `heroImage` 必须是纯净、不包含任何多余文字、规格信息或复杂排版的超宽/大特写单图。禁止使用含有大段说明文字的实拍照（例如含有 Advantages 规格对比图的图片）作为卡片背景图，防止在 object-fit Cover 或暗色遮罩时文字被裁剪、遮挡或杂乱无章。
- **商品卡片展示框**：商品实拍或渲染图的长宽比、大小往往不一致，且通常为白底。在深色主题下，商品图片容器（如 `.product-media`、`.image-frame`）统一采用**纯白色（#ffffff）背景**，配合适量内留白（如 `padding: 12px - 24px`），且图片强制使用 `object-fit: contain` 展示。
- **视觉目标**：此做法可使白底图片的边缘与白框容器无缝融为一体，不显任何生硬外边框；不同尺寸的图片在同一个框内保持居中完整展示，不剪裁任何边缘，视觉上像物理照片展示盒一样整齐、高档。

## 改动边界

- 先读真实文件，再下结论；不要凭记忆改关键逻辑。
- 没有明确授权时，不做大范围重构、格式化、删除或回滚。
- 做文件修改前，先简短说明要改什么。
- 用户已有改动默认保留，除非用户明确要求回滚。
- 小问题小修，不为单次使用新增通用框架或复杂抽象。
- 匹配现有 Vue/Vite 写法，新增未用 import、变量和样式要自己清掉。

## 设计原则

- ToB 站点要像产品目录和采购资料，不要做成零售促销页。
- 视觉可以精致，但要克制：清晰层级、稳定栅格、可扫描信息。
- 导航、目录、卡片、询盘按钮要高效，不要用大段解释占据主流程。
- 支持桌面和移动端；修改 UI 后要检查是否有横向滚动、文字溢出、菜单遮挡。
- 不要引入没必要的 UI 库或重型动画。

## 高级前端视觉规范 (Frontend Design Skill)

为避免平庸且千篇一律的 AI 视觉风格（AI slop），请在开发时遵循以下视觉落地规范：

- **设计思考 (Design Thinking)**：在编码前确定明确且大胆的视觉方向（如：极致极简、复古未来、精致奢华、现代工业等），让站点具有独特的辨识度。
- **字体选用 (Typography)**：避免直接使用 Arial、Inter 等过于泛滥的默认/AI 常用字体。优先选用具有独特个性、契合主题的高质量字体（如通过 Google Fonts 引入），采用“特色展示字体 + 精致正文字体”的搭配。
- **色彩与主题 (Color & Theme)**：保持全局色彩一致性，通过 CSS 变量统一管理。使用具有视觉张力的主色与点缀色搭配，避免平稳平淡、毫无重点的配色，严禁滥用平庸的“白底紫渐变”等 AI 模版色彩。
- **动效微调 (Motion)**：拒绝杂乱无章的微动效。优先使用纯 CSS 实现有节奏感的载入动画（如使用 animation-delay 实现级联显现）和惊喜的悬停（Hover）/滚动状态，提升交互的品质感。
- **版式布局 (Spatial Composition)**：打破常规的对齐，合理运用不对称布局、层叠重合、网格破格元素，配合大面积的留白或经过严密设计的紧凑布局来丰富视觉层次。
- **背景与细节 (Backgrounds & Details)**：利用渐变网格 (Gradient meshes)、噪点纹理 (Noise textures)、几何图案、半透明叠加、精致阴影和细腻边框等手法创造背景的纵深感，拒绝单一无趣的纯色块。

## 验证方式

- 低风险内容修改：至少检查页面能正常打开，相关文案/图片显示正确。
- UI 修改：用浏览器检查首页、产品目录页、移动端菜单和主题/语言面板。
- 构建验证优先跑 `npm run build`；如果本机出现 esbuild `spawn EPERM`，先记录环境错误，不要直接判断代码失败。
- Git 操作前先看 `git status --short --branch`，不要把无关文件顺手提交。

## Git 规则

- 当前主分支是 `main`。
- 远端使用 HTTPS：`https://github.com/Kulahala/vue-project.git`。
- 推送前确认用户是否要求 push；不要默认推送。
- `outputs/` 这类工具输出目录不要随手提交，除非用户明确要求。
- 每次进行 git commit 前，必须检查一次是否需要同步更新 `AGENTS.md`（例如，是否有新引入的工具、全局规范变更、核心逻辑修改等需在此记录）。

## Review 流程

用户要求 review / code review / 复核时，必须做两轮：

1. 正常 review：优先找 bug、风险、行为回归和缺测试，按严重程度排序，给出文件/行号依据。
2. 对抗性 review：假设代码是自己写的，先为每个关键设计点辩护；辩护中发现站不住脚、风险或隐患，必须诚实指出，并给改进建议。

第二轮不是替代码洗地；能辩护就说明为什么安全合理，不能辩护就直接标成风险。

## 轻量子代理

- 当用户明确允许委派或并行 agent work 时，低风险、边界清楚的副任务优先用 `gpt-5.4-mini`。
- 适合：只读查文件、符号定位、文档核对、简单清单、窄范围机械文档编辑。
- 不适合：架构决策、代码 review、行为敏感逻辑、模糊 bug、跨文件重构。
- 主 agent 继续负责关键判断；mini 是副手，不是主刀。

## 维护与更新记录

- **2026-06-07**:
  - 修复移动端导航菜单关闭时子元素 `.nav-menu` 点击热区穿透并遮挡页面按钮的 Bug（[App.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/App.vue)）。
  - 在产品目录页中实现了 Scrollspy 滚动高亮分类条功能，并优化了点击平滑滚动及初次 hash 载入跳转逻辑（[ProductCatalogView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/ProductCatalogView.vue)）。
  - 全局拦截 `mailto:` 写信链接，点击时自动复制询盘邮箱至剪贴板，并配合毛玻璃卡片 Toast 提示，解决无本地写信客户端 white page 的体验问题。
  - 公司能力页（[AboutView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/AboutView.vue)）大配图修改为 `object-fit: cover` 铺满容器，去除白边框，使意境配图大卡片在页面整体排版中更加舒展大气。
  - 优化产品目录页移动端体验，实现分类导航滑条在滚动切换时自动滚动居中（[ProductCatalogView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/ProductCatalogView.vue)）。
  - 修复 Netlify Identity 线上邀请邮件激活链接被首页吞掉的 Bug（在根目录 [index.html](file:///c:/Users/Administrator/Desktop/Code/vue-project/index.html) 中引入 Widget 脚本并添加 init/login 自动重定向逻辑）。
  - 在后台管理系统 [public/admin/index.html](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/index.html) 中定制了具有磨砂玻璃质感的**右侧操作手册悬浮窗**。支持二级菜单滑动切换，并新增定时器监听，确保只有登录成功进入管理主界面后才显示该浮窗，以防在登录页遮挡界面。
  - 在 [public/admin/config.yml](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/config.yml) 中配置 `local_backend: true`，开启本地可视化免密调试。
  - 优化 [vite.config.js](file:///c:/Users/Administrator/Desktop/Code/vue-project/vite.config.js)，添加 server 中间件，自动将本地开发环境的 `/admin` 路径重定向至 `/admin/index.html` 解决 Vite SPA 的 404 问题。
  - 优化后台管理系统 [public/admin/index.html](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/index.html) 的布局与体验，实现了表单输入聚焦与右侧指南小卡片的高亮及自动平滑滚动联动。去除了左侧的网页实时预览 iframe 侧边栏，CMS 表单主体容器恢复为 100% 宽度的舒适大格局。
  - 在后台管理系统 [public/admin/index.html](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/index.html) 中引入了全新的左侧**交互式网页蓝图与截图对照侧边栏**（支持自适应折叠与自适应宽屏布局）。默认渲染用 HTML/CSS 绘制的网页模块结构蓝图，当检测到 `/admin/img/` 下存在真实页面截图时，自动无缝升级为真实截图，并在表单输入聚焦时通过 CSS 动态计算百分比坐标在对应区域渲染呼吸发光红框，极大降低非技术人员的认知门槛。
  - 修复后台管理系统在聚焦 `HERO SLIDES` (首页轮播大图) 和 `CARD BADGE` (卡片角标) 等表单项时，左侧蓝图/截图无对应红框或错配的 Bug（优化了 ID 字符识别正则，增加了 `prod-badge` 坐标定位并在 CSS 蓝图中增加了模拟角标元素）。
  - 优化首页及全站底部询盘区（[HomeView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/HomeView.vue)、[AboutView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/AboutView.vue)、[CategoryView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/CategoryView.vue)）的视觉设计。抛弃生硬的全宽单色横条，统一重塑为带圆角和悬浮阴影的高级卡片布局，使用 CSS 实现了科技点阵背景网格与漂浮在背景右上角的薄荷/黑金霓虹发光烟雾球（Vape Steam Glow Aura），契合电子烟主题。


