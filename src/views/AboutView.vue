<script setup>
import { computed, onMounted, ref } from 'vue';
import { inquiryEmail, store } from '../store';

const isReady = ref(false);
const mailtoLink = computed(() => {
  const subject = store.language === 'zh' ? '商务合作询盘' : 'Business cooperation inquiry';
  const body =
    store.language === 'zh'
      ? '你好，我想沟通批发电子烟产品、OEM 包装和样品支持。'
      : 'Hello, I would like to discuss wholesale vape products, OEM packaging, and sample support.';
  return `mailto:${inquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const capabilities = computed(() => [
  {
    title: store.t('about.capability1Title'),
    text: store.t('about.capability1Text'),
  },
  {
    title: store.t('about.capability2Title'),
    text: store.t('about.capability2Text'),
  },
  {
    title: store.t('about.capability3Title'),
    text: store.t('about.capability3Text'),
  },
]);

const workflow = computed(() => [
  store.t('about.workflow1'),
  store.t('about.workflow2'),
  store.t('about.workflow3'),
  store.t('about.workflow4'),
]);

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});
</script>

<template>
  <div class="company-page" :class="{ ready: isReady }">
    <section class="company-hero">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">{{ store.t('about.eyebrow') }}</p>
          <h1>{{ store.t('about.title') }}</h1>
          <p>{{ store.t('about.intro') }}</p>
          <a :href="mailtoLink" class="primary-action">{{ store.t('about.emailInquiry') }}</a>
        </div>
        <div class="hero-image">
          <img src="/电子烟/packaging.jpg" alt="BestLinksz packaging and sample support" loading="eager" decoding="async" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container capability-grid">
        <article v-for="capability in capabilities" :key="capability.title" class="capability-card">
          <span></span>
          <h2>{{ capability.title }}</h2>
          <p>{{ capability.text }}</p>
        </article>
      </div>
    </section>

    <section class="section workflow-section">
      <div class="container workflow-grid">
        <div>
          <p class="eyebrow">{{ store.t('about.orderHandling') }}</p>
          <h2>{{ store.t('about.workflowTitle') }}</h2>
          <p>{{ store.t('about.workflowText') }}</p>
        </div>
        <ol>
          <li v-for="item in workflow" :key="item">{{ item }}</li>
        </ol>
      </div>
    </section>

    <section class="section directory-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ store.t('about.catalogueStructure') }}</p>
          <h2>{{ store.t('about.directoryTitle') }}</h2>
        </div>
        <div class="directory-grid">
          <article v-for="group in store.categoryGroups" :key="group.id" class="directory-card">
            <h3>{{ store.text(group, 'name') }}</h3>
            <p>{{ store.text(group, 'description') }}</p>
            <router-link
              v-for="child in group.children"
              :key="child.id"
              :to="`/category/${child.id}`"
            >
              {{ store.text(child, 'name') }}
            </router-link>
          </article>
        </div>
      </div>
    </section>

    <section class="contact-band">
      <div class="vape-glow-2"></div>
      <div class="contact-band-inner">
        <div>
          <p class="eyebrow">{{ store.t('footer.contact') }}</p>
          <h2>{{ store.t('about.contactTitle') }}</h2>
        </div>
        <a :href="mailtoLink" class="primary-action">{{ inquiryEmail }}</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.company-hero {
  padding: 78px 0 52px;
  background: var(--color-background);
}

.hero-grid,
.workflow-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(320px, 0.75fr);
  gap: 54px;
  align-items: center;
}

.hero-grid,
.capability-card,
.workflow-grid,
.directory-card,
.contact-band-inner {
  opacity: 0;
  transform: translateY(18px);
}

.ready .hero-grid,
.ready .capability-card,
.ready .workflow-grid,
.ready .directory-card,
.ready .contact-band-inner {
  animation: fadeInUp 0.55s ease forwards;
}

.ready .capability-card:nth-child(2),
.ready .directory-card:nth-child(2) {
  animation-delay: 0.08s;
}

.ready .capability-card:nth-child(3),
.ready .directory-card:nth-child(3) {
  animation-delay: 0.16s;
}

.eyebrow {
  margin-bottom: 12px;
  color: var(--color-link);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.company-hero h1,
.workflow-grid h2,
.section-heading h2,
.contact-band h2 {
  color: var(--color-heading);
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.98;
  font-weight: 900;
}

.company-hero p,
.workflow-grid p,
.directory-card p,
.capability-card p {
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

html.dark .primary-action,
.contact-band .primary-action {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 10%, transparent);
}

html.dark .primary-action:hover,
.contact-band .primary-action:hover {
  background: color-mix(in srgb, var(--color-accent) 88%, #fff);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.hero-image {
  aspect-ratio: 1.1 / 1;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 24px 62px var(--color-shadow);
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.34s ease;
}

.hero-image:hover img {
  transform: scale(1.04);
}

.section {
  padding: 68px 0;
}

.capability-grid,
.directory-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.capability-card,
.directory-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 18px 42px var(--color-shadow);
  padding: 24px;
}

.capability-card span {
  width: 38px;
  height: 4px;
  display: block;
  border-radius: 99px;
  background: var(--color-accent);
  margin-bottom: 18px;
}

.capability-card h2,
.directory-card h3 {
  color: var(--color-heading);
  font-size: 1.32rem;
  font-weight: 900;
}

.workflow-section,
.directory-section {
  background: var(--color-background-soft);
}

.workflow-grid ol {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: workflow;
}

.workflow-grid li {
  counter-increment: workflow;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  padding: 16px;
}

.workflow-grid li::before {
  content: counter(workflow, decimal-leading-zero);
  color: var(--color-link);
  font-weight: 900;
}

.section-heading {
  max-width: 780px;
  margin-bottom: 30px;
}

.directory-card {
  display: grid;
  align-content: start;
  gap: 8px;
}

.directory-card a {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  margin-top: 4px;
  padding: 10px 12px;
  text-decoration: none;
}

.directory-card a:hover {
  background: var(--color-accent-soft);
  color: var(--color-heading);
}

.contact-band {
  position: relative;
  background: var(--color-heading);
  color: var(--color-background);
  overflow: hidden;
  border-radius: 24px;
  margin: 60px auto;
  width: min(1180px, calc(100% - 40px));
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.06),
    inset 0 1px 0px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-band:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 35px 70px rgba(0, 0, 0, 0.1),
    inset 0 1px 0px rgba(255, 255, 255, 0.15);
}

.contact-band::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--color-background) 1.2px, transparent 1.2px);
  background-size: 24px 24px;
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
}

.contact-band::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.28) 0%, rgba(var(--color-accent-rgb), 0.05) 50%, transparent 70%);
  filter: blur(35px);
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.3s ease;
  animation: vapeSteam 10s ease-in-out infinite;
}

/* Vape 左下角小霓虹发光球 */
.vape-glow-2 {
  position: absolute;
  bottom: -50%;
  left: -10%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.22) 0%, rgba(var(--color-accent-rgb), 0.04) 50%, transparent 70%);
  filter: blur(35px);
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.3s ease;
  animation: vapeSteamAlt 14s ease-in-out infinite;
}

html.dark .contact-band::after {
  background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.5) 0%, rgba(var(--color-accent-rgb), 0.12) 45%, transparent 70%);
  filter: blur(30px);
}

html.dark .vape-glow-2 {
  background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.4) 0%, rgba(var(--color-accent-rgb), 0.1) 45%, transparent 70%);
  filter: blur(28px);
}

.contact-band .eyebrow,
.contact-band h2 {
  color: var(--color-background);
}

.contact-band-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 60px clamp(24px, 6vw, 64px);
}

@media (max-width: 900px) {
  .hero-grid,
  .workflow-grid,
  .capability-grid,
  .directory-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .container {
    width: min(100% - 28px, 1180px);
  }

  .company-hero {
    padding-top: 48px;
  }

  .contact-band-inner {
    align-items: stretch;
    flex-direction: column;
    padding: 40px 24px;
    gap: 24px;
  }

  .primary-action {
    width: 100%;
  }
}
</style>
