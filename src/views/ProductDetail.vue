<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { inquiryEmail, store } from '../store';

const route = useRoute();
const isReady = ref(false);

const productId = computed(() => parseInt(route.params.id));
const product = computed(() => store.getProduct(productId.value));
const category = computed(() => (product.value ? store.getCategory(product.value.category) : null));
const categoryGroup = computed(() => (product.value ? store.getCategoryGroup(product.value.category) : null));
const relatedProducts = computed(() =>
  product.value
    ? store.getProductsByCategory(product.value.category).filter((item) => item.id !== product.value.id)
    : [],
);
const mailtoLink = computed(() => {
  const subject = product.value
    ? `${product.value.name} ${store.language === 'zh' ? '批发询盘' : 'wholesale inquiry'}`
    : store.language === 'zh'
      ? '批发产品询盘'
      : 'Wholesale product inquiry';
  const body = product.value
    ? store.language === 'zh'
      ? `你好，我对 ${product.value.name} 感兴趣。请发送价格、起订量、交期、样品和 OEM 包装选项。`
      : `Hello, I am interested in ${product.value.name}. Please send pricing, MOQ, lead time, samples, and OEM packaging options.`
    : store.language === 'zh'
      ? '你好，请发送批发目录和报价信息。'
      : 'Hello, please send wholesale catalogue and quotation information.';
  return `mailto:${inquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

onMounted(() => {
  requestAnimationFrame(() => {
    isReady.value = true;
  });
});
</script>

<template>
  <div class="product-page" :class="{ ready: isReady }">
    <main v-if="product" class="container product-layout">
      <section class="product-gallery">
        <div class="image-frame">
          <img :src="product.image" :alt="product.name" loading="eager" fetchpriority="high" decoding="async" />
        </div>
        <div class="thumb-strip" aria-label="Product image notes">
          <span>{{ store.text(product, 'badge') }}</span>
          <span>{{ store.text(categoryGroup, 'name') }}</span>
          <span>{{ store.text(category, 'name') }}</span>
        </div>
      </section>

      <section class="product-info">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <router-link to="/">{{ store.t('nav.home') }}</router-link>
          <span>/</span>
          <router-link v-if="category" :to="`/category/${category.id}`">
            {{ store.text(category, 'name') }}
          </router-link>
        </nav>

        <p class="eyebrow">{{ store.t('product.detail') }}</p>
        <h1>{{ product.name }}</h1>
        <p class="description">{{ store.text(product, 'description') }}</p>

        <div class="quick-specs">
          <div>
            <span>{{ store.t('common.moq') }}</span>
            <strong>{{ store.text(product, 'moq') }}</strong>
          </div>
          <div>
            <span>{{ store.t('common.leadTime') }}</span>
            <strong>{{ store.text(product, 'leadTime') }}</strong>
          </div>
          <div>
            <span>{{ store.t('common.orderMode') }}</span>
            <strong>{{ store.t('common.emailInquiry') }}</strong>
          </div>
        </div>

        <div class="highlight-panel">
          <h2>{{ store.t('product.highlights') }}</h2>
          <ul>
            <li v-for="highlight in store.list(product, 'highlights')" :key="highlight">{{ highlight }}</li>
          </ul>
        </div>

        <div class="spec-table">
          <h2>{{ store.t('product.specification') }}</h2>
          <dl>
            <div v-for="spec in store.list(product, 'specs')" :key="spec.label">
              <dt>{{ spec.label }}</dt>
              <dd>{{ spec.value }}</dd>
            </div>
          </dl>
        </div>

        <div class="inquiry-card">
          <div>
            <span>{{ store.t('common.wholesaleInquiry') }}</span>
            <h2>{{ store.t('product.requestTitle') }}</h2>
            <p>{{ store.t('product.requestText') }}</p>
          </div>
          <a :href="mailtoLink">{{ store.t('common.emailInquiry') }} {{ inquiryEmail }}</a>
        </div>
      </section>
    </main>

    <section v-if="product && relatedProducts.length" class="related-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ store.t('product.sameCategory') }}</p>
          <h2>{{ store.t('product.related') }}</h2>
        </div>
        <div class="related-grid">
          <router-link v-for="item in relatedProducts" :key="item.id" :to="`/product/${item.id}`" class="related-card">
            <img :src="item.image" :alt="item.name" loading="lazy" decoding="async" />
            <span>{{ store.text(item, 'badge') }}</span>
            <h3>{{ item.name }}</h3>
          </router-link>
        </div>
      </div>
    </section>

    <main v-if="!product" class="container missing-product">
      <h1>{{ store.t('product.notFound') }}</h1>
      <p>{{ store.t('product.notFoundText') }}</p>
      <router-link to="/">{{ store.t('common.backHome') }}</router-link>
    </main>
  </div>
</template>

<style scoped>
.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

.product-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.82fr) minmax(0, 1fr);
  gap: 56px;
  padding: 72px 0;
}

.product-gallery,
.product-info,
.related-section,
.missing-product {
  opacity: 0;
  transform: translateY(18px);
}

.ready .product-gallery,
.ready .product-info,
.ready .related-section,
.ready .missing-product {
  animation: fadeInUp 0.55s ease forwards;
}

.ready .product-info {
  animation-delay: 0.08s;
}

.product-gallery {
  position: sticky;
  top: 104px;
  align-self: start;
}

.image-frame {
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 1.08;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(16, 24, 32, 0.05), rgba(120, 240, 209, 0.12)),
    var(--color-surface);
  box-shadow: 0 24px 62px var(--color-shadow);
  overflow: hidden;
}

.image-frame img {
  width: min(86%, 520px);
  height: 86%;
  object-fit: contain;
  transition: transform 0.32s ease;
}

.image-frame:hover img {
  transform: scale(1.045);
}

.thumb-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.thumb-strip span {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  padding: 6px 10px;
  font-size: 0.82rem;
  font-weight: 800;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.breadcrumb a {
  color: var(--color-link);
  text-decoration: none;
  font-weight: 800;
}

.eyebrow {
  margin-bottom: 10px;
  color: var(--color-link);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.product-info h1 {
  color: var(--color-heading);
  font-size: clamp(2.6rem, 6vw, 5rem);
  line-height: 0.98;
  font-weight: 900;
}

.description {
  max-width: 760px;
  margin-top: 20px;
  color: var(--color-text-muted);
  font-size: 1.08rem;
  line-height: 1.75;
}

.quick-specs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 30px;
}

.quick-specs div,
.highlight-panel,
.spec-table,
.inquiry-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 18px 42px var(--color-shadow);
}

.quick-specs div {
  padding: 18px;
}

.quick-specs span,
.inquiry-card span {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.quick-specs strong {
  display: block;
  margin-top: 6px;
  color: var(--color-heading);
  font-size: 1.16rem;
}

.highlight-panel,
.spec-table,
.inquiry-card {
  margin-top: 18px;
  padding: 24px;
}

.highlight-panel h2,
.spec-table h2,
.inquiry-card h2 {
  color: var(--color-heading);
  font-size: 1.26rem;
  font-weight: 900;
}

.highlight-panel ul {
  display: grid;
  gap: 10px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.highlight-panel li {
  position: relative;
  padding-left: 18px;
  color: var(--color-text);
}

.highlight-panel li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
}

.spec-table dl {
  display: grid;
  margin-top: 16px;
}

.spec-table div {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 18px;
  border-top: 1px solid var(--color-border);
  padding: 13px 0;
}

.spec-table dt {
  color: var(--color-text-muted);
  font-weight: 800;
}

.spec-table dd {
  color: var(--color-heading);
  font-weight: 800;
}

.inquiry-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 22px;
  align-items: center;
  background: var(--color-heading);
}

.inquiry-card h2,
.inquiry-card p,
.inquiry-card span {
  color: var(--color-background);
}

.inquiry-card p {
  margin-top: 8px;
  opacity: 0.72;
}

.inquiry-card a {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--color-accent);
  color: var(--color-accent-ink);
  padding: 0 18px;
  font-weight: 900;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.18s ease;
}

.inquiry-card a:hover {
  transform: translateY(-2px);
}

.related-section {
  background: var(--color-background-soft);
  padding: 66px 0;
}

.section-heading h2 {
  color: var(--color-heading);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.06;
  font-weight: 900;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 26px;
}

.related-card {
  display: grid;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-heading);
  padding: 14px;
  text-decoration: none;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 48px var(--color-shadow-hover);
}

.related-card img {
  width: 100%;
  aspect-ratio: 1.25 / 1;
  border-radius: 6px;
  background: var(--color-background);
  object-fit: contain;
  transition: transform 0.28s ease;
}

.related-card:hover img {
  transform: scale(1.04);
}

.related-card span {
  color: var(--color-link);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.related-card h3 {
  font-size: 1.16rem;
  font-weight: 900;
}

.missing-product {
  padding: 90px 0;
}

.missing-product h1 {
  color: var(--color-heading);
  font-size: clamp(2.5rem, 7vw, 4.8rem);
  font-weight: 900;
}

.missing-product p {
  margin-top: 12px;
  color: var(--color-text-muted);
}

.missing-product a {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  background: var(--color-heading);
  color: var(--color-background);
  margin-top: 22px;
  padding: 0 18px;
  text-decoration: none;
  font-weight: 900;
}

@media (max-width: 940px) {
  .product-layout,
  .inquiry-card,
  .related-grid {
    grid-template-columns: 1fr;
  }

  .product-gallery {
    position: static;
  }

  .inquiry-card a {
    width: 100%;
  }
}

@media (max-width: 620px) {
  .container {
    width: min(100% - 28px, 1180px);
  }

  .product-layout {
    gap: 34px;
    padding: 46px 0;
  }

  .quick-specs,
  .spec-table div {
    grid-template-columns: 1fr;
  }

  .spec-table div {
    gap: 4px;
  }
}
</style>
