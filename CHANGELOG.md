# CHANGELOG.md

项目维护与更新历史记录。

## 历史记录

- **2026-06-07**:
  - **菜单与下拉浮窗磨砂玻璃化统一**：升级了 PC 端“产品”下拉菜单（`.nav-menu`）、“偏好设置”浮窗（`.utility-panel`）及移动端“菜单抽屉”（`.nav-shell`）的视觉系统，全部统一为与顶部导航栏一致的 `backdrop-filter: blur(18px)` 磨砂玻璃特效；将其底色混合比例同步对齐为 `68%` 透明底，解决了原 `88%` 比例过厚导致模糊感被遮挡的 Bug，并处理了小屏下的堆叠重置。
  - **返回顶部滚动优化**：解决了用户点击“返回顶部”在滑动期间通过鼠标滚轮、触摸、键盘或点击动作下滑时页面闪烁抖动的 Bug。实现了“滚动打断”机制，任意用户主动滚动输入均可立刻平滑中止 smooth 滚动动画，且通过 passive 监听声明保证滚动渲染性能。
  - **商品详情页灯箱优化**：优化了商品详情页大图点击放大效果，移除白底收纳容器与放大镜图标，使放大的图片以原生比例直接悬浮展示在深色磨砂玻璃背景上，并配有柔和阴影。
  - **产品画册合并与真实实拍图集配置**：
    - 对商品数据库进行了合并瘦身：删除了重复雷同的 Product 2 (Nova)、Product 7 (Metro Kit)、Product 8 (Cloud Bar Pro)。
    - 将换弹式设备合并至 [Product 1 (Aurora Metro Pod System)](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/data/products/1-aurora-slim-pod.json)，导入组 8 的 6 张 100% 真实微信实拍图，涵盖单机/礼盒套装、棉芯/陶瓷芯规格。
    - 将一次性设备合并至 [Product 4 (Edge Mini & Cloud Pro Series)](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/data/products/4-edge-mini-disposable.json)，导入组 7 的 8 张同系列多颜色微信实拍图，涵盖 3000 - 6000 口规格。
    - 清理了产品 3 (Pulse Max Disposable) 不关联的红蓝色 AI 错误图，恢复为干净单图以保证枪灰色主图的视觉一致性。
    - 新增了开发调试视图 [DebugImages.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/DebugImages.vue) 及其路由 `/debug-images` 以便对比预览所有微信实拍原始素材。
    - 优化详情页缩略图超出时的滑动交互，设置按钮为 `flex-shrink: 0` 并为其底栏设计了极细、半透明、带 Hover 激活的定制滚动滑条。
    - **升级可视化后台多图配置**：在 [config.yml](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/config.yml) 中为产品库增加了 `images` (Product Gallery) 多图相册编辑控件，支持直接在后台增删、排序多个产品实拍图，并防止后台在覆写保存产品数据时丢失多图相册。
  - 新增全局**在线询盘留言小浮窗**（[InquiryWidget.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/components/InquiryWidget.vue)）：页面右下角追加了常驻的“在线询盘 / Inquiry”悬浮按钮，点击拉起磨砂玻璃半透明小表单，支持表单校验、多语言自适应及发送状态转换。若后台未配置 Web3Forms 密钥，系统会自动无缝智能降级为“复制接单邮箱并唤起发信客户端”，避开表单提交失败的尴尬。
  - 在 [public/admin/config.yml](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/config.yml) 全局设置中增加了 `web3formsKey` 选项，支持非技术商家直接在后台管理邮箱留言接收密钥。
  - 优化本地开发配置（[vite.config.js](file:///c:/Users/Administrator/Desktop/Code/vue-project/vite.config.js)），在 `server` 属性中开启了 `open: true`。现在运行 `npm run dev` 启动开发服务器后，会自动在默认浏览器中打开本地测试链接。
  - **全站磨砂玻璃重构与细节提升**：将 [App.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/App.vue) 顶部导航栏底色从 90% 不透明度升级为 68% 透明面底色并添加了 `blur(18px)`。完成了商品卡片标签（徽章）的磨砂玻璃特效改造（在 [HomeView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/HomeView.vue)、[ProductCatalogView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/ProductCatalogView.vue) 和 [CategoryView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/CategoryView.vue) 中通过 `backdrop-filter: blur(8px)`、1px 细发光边框及半透明主题色底色重塑浮空微质感）。将右下角询盘组件的悬浮按钮默认底色降为 68%，Hover 态升级为高亮霓虹描边的半透明玻璃，呼出面板不透明度降为 72%。拓宽并升级了详情页小标签与首页大分类卡片标签的磨砂玻璃，重写了详情页询盘大板块为霓虹极光微光渐变。将多语言色彩切换面板磨砂玻璃不透明度调优至 **88%** 并实现自适应响应式边界对齐（桌面端左对齐，移动端/小屏右对齐）。**修复了在“科技蓝”和“黑金”主题下，`--color-accent-rgb` 变量缺失导致磨砂玻璃及发光投影呈现原薄荷绿色的 Bug**。**修复了商品角标文字在纯白产品图容器上对比度低、模糊难认的问题**（引入白底专用深色变量 `--color-accent-ink` 并将角标文字颜色绑定，确保各主题下字迹坚实清晰）。**为底部询盘区背景霓虹烟雾球增加了 10s 的 GPU 缓慢漂移循环动效**。**实现了商品详情页多图画廊切换机制（淘宝/京东缩略图栏式）**，并在 `src/data/products/1-aurora-slim-pod.json` 与 `src/data/products/2-nova-ceramic-pod.json` 中配置了多图数据；同时**利用 AI 生成了产品 1 和产品 2 的多角度产品渲染及高档商务使用场景图**（包含充电口特写、包装盒组合图、男士西装手握特写及优雅吐烟雾场景等），为大买家提供立体的全方位展示。
  - 优化公司能力页（[AboutView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/AboutView.vue)）大配图修改为 `object-fit: cover` 铺满容器，去除白边框，使意境配图大卡片在页面整体排版中更加舒展大气。
  - 优化首页及全站底部询盘区（[HomeView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/HomeView.vue)、[AboutView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/AboutView.vue)、[CategoryView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/CategoryView.vue)）的视觉设计。抛弃生硬的全宽单色横条，统一重塑为带圆角和悬浮阴影的高级卡片布局，使用 CSS 实现了科技点阵背景网格与漂浮在背景右上角的薄荷/黑金霓虹发光烟雾球（Vape Steam Glow Aura），契合电子烟主题。
  - 修复后台管理系统在聚焦 `HERO SLIDES` (首页轮播大图) 和 `CARD BADGE` (卡片角标) 等表单项时，左侧蓝图/截图无对应红框或错配 the Bug（优化了 ID 字符识别正则，增加了 `prod-badge` 坐标定位并在 CSS 蓝图中增加了模拟角标元素）。
  - 修复移动端导航菜单关闭时子元素 `.nav-menu` 点击热区穿透并遮挡页面按钮的 Bug（[App.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/App.vue)）。
  - 在产品目录页中实现了 Scrollspy 滚动高亮分类条功能，并优化了点击平滑滚动及初次 hash 载入跳转逻辑（[ProductCatalogView.vue](file:///c:/Users/Administrator/Desktop/Code/vue-project/src/views/ProductCatalogView.vue)）。
  - 全局拦截 `mailto:` 写信链接，点击时自动复制询盘邮箱至剪贴板，并配合毛玻璃卡片 Toast 提示，解决无本地写信客户端 white page 的体验问题。
  - 修复 Netlify Identity 线上邀请邮件激活链接被首页吞掉的 Bug（在根目录 [index.html](file:///c:/Users/Administrator/Desktop/Code/vue-project/index.html) 中引入 Widget 脚本并添加 init/login 自动重定向逻辑）。
  - 在后台管理系统 [public/admin/index.html](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/index.html) 中定制了具有磨砂玻璃质感的**右侧操作手册悬浮窗**。支持二级菜单滑动切换，并新增定时器监听，确保只有登录成功进入管理主界面后才显示该浮窗，以防在登录页遮挡界面。
  - 在 [public/admin/config.yml](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/config.yml) 中配置 `local_backend: true`，开启本地可视化免密调试。
  - 优化 [vite.config.js](file:///c:/Users/Administrator/Desktop/Code/vue-project/vite.config.js)，添加 server 中间件，自动将本地开发环境的 `/admin` 路径重定向至 `/admin/index.html` 解决 Vite SPA 的 404 问题。
  - 优化后台管理系统 [public/admin/index.html](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/index.html) 的布局与体验，实现了表单输入聚焦与右侧指南小卡片的高亮及自动平滑滚动联动。去除了左侧的网页实时预览 iframe 侧边栏，CMS 表单主体容器恢复为 100% 宽度的舒适大格局。
  - 在后台管理系统 [public/admin/index.html](file:///c:/Users/Administrator/Desktop/Code/vue-project/public/admin/index.html) 中引入了全新的左侧**交互式网页蓝图与截图对照侧边栏**（支持自适应折叠与自适应宽屏布局）。默认渲染用 HTML/CSS 绘制的网页模块结构蓝图，当检测到 `/admin/img/` 下存在真实页面截图时，自动无缝升级为真实截图，并在表单输入聚焦时通过 CSS 动态计算百分比坐标在对应区域渲染呼吸发光红框，极大降低非技术人员的认知门槛。
