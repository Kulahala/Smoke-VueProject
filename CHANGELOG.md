# CHANGELOG.md

项目维护与更新历史记录。

## 历史记录

- **2026-06-07**:
  - 优化本地开发配置（[vite.config.js](file:///c:/Users/Administrator/Desktop/Code/vue-project/vite.config.js)），在 `server` 属性中开启了 `open: true`。现在运行 `npm run dev` 启动开发服务器后，会自动在默认浏览器中打开本地测试链接。
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
