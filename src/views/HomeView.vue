<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { heroSlides, inquiryEmail, store } from '../store';

const currentIndex = ref(0);
const intervalId = ref(null);
const isReady = ref(false);

const featuredProducts = computed(() => store.representativeProducts);
const categoryGroups = computed(() =>
  store.categoryGroups.map((group) => ({
    ...group,
    heroImage: group.heroImage || group.children[0]?.heroImage,
    target: `/products#${group.id}`,
  })),
);
const slides = computed(() => heroSlides);
const currentSlide = computed(() => slides.value[currentIndex.value]);
const mailtoLink = computed(
  () =>
    `mailto:${inquiryEmail}?subject=${encodeURIComponent(
      store.language === 'zh' ? '批发产品询盘' : 'Wholesale product inquiry',
    )}&body=${encodeURIComponent(
      store.language === 'zh'
        ? '你好，我想了解产品目录、价格、起订量和交期信息。'
        : 'Hello, I would like to receive your catalogue, pricing, MOQ, and lead time information.',
    )}`,
);

const nextHero = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const setHero = (index) => {
  currentIndex.value = index;
};

const startHeroRotation = () => {
  stopHeroRotation();
  intervalId.value = setInterval(nextHero, 5000);
};

const stopHeroRotation = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

onMounted(() => {
  startHeroRotation();
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});

onBeforeUnmount(() => {
  stopHeroRotation();
});
</script>

