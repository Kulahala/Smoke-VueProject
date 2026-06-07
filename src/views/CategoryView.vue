<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { inquiryEmail, store } from '../store';

const route = useRoute();
const isReady = ref(false);

const categoryId = computed(() => route.params.id);
const category = computed(() => store.getCategory(categoryId.value));
const categoryGroup = computed(() => store.getCategoryGroup(categoryId.value));
const products = computed(() => store.getProductsByCategory(categoryId.value));
const mailtoLink = computed(() => {
  const subject = category.value
    ? `${store.text(category.value, 'name')} ${store.language === 'zh' ? '批发询盘' : 'wholesale inquiry'}`
    : store.language === 'zh'
      ? '批发产品询盘'
      : 'Wholesale product inquiry';
  const body =
    store.language === 'zh'
      ? '你好，我想了解该分类的价格表、起订量、样品和交期信息。'
      : 'Hello, I would like to receive this category price sheet, MOQ, sample, and lead time information.';
  return `mailto:${inquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});
</script>

<template>
  <div class="category-view" :class="{ ready: isReady }">
    <section v-if="category" class="category-hero">
      <img
        :src="category.heroImage"
        :alt="store.text(category, 'name')"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
      <div class="category-hero-overlay"></div>
      <div class="container category-hero-content">
        <p class="eyebrow">{{ categoryGroup ? store.text(categoryGroup, 'name') : store.t('category.productsFallback') }}</p>
        <h1>{{ store.text(category, 'name') }}</h1>
        <p>{{ store.text(category, 'description') }}</p>
        <div class="category-actions">
          <a :href="mailtoLink" class="primary-action">{{ store.t('category.emailPricing') }}</a>
          <router-link to="/products" class="secondary-action">{{ store.t('common.backCatalogue') }}</router-link>
        </div>
      </div>
    </section>

    <main class="container page-grid">
      <aside v-if="categoryGroup" class="side-panel">
        <span>{{ store.t('category.directory') }}</span>
        <h2>{{ store.text(categoryGroup, 'name') }}</h2>
        <p>{{ store.text(categoryGroup, 'description') }}</p>
        <nav aria-label="Category group">
          <router-link
            v-for="child in categoryGroup.children"
            :key="child.id"
            :class="{ active: child.id === categoryId }"
            :to="`/category/${child.id}`"
          >
            {{ store.text(child, 'name') }}
          </router-link>
        </nav>
      </aside>

      <section class="products-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">{{ store.t('category.catalogueItems') }}</p>
            <h2>{{ products.length }} {{ store.t('category.modelsAvailable') }}</h2>
          </div>
          <p>{{ store.t('category.helpText') }}</p>
        </div>

        <div v-if="products.length" class="product-grid">
          <article v-for="product in products" :key="product.id" class="product-card">
            <router-link :to="`/product/${product.id}`">
              <div class="product-media">
                <img :src="product.image" :alt="product.name" loading="lazy" decoding="async" />
                <span>{{ store.text(product, 'badge') }}</span>
              </div>
              <div class="product-content">
                <h3>{{ product.name }}</h3>
                <p>{{ store.text(product, 'description') }}</p>
                <div class="product-meta">
                  <span>{{ store.t('common.moq') }}: {{ store.text(product, 'moq') }}</span>
                  <span>{{ store.text(product, 'leadTime') }}</span>
                </div>
              </div>
            </router-link>
          </article>
        </div>

        <div v-else class="empty-state">
          <h2>{{ store.t('category.emptyTitle') }}</h2>
          <p>
            {{ store.t('category.emptyTextPrefix') }} <code>src/store/index.js</code>
            {{ store.t('category.emptyTextSuffix') }} '{{ categoryId }}'.
          </p>
        </div>
      </section>
    </main>

    <section class="contact-band">
      <div class="contact-band-inner">
        <div>
          <p class="eyebrow">{{ store.t('common.wholesaleInquiry') }}</p>
          <h2>{{ store.t('category.priceSheet') }}</h2>
        </div>
        <a :href="mailtoLink" class="primary-action">{{ store.t('common.contact') }} {{ inquiryEmail }}</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.category-hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: end;
  color: #fff;
  overflow: hidden;
  isolation: isolate;
}

.category-hero img,
.category-hero-overlay {
  position: absolute;
  inset: 0;
}

.category-hero img {
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-hero-overlay {
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(8, 14, 22, 0.9), rgba(8, 14, 22, 0.48)),
    linear-gradient(180deg, rgba(8, 14, 22, 0.08), rgba(8, 14, 22, 0.72));
}

.category-hero-content {
  padding: 92px 0 56px;
  opacity: 0;
  transform: translateY(18px);
}

.ready .category-hero-content,
.ready .side-panel,
.ready .products-section,
.ready .contact-band-inner {
  animation: fadeInUp 0.55s ease forwards;
}

.category-hero h1 {
  max-width: 780px;
  color: #fff;
  font-size: clamp(2.6rem, 8vw, 5.4rem);
  line-height: 0.98;
  font-weight: 900;
}

.category-hero p:not(.eyebrow) {
  max-width: 660px;
  margin-top: 18px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.08rem;
}

.eyebrow {
  margin-bottom: 12px;
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.category-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.primary-action,
.secondary-action {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0 18px;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease;
}

.primary-action {
  background: var(--color-accent);
  color: var(--color-accent-ink);
}

.secondary-action {
  border: 1px solid rgba(255, 255, 255, 0.42);
  color: #fff;
}

.primary-action:hover,
.secondary-action:hover {
  transform: translateY(-2px);
}

.page-grid {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 36px;
  padding: 70px 0;
}

.side-panel,
.products-section {
  opacity: 0;
  transform: translateY(18px);
}

.side-panel {
  position: sticky;
  top: 98px;
  align-self: start;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 18px 40px var(--color-shadow);
  padding: 22px;
}

.side-panel span {
  color: var(--color-link);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.side-panel h2 {
  margin-top: 8px;
  color: var(--color-heading);
  font-size: 1.35rem;
}

.side-panel p {
  margin-top: 10px;
  color: var(--color-text-muted);
}

.side-panel nav {
  display: grid;
  gap: 8px;
  margin-top: 20px;
}

.side-panel a {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  padding: 10px 12px;
  text-decoration: none;
}

.side-panel a.active,
.side-panel a:hover {
  border-color: var(--color-border-strong);
  background: var(--color-accent-soft);
  color: var(--color-heading);
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(250px, 0.45fr);
  gap: 30px;
  align-items: end;
  margin-bottom: 28px;
}

.section-heading h2 {
  color: var(--color-heading);
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.06;
  font-weight: 900;
}

.section-heading > p {
  color: var(--color-text-muted);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.product-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface-elevated) 82%, transparent), transparent),
    var(--color-surface);
  overflow: hidden;
  box-shadow: 0 16px 38px var(--color-shadow);
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
  border-radius: 999px;
  background: rgba(var(--color-accent-rgb), 0.15);
  border: 1px solid rgba(var(--color-accent-rgb), 0.25);
  color: var(--color-link);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(var(--color-accent-rgb), 0.05);
  padding: 5px 10px;
  font-size: 0.78rem;
  font-weight: 900;
}

.product-content {
  display: grid;
  gap: 12px;
  padding: 20px;
}

.product-content h3 {
  color: var(--color-heading);
  font-size: 1.32rem;
}

.product-content p {
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

.empty-state {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  padding: 36px;
}

.empty-state h2 {
  color: var(--color-heading);
}

.empty-state p {
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

html.dark .contact-band::after {
  background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.5) 0%, rgba(var(--color-accent-rgb), 0.12) 45%, transparent 70%);
  filter: blur(30px);
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
  opacity: 0;
  transform: translateY(18px);
}

.contact-band h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.08;
  font-weight: 900;
}

@media (max-width: 900px) {
  .page-grid,
  .section-heading,
  .product-grid {
    grid-template-columns: 1fr;
  }

  .side-panel {
    position: static;
  }
}

@media (max-width: 620px) {
  .container {
    width: min(100% - 28px, 1180px);
  }

  .category-hero {
    min-height: 380px;
  }

  .category-actions,
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

  .page-grid {
    padding: 48px 0;
  }
}
</style>
