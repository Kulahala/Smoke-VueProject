<script setup>
import { ref, onMounted } from 'vue';

const isReady = ref(false);

onMounted(() => {
  setTimeout(() => {
    isReady.value = true;
  }, 10);
});
</script>

<template>
  <div class="about-view page-content" :class="{ ready: isReady }">
    <div class="container about-container">
      <section class="about-section card animate-fade-in-up">
        <h1>About Us</h1>
        <p>Welcome to BestLinksz.com! We are dedicated to providing the best products and services.</p>
        <p>Our passionate team is focused on innovation and customer satisfaction. We believe in creating unparalleled value for our clients through relentless effort.</p>
      </section>
      <section class="contact-section card animate-fade-in-up" style="animation-delay: 0.2s">
        <h2>Contact Us</h2>
        <p>If you have any questions or partnership inquiries, please feel free to contact us:</p>
        <div class="contact-info">
          <a href="mailto:1378554398@qq.com" class="contact-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>1378554398@qq.com</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}

.about-container {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.card {
}

h1, h2 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--color-heading);
}

p {
  line-height: 1.8;
  color: var(--color-text);
  text-align: center;
}

.contact-info {
  text-align: center;
  margin-top: 20px;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  font-size: 18px;
  color: var(--color-heading);
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  opacity: 0.8;
}

.contact-link svg {
  margin-right: 10px;
  stroke: currentColor;
}
</style>