<template>
  <div class="home-view" :class="{ ready: isReady }">
    <section class="hero-section">
      <div class="hero-media" aria-hidden="true">
        <Transition name="hero-fade" mode="out-in">
          <img
            :key="currentSlide.image"
            :src="currentSlide.image"
            :alt="store.text(currentSlide, 'title')"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        </Transition>
      </div>
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <div class="hero-copy">
          <p class="eyebrow">{{ store.t('home.eyebrow') }}</p>
          <h1>{{ store.t('home.title') }}</h1>
          <p class="hero-text">
            {{ store.t('home.heroText') }}
          </p>
          <div class="hero-actions" aria-label="Primary actions">
            <a :href="mailtoLink" class="primary-action">{{ store.t('home.emailQuote') }}</a>
            <router-link to="/products" class="secondary-action">{{ store.t('home.viewProducts') }}</router-link>
          </div>
          <div class="hero-indicators" aria-label="Hero image selector">
            <button
              v-for="(_, index) in slides"
              :key="index"
              type="button"
              :class="{ active: currentIndex === index }"
              :aria-label="`${store.t('home.showSlide')} ${store.text(slides[index], 'title')}`"
              @click="setHero(index)"
            ></button>
          </div>
          <dl class="hero-metrics" aria-label="Business highlights">
            <div>
              <dt>{{ store.t('home.metric.oem') }}</dt>
              <dd>{{ store.t('home.metric.oemText') }}</dd>
            </div>
            <div>
              <dt>{{ store.t('home.metric.moq') }}</dt>
              <dd>{{ store.t('home.metric.moqText') }}</dd>
            </div>
            <div>
              <dt>{{ store.t('home.metric.lead') }}</dt>
              <dd>{{ store.t('home.metric.leadText') }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <main>
      <section class="section intro-section">
        <div class="container intro-grid">
          <div>
            <p class="eyebrow">{{ store.t('home.productLines') }}</p>
            <h2>{{ store.t('home.introTitle') }}</h2>
          </div>
          <p>
            {{ store.t('home.introText') }}
          </p>
        </div>
      </section>

      <section class="section category-section">
        <div class="container category-grid">
          <router-link
            v-for="group in categoryGroups"
            :key="group.id"
            class="category-card"
            :to="group.target"
          >
            <img :src="group.heroImage" :alt="store.text(group, 'name')" loading="lazy" decoding="async" />
            <span>{{ group.children.length }} {{ store.t('catalog.categories') }}</span>
            <h3>{{ store.text(group, 'name') }}</h3>
            <p>{{ store.text(group, 'description') }}</p>
          </router-link>
        </div>
      </section>

      <section class="section catalogue-section">
        <div class="container">
          <div class="section-heading">
            <div>
              <p class="eyebrow">{{ store.t('home.featured') }}</p>
              <h2>{{ store.t('home.showcase') }}</h2>
            </div>
            <p class="section-note">{{ store.t('home.featuredText') }}</p>
            <router-link to="/products" class="text-link">{{ store.t('home.browseCategory') }}</router-link>
          </div>

          <div class="product-grid">
            <article v-for="entry in featuredProducts" :key="entry.group.id" class="product-card">
              <router-link :to="`/product/${entry.product.id}`" class="product-link">
                <div class="product-media">
                  <img :src="entry.product.image" :alt="entry.product.name" loading="lazy" decoding="async" />
                  <span>{{ store.text(entry.product, 'badge') }}</span>
                </div>
                <div class="product-body">
                  <p>{{ store.text(entry.group, 'name') }}</p>
                  <h3>{{ entry.product.name }}</h3>
                  <ul>
                    <li v-for="highlight in store.list(entry.product, 'highlights').slice(0, 2)" :key="highlight">
                      {{ highlight }}
                    </li>
                  </ul>
                  <div class="product-meta">
                    <span>{{ store.t('common.moq') }}: {{ store.text(entry.product, 'moq') }}</span>
                    <span>{{ store.text(entry.product, 'leadTime') }}</span>
                  </div>
                </div>
              </router-link>
            </article>
          </div>
        </div>
      </section>

      <section class="section process-section">
        <div class="container">
          <div class="section-heading">
            <div>
              <p class="eyebrow">{{ store.t('home.howOrders') }}</p>
              <h2>{{ store.t('home.workflowTitle') }}</h2>
            </div>
          </div>
          <div class="process-grid">
            <div class="process-step">
              <span>01</span>
              <h3>{{ store.t('home.step1Title') }}</h3>
              <p>{{ store.t('home.step1Text') }}</p>
            </div>
            <div class="process-step">
              <span>02</span>
              <h3>{{ store.t('home.step2Title') }}</h3>
              <p>{{ store.t('home.step2Text') }}</p>
            </div>
            <div class="process-step">
              <span>03</span>
              <h3>{{ store.t('home.step3Title') }}</h3>
              <p>{{ store.t('home.step3Text') }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="contact-band">
        <div class="vape-glow-2"></div>
        <div class="contact-band-inner">
          <div>
            <p class="eyebrow">{{ store.t('home.wholesaleInquiry') }}</p>
            <h2>{{ store.t('home.contactTitle') }}</h2>
          </div>
          <a :href="mailtoLink" class="primary-action">{{ store.t('home.contactEmail') }} {{ inquiryEmail }}</a>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-view {
  overflow: hidden;
}

.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.hero-section {
  position: relative;
  min-height: clamp(620px, 82vh, 780px);
  display: flex;
  align-items: center;
  color: #fff;
  isolation: isolate;
}

.hero-media,
.hero-overlay {
  position: absolute;
  inset: 0;
}

.hero-media {
  z-index: -2;
  background: #10151b;
}

.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.08);
}

.hero-overlay {
  z-index: -1;
  background:
    radial-gradient(circle at 80% 45%, color-mix(in srgb, var(--color-accent) 7%, transparent) 0%, transparent 56%),
    linear-gradient(90deg, rgba(4, 9, 11, 0.96) 0%, rgba(6, 12, 14, 0.82) 48%, rgba(6, 12, 14, 0.3) 100%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 76px),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0 1px, transparent 1px 76px),
    linear-gradient(180deg, rgba(4, 9, 11, 0.1), rgba(4, 9, 11, 0.72));
}

.hero-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  padding: 92px 0 74px;
}

.hero-copy {
  max-width: 920px;
}

.hero-copy,
.intro-grid,
.category-card,
.product-card,
.process-step,
.contact-band-inner {
  opacity: 0;
  transform: translateY(18px);
}

