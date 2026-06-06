<script setup>
import { computed, onMounted, ref } from 'vue';
import { inquiryEmail, store } from '../store';

const isReady = ref(false);
const mailtoLink = computed(() => {
  const subject = store.language === 'zh' ? '目录和样品请求' : 'Catalogue and sample request';
  const body =
    store.language === 'zh'
      ? '你好，请发送目录文件、样品信息和包装/OEM 选项。'
      : 'Hello, please send catalogue files, sample information, and packaging/OEM options.';
  return `mailto:${inquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const resources = computed(() => [
  {
    title: store.t('blog.resource1Title'),
    text: store.t('blog.resource1Text'),
    tag: store.t('blog.resource1Tag'),
  },
  {
    title: store.t('blog.resource2Title'),
    text: store.t('blog.resource2Text'),
    tag: store.t('blog.resource2Tag'),
  },
  {
    title: store.t('blog.resource3Title'),
    text: store.t('blog.resource3Text'),
    tag: store.t('blog.resource3Tag'),
  },
]);

const performanceNotes = computed(() => [
  store.t('blog.performance1'),
  store.t('blog.performance2'),
  store.t('blog.performance3'),
]);

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});
</script>

<template>
  <div class="resources-page" :class="{ ready: isReady }">
    <section class="resources-hero">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">{{ store.t('blog.eyebrow') }}</p>
          <h1>{{ store.t('blog.title') }}</h1>
          <p>{{ store.t('blog.intro') }}</p>
          <a :href="mailtoLink" class="primary-action">{{ store.t('blog.askFiles') }}</a>
        </div>
        <div class="resource-visual">
          <img
            src="/电子烟/微信图片_20250805234550_1210.jpg"
            alt="Vape catalogue resource preview"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    </section>

    <main class="section">
      <div class="container">
        <div class="resource-grid">
          <article v-for="resource in resources" :key="resource.title" class="resource-card">
            <span>{{ resource.tag }}</span>
            <h2>{{ resource.title }}</h2>
            <p>{{ resource.text }}</p>
          </article>
        </div>
      </div>
    </main>

    <section class="section directory-section">
      <div class="container directory-layout">
        <div>
          <p class="eyebrow">{{ store.t('blog.productDirectory') }}</p>
          <h2>{{ store.t('blog.directoryTitle') }}</h2>
          <p>{{ store.t('blog.directoryText') }}</p>
        </div>
        <div class="directory-list">
          <section v-for="group in store.categoryGroups" :key="group.id">
            <h3>{{ store.text(group, 'name') }}</h3>
            <router-link v-for="child in group.children" :key="child.id" :to="`/category/${child.id}`">
              {{ store.text(child, 'name') }}
            </router-link>
          </section>
        </div>
      </div>
    </section>

    <section class="section performance-section">
      <div class="container performance-grid">
        <div>
          <p class="eyebrow">{{ store.t('blog.loading') }}</p>
          <h2>{{ store.t('blog.loadingTitle') }}</h2>
        </div>
        <ul>
          <li v-for="note in performanceNotes" :key="note">{{ note }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.resources-hero {
  padding: 78px 0 58px;
  background: var(--color-background);
}

.hero-grid,
.resource-card,
.directory-layout,
.performance-grid {
  opacity: 0;
  transform: translateY(18px);
}

.ready .hero-grid,
.ready .resource-card,
.ready .directory-layout,
.ready .performance-grid {
  animation: fadeInUp 0.55s ease forwards;
}

.ready .resource-card:nth-child(2) {
  animation-delay: 0.08s;
}

.ready .resource-card:nth-child(3) {
  animation-delay: 0.16s;
}

.hero-grid,
.directory-layout,
.performance-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(320px, 0.75fr);
  gap: 54px;
  align-items: center;
}

.eyebrow {
  margin-bottom: 12px;
  color: var(--color-link);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.resources-hero h1,
.directory-layout h2,
.performance-grid h2 {
  color: var(--color-heading);
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.98;
  font-weight: 900;
}

.resources-hero p,
.directory-layout p,
.resource-card p {
  margin-top: 18px;
  color: var(--color-text-muted);
  font-size: 1.04rem;
  line-height: 1.75;
}

.primary-action {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--color-heading);
  color: var(--color-background);
  margin-top: 28px;
  padding: 0 18px;
  font-weight: 900;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

html.dark .primary-action {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 10%, transparent);
}

html.dark .primary-action:hover {
  background: color-mix(in srgb, var(--color-accent) 88%, #fff);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.resource-visual {
  aspect-ratio: 1.1 / 1;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 24px 62px var(--color-shadow);
  overflow: hidden;
}

.resource-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.34s ease;
}

.resource-visual:hover img {
  transform: scale(1.04);
}

.section {
  padding: 68px 0;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.resource-card,
.directory-list,
.performance-grid ul {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 18px 42px var(--color-shadow);
  padding: 24px;
}

.resource-card span {
  color: var(--color-link);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.resource-card h2 {
  margin-top: 14px;
  color: var(--color-heading);
  font-size: 1.32rem;
  font-weight: 900;
}

.directory-section,
.performance-section {
  background: var(--color-background-soft);
}

.directory-list {
  display: grid;
  gap: 16px;
}

.directory-list section {
  display: grid;
  gap: 8px;
}

.directory-list h3 {
  color: var(--color-heading);
  font-size: 1.08rem;
  font-weight: 900;
}

.directory-list a {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  padding: 10px 12px;
  text-decoration: none;
}

.directory-list a:hover {
  background: var(--color-accent-soft);
}

.performance-grid ul {
  display: grid;
  gap: 12px;
  margin: 0;
  list-style: none;
}

.performance-grid li {
  position: relative;
  padding-left: 18px;
  color: var(--color-text);
}

.performance-grid li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.72em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
}

@media (max-width: 900px) {
  .hero-grid,
  .directory-layout,
  .performance-grid,
  .resource-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .container {
    width: min(100% - 28px, 1180px);
  }

  .resources-hero {
    padding-top: 48px;
  }

  .primary-action {
    width: 100%;
  }
}
</style>
