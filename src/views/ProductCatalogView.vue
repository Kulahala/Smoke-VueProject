<script setup>
import { computed, onMounted, ref } from 'vue';
import { inquiryEmail, store } from '../store';

const isReady = ref(false);

const groups = computed(() =>
  store.categoryGroups.map((group) => ({
    ...group,
    children: group.children.map((category) => ({
      ...category,
      products: store.getProductsByCategory(category.id),
    })),
  })),
);

const totalProducts = computed(() => store.products.length);

const mailtoLink = computed(
  () =>
    `mailto:${inquiryEmail}?subject=${encodeURIComponent(
      store.language === 'zh' ? '完整产品目录报价' : 'Full catalogue pricing request',
    )}&body=${encodeURIComponent(
      store.language === 'zh'
        ? '你好，我想获取完整产品目录、价格表、起订量、样品和交期信息。'
        : 'Hello, I would like to receive the full catalogue, price sheet, MOQ, samples, and lead time information.',
    )}`,
);

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});
</script>

<template>
  <div class="catalog-view" :class="{ ready: isReady }">
    <section class="catalog-hero">
      <div class="container catalog-hero-inner">
        <p class="eyebrow">{{ store.t('catalog.eyebrow') }}</p>
        <h1>{{ store.t('catalog.title') }}</h1>
        <p>{{ store.t('catalog.intro') }}</p>
        <div class="hero-actions">
          <a :href="mailtoLink" class="primary-action">{{ store.t('catalog.emailPricing') }}</a>
          <span>{{ totalProducts }} {{ store.t('catalog.models') }}</span>
        </div>
      </div>
    </section>

    <nav class="category-strip" :aria-label="store.t('catalog.jumpToCategory')">
      <div class="container strip-inner">
        <a v-for="group in groups" :key="group.id" :href="`#${group.id}`">
          {{ store.text(group, 'name') }}
        </a>
      </div>
    </nav>

    <main class="catalog-body">
      <section v-for="group in groups" :id="group.id" :key="group.id" class="group-section">
        <div class="container group-grid">
          <header class="group-heading">
            <p class="eyebrow">{{ store.t('catalog.allProducts') }}</p>
            <h2>{{ store.text(group, 'name') }}</h2>
            <p>{{ store.text(group, 'description') }}</p>
          </header>

          <div class="category-stack">
            <section v-for="category in group.children" :key="category.id" class="category-block">
              <div class="category-heading">
                <div>
                  <span>{{ store.text(category, 'shortName') }}</span>
                  <h3>{{ store.text(category, 'name') }}</h3>
                </div>
                <router-link :to="`/category/${category.id}`">{{ store.t('common.viewProducts') }}</router-link>
              </div>

              <div class="product-grid">
                <article v-for="product in category.products" :key="product.id" class="product-card">
                  <router-link :to="`/product/${product.id}`">
                    <div class="product-media">
                      <img :src="product.image" :alt="product.name" loading="lazy" decoding="async" />
                      <span>{{ store.text(product, 'badge') }}</span>
                    </div>
                    <div class="product-content">
                      <p>{{ store.text(category, 'name') }}</p>
                      <h4>{{ product.name }}</h4>
                      <ul>
                        <li v-for="highlight in store.list(product, 'highlights').slice(0, 2)" :key="highlight">
                          {{ highlight }}
                        </li>
                      </ul>
                      <div class="product-meta">
                        <span>{{ store.t('common.moq') }}: {{ store.text(product, 'moq') }}</span>
                        <span>{{ store.text(product, 'leadTime') }}</span>
                      </div>
                    </div>
                  </router-link>
                </article>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.catalog-view {
  background: var(--color-background);
}

.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.catalog-hero {
  display: grid;
  place-items: center;
  min-height: clamp(460px, 62vh, 680px);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-background-soft) 74%, transparent), transparent),
    radial-gradient(circle at 50% 18%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 38%);
  text-align: center;
}

.catalog-hero-inner {
  max-width: 900px;
  opacity: 0;
  transform: translateY(18px);
}

.ready .catalog-hero-inner,
.ready .group-heading,
.ready .category-block {
  animation: fadeInUp 0.56s ease forwards;
}