.ready .hero-copy,
.ready .intro-grid,
.ready .category-card,
.ready .product-card,
.ready .process-step,
.ready .contact-band-inner {
  animation: fadeInUp 0.58s ease forwards;
}

.ready .category-card:nth-child(2),
.ready .product-card:nth-child(2),
.ready .process-step:nth-child(2) {
  animation-delay: 0.08s;
}

.ready .category-card:nth-child(3),
.ready .product-card:nth-child(3),
.ready .process-step:nth-child(3) {
  animation-delay: 0.16s;
}

.ready .category-card:nth-child(4),
.ready .product-card:nth-child(4) {
  animation-delay: 0.24s;
}

.ready .category-card:nth-child(5),
.ready .product-card:nth-child(5) {
  animation-delay: 0.32s;
}

.ready .category-card:nth-child(6),
.ready .product-card:nth-child(6) {
  animation-delay: 0.40s;
}

.eyebrow {
  margin-bottom: 12px;
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero-copy h1 {
  max-width: 920px;
  color: #fff;
  font-size: clamp(2.6rem, 7vw, 5.9rem);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: -0.025em;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.22);
}

.hero-text {
  max-width: 720px;
  margin-top: 22px;
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.primary-action,
.secondary-action {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
}

.primary-action {
  background:
    linear-gradient(135deg, color-mix(in srgb, #fff 26%, transparent), transparent 42%),
    var(--color-accent);
  color: #071018;
  box-shadow: 0 16px 34px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.secondary-action {
  border: 1px solid rgba(255, 255, 255, 0.42);
  color: #fff;
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-2px);
}

.secondary-action:hover {
  border-color: #fff;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  max-width: 760px;
  margin-top: 44px;
}

.hero-metrics div {
  border-top: 1px solid rgba(255, 255, 255, 0.24);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent);
  padding-top: 14px;
}

.hero-metrics dt {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 900;
}

.hero-metrics dd {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.66);
}

.hero-indicators {
  display: flex;
  gap: 8px;
  margin-top: 22px;
}

.hero-indicators button {
  width: 36px;
  height: 4px;
  border: 0;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.28);
  cursor: pointer;
}

.hero-indicators button.active {
  background: var(--color-accent);
}

.section {
  padding: 78px 0;
}

.intro-section {
  background:
    linear-gradient(180deg, var(--color-background), color-mix(in srgb, var(--color-background-soft) 44%, var(--color-background)));
}

.intro-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(280px, 0.75fr);
  gap: 48px;
  align-items: end;
}

.intro-grid h2,
.section-heading h2,
.contact-band h2 {
  color: var(--color-heading);
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.05;
  font-weight: 900;
}

.intro-grid p:last-child {
  color: var(--color-text-muted);
  font-size: 1.05rem;
}

.category-section {
  padding-top: 0;
  background: var(--color-background);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.category-card {
  position: relative;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  color: #fff;
  text-decoration: none;
  isolation: isolate;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s, box-shadow 0.35s;
}

.category-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent);
  box-shadow: 
    0 20px 40px var(--color-shadow-hover),
    0 0 16px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.category-card img {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(180deg, rgba(8, 14, 22, 0.08), rgba(8, 14, 22, 0.88)),
    repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 18px);
}

.category-card:hover img {
  transform: scale(1.06);
}

.category-card span {
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 800;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-card h3 {
  margin-top: 14px;
  color: #fff;
  font-size: 1.75rem;
  line-height: 1.1;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-card p {
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.74);
  opacity: 0.85;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s;
}

.category-card:hover h3,
.category-card:hover span {
  transform: translateY(-3px);
}

.category-card:hover p {
  opacity: 1;
  transform: translateY(-3px);
}

.catalogue-section {
  background:
    linear-gradient(180deg, var(--color-background-soft), var(--color-background)),
    var(--color-background-soft);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}

.text-link {
  color: var(--color-link);
  font-weight: 800;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.product-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface-elevated) 82%, transparent), transparent),
    var(--color-surface);
  overflow: hidden;
  box-shadow: 0 18px 40px var(--color-shadow);
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-accent);
  box-shadow: 
    0 24px 58px var(--color-shadow-hover),
    0 0 20px color-mix(in srgb, var(--color-accent) 24%, transparent);
}

