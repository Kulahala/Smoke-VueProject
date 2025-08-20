<template>
  <div class="about-view">
    <div class="container">
      <section class="about-section">
        <h1>关于我们</h1>
        <p>欢迎来到 BestLinksz.com！我们致力于提供最优质的产品和服务。</p>
        <p>我们的团队充满激情，专注于创新和客户满意度。我们相信，通过我们的不懈努力，可以为客户创造无与伦
比的价值。</p>
      </section>
      <section class="contact-section">
        <h2>联系方式</h2>
        <p>如果您有任何问题或合作意向，请随时通过以下方式联系我们：</p>
        <div class="contact-info">
          <a href="mailto:1378554398@qq.com" class="contact-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>1378554398@qq.com</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  padding: 40px 0;
}
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
}
.about-section, .contact-section {
  margin-bottom: 40px;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
h1, h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
p {
  line-height: 1.8;
  color: #555;
  text-align: justify;
}
.contact-info {
  text-align: center;
  margin-top: 20px;
}
.contact-link {
  display: inline-flex;
  align-items: center;
  font-size: 18px;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}
.contact-link:hover {
  color: #0056b3;
}
.contact-link svg {
  margin-right: 10px;
}
</style>