.eyebrow {
  margin-bottom: 12px;
  color: var(--color-link);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.catalog-hero h1 {
  color: var(--color-heading);
  font-size: clamp(2.8rem, 8vw, 6.2rem);
  line-height: 0.98;
  font-weight: 900;
}

.catalog-hero p:not(.eyebrow) {
  max-width: 720px;
  margin: 22px auto 0;
  color: var(--color-text-muted);
  font-size: clamp(1rem, 2vw, 1.22rem);
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 30px;
}

.primary-action {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: var(--color-heading);
  color: var(--color-background);
  padding: 0 22px;
  font-weight: 900;
  text-decoration: none;
}

.hero-actions span {
  color: var(--color-text-muted);
  font-weight: 800;
}

.category-strip {
  position: sticky;
  top: 72px;
  z-index: 100;
  border-block: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 88%, transparent);
  backdrop-filter: blur(18px);
}

.strip-inner {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}

.strip-inner a {
  flex: 0 0 auto;
  border-radius: 999px;
  color: var(--color-text);
  padding: 8px 14px;
  font-weight: 800;
  text-decoration: none;
}

.strip-inner a:hover {
  background: var(--color-accent-soft);
  color: var(--color-heading);
}

.catalog-body {
  display: grid;
}

.group-section {
  scroll-margin-top: 138px;
  padding: 88px 0;
}

.group-section:nth-child(even) {
  background: var(--color-background-soft);
}

.group-grid {
  display: grid;
  grid-template-columns: minmax(240px, 0.34fr) minmax(0, 1fr);
  gap: 46px;
  align-items: start;
}

.group-heading {
  position: sticky;
  top: 142px;
  opacity: 0;
  transform: translateY(18px);
}

.group-heading h2 {
  color: var(--color-heading);
  font-size: clamp(2.2rem, 4vw, 4rem);
  line-height: 1;
  font-weight: 900;
}

.group-heading p:not(.eyebrow) {
  margin-top: 16px;
  color: var(--color-text-muted);
}

.category-stack {
  display: grid;
  gap: 34px;
}

.category-block {
  opacity: 0;
  transform: translateY(18px);
}

.category-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
}

.category-heading span {
  color: var(--color-link);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.category-heading h3 {
  margin-top: 4px;
  color: var(--color-heading);
  font-size: clamp(1.6rem, 3vw, 2.35rem);
  line-height: 1.06;
  font-weight: 900;
}

.category-heading a {
  color: var(--color-link);
  font-weight: 900;
  text-decoration: none;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.product-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  overflow: hidden;
  box-shadow: 0 16px 38px var(--color-shadow);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-border-strong);
  box-shadow: 0 24px 58px var(--color-shadow-hover);
}

.product-card a {
  display: grid;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

.product-media {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1.16 / 1;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.24), transparent),
    var(--color-background-soft);
}

.product-media img {
  width: min(82%, 340px);
  height: 82%;
  object-fit: contain;
  transition: transform 0.28s ease;
}

.product-card:hover .product-media img {
  transform: scale(1.055);
}

.product-media span {
  position: absolute;
  top: 14px;
  left: 14px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent-ink);
  padding: 5px 10px;
  font-size: 0.76rem;
  font-weight: 900;
}

.product-content {
  display: grid;
  gap: 11px;
  padding: 20px;
}

.product-content > p {
  color: var(--color-link);
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}

.product-content h4 {
  color: var(--color-heading);
  font-size: 1.34rem;
  line-height: 1.12;
  font-weight: 900;
}

.product-content ul {
  display: grid;
  gap: 6px;
  padding-left: 18px;
  color: var(--color-text-muted);
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-meta span {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-text-muted);
  padding: 5px 9px;
  font-size: 0.82rem;
}

@media (max-width: 940px) {
  .group-grid,
  .product-grid {
    grid-template-columns: 1fr;
  }

  .group-heading {
    position: static;
  }
}

@media (max-width: 620px) {
  .container {
    width: min(100% - 28px, 1180px);
  }

  .catalog-hero {
    min-height: 420px;
  }

  .group-section {
    padding: 58px 0;
  }

  .category-heading,
  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-action {
    width: 100%;
  }
}
</style>