.product-link {
  display: grid;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.product-media {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1.05 / 1;
  background: #ffffff;
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
  padding: 16px;
}

.product-media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.05));
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-card:hover .product-media img {
  transform: scale(1.055) translateY(-2px);
}

.product-media span {
  position: absolute;
  left: 14px;
  top: 14px;
  border-radius: 6px;
  background: rgba(var(--color-accent-rgb), 0.15);
  border: 1px solid rgba(var(--color-accent-rgb), 0.25);
  color: var(--color-accent-ink);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(var(--color-accent-rgb), 0.05);
  padding: 5px 10px;
  font-size: 0.78rem;
  font-weight: 900;
}

.product-body {
  display: grid;
  gap: 12px;
  padding: 20px;
}

.product-body > p {
  color: var(--color-link);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.product-body h3 {
  color: var(--color-heading);
  font-size: 1.32rem;
  line-height: 1.18;
}

.product-body ul {
  display: grid;
  gap: 6px;
  padding: 0 0 0 18px;
  margin: 0;
  color: var(--color-text-muted);
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.product-meta span {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 5px 9px;
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.process-section {
  background: var(--color-background);
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.process-step {
  border-top: 2px solid var(--color-heading);
  background: linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 52%, transparent), transparent);
  padding: 24px 0 0;
}

.process-step span {
  color: var(--color-link);
  font-size: 0.9rem;
  font-weight: 900;
}

.process-step h3 {
  margin-top: 14px;
  color: var(--color-heading);
  font-size: 1.28rem;
}

.process-step p {
  margin-top: 10px;
  color: var(--color-text-muted);
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
  /* 平滑缩放过渡 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 悬浮轻微放大，提升互动质感 */
.contact-band:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 35px 70px rgba(0, 0, 0, 0.1),
    inset 0 1px 0px rgba(255, 255, 255, 0.15);
}

/* 科技点阵背景网格 */
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

/* Vape 薄荷霓虹发光烟雾球 */
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
  animation: vapeSteam 12s ease-in-out infinite;
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
  animation: vapeSteamAlt 8s ease-in-out infinite;
}

/* 在暗色模式（即当前浅色卡片底）下，增强发光球的对比度和色彩饱和度，使其烟雾质感明显显现 */
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

.contact-band .primary-action {
  flex: 0 0 auto;
  background: var(--color-accent);
  color: #071018;
  z-index: 2;
}

.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.7s ease;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

@media (max-width: 980px) {
  .intro-grid,
  .process-grid {
    grid-template-columns: 1fr;
  }

  .category-grid,
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-content {
    align-items: start;
  }

  .category-card {
    min-height: 320px;
  }
}

@media (max-width: 680px) {
  .container {
    width: min(100% - 28px, 1180px);
  }

  .hero-section {
    min-height: min(720px, calc(100svh - 72px));
  }

  .hero-content {
    padding: 58px 0 34px;
  }

  .hero-copy h1 {
    font-size: clamp(2.2rem, 10vw, 3rem);
  }

  .hero-text {
    margin-top: 16px;
    line-height: 1.56;
  }

  .hero-actions {
    margin-top: 24px;
  }

  .hero-indicators {
    margin-top: 16px;
  }

  .hero-actions,
  .contact-band-inner {
    align-items: stretch;
    flex-direction: column;
  }

  .contact-band-inner {
    padding: 40px 24px;
    gap: 24px;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }

  .hero-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    margin-top: 26px;
  }

  .hero-metrics div {
    padding-top: 10px;
  }

  .hero-metrics dt {
    font-size: 0.98rem;
    line-height: 1.15;
  }

  .hero-metrics dd {
    font-size: 0.74rem;
    line-height: 1.35;
  }

  .category-grid,
  .product-grid {
    grid-template-columns: 1fr;
  }

  .section {
    padding: 54px 0;
  }

  .section-heading {
    align-items: start;
    flex-direction: column;
  }
}
</style>
