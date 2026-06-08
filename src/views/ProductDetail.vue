<script setup>
import { computed, onMounted, ref, watch } from 'vue';
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

const isLightboxOpen = ref(false);
const activeImage = ref('');
const productImages = computed(() => {
  if (product.value) {
    if (Array.isArray(product.value.images) && product.value.images.length > 0) {
      return product.value.images;
    }
    return [product.value.image];
  }
  return [];
});

watch(
  () => product.value,
  (newProd) => {
    if (newProd) {
      activeImage.value = newProd.images?.[0] || newProd.image || '';
    }
  },
  { immediate: true }
);

const prevImage = () => {
  const idx = productImages.value.indexOf(activeImage.value);
  if (idx > 0) {
    activeImage.value = productImages.value[idx - 1];
  } else {
    activeImage.value = productImages.value[productImages.value.length - 1];
  }
};

const nextImage = () => {
  const idx = productImages.value.indexOf(activeImage.value);
  if (idx < productImages.value.length - 1) {
    activeImage.value = productImages.value[idx + 1];
  } else {
    activeImage.value = productImages.value[0];
  }
};

const touchStartX = ref(0);
const touchEndX = ref(0);

const handleTouchStart = (e) => {
  touchStartX.value = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].screenX;
  handleSwipe();
};

const handleSwipe = () => {
  const swipeThreshold = 50;
  const diff = touchEndX.value - touchStartX.value;
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      prevImage();
    } else {
      nextImage();
    }
  }
};

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
        <div class="image-frame-container">
          <div 
            class="image-frame" 
            @click="isLightboxOpen = true" 
            style="cursor: zoom-in;" 
            title="Click to view large image"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <img :src="activeImage" :alt="product.name" loading="eager" fetchpriority="high" decoding="async" />
          </div>

          <!-- 导航切换按钮 -->
          <button v-if="productImages.length > 1" class="gallery-nav-btn prev-btn" @click.stop="prevImage" aria-label="Previous image">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button v-if="productImages.length > 1" class="gallery-nav-btn next-btn" @click.stop="nextImage" aria-label="Next image">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <!-- 多图切换缩略图栏 -->
        <div v-if="productImages.length > 1" class="gallery-thumbs" aria-label="Product gallery">
          <button
            v-for="(img, idx) in productImages"
            :key="idx"
            type="button"
            :class="['thumb-btn', { active: activeImage === img }]"
            @click="activeImage = img"
          >
            <img :src="img" :alt="`${product.name} detail ${idx + 1}`" loading="lazy" />
          </button>
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
          <div class="vape-glow-2"></div>
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

    <!-- 全屏大图灯箱 (Lightbox) -->
    <transition name="lightbox-fade">
      <div v-if="isLightboxOpen" class="lightbox-overlay" @click="isLightboxOpen = false">
        <button class="lightbox-close" @click="isLightboxOpen = false" aria-label="Close image">&times;</button>
        <div class="lightbox-content" @click.stop>
          <img :src="activeImage" :alt="product.name" />
        </div>
      </div>
    </transition>
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

.related-card {
  opacity: 0;
  transform: translateY(18px);
}

.ready .related-card {
  animation: fadeInUp 0.56s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.ready .related-card:nth-child(1) { animation-delay: 0.12s; }
.ready .related-card:nth-child(2) { animation-delay: 0.19s; }
.ready .related-card:nth-child(3) { animation-delay: 0.26s; }

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
  background: #ffffff;
  box-shadow: 0 24px 62px var(--color-shadow);
  overflow: hidden;
  padding: 24px;
}

.image-frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.06));
  transition: transform 0.32s ease;
}

.image-frame:hover img {
  transform: scale(1.045);
}

.gallery-thumbs {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--color-accent-rgb), 0.25) rgba(255, 255, 255, 0.03);
}

.gallery-thumbs::-webkit-scrollbar {
  height: 4px;
}

.gallery-thumbs::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 99px;
}

.gallery-thumbs::-webkit-scrollbar-thumb {
  background: rgba(var(--color-accent-rgb), 0.25);
  border-radius: 99px;
}

.gallery-thumbs::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
}

.thumb-btn {
  width: 68px;
  height: 68px;
  flex-shrink: 0;
  padding: 6px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  overflow: hidden;
  display: grid;
  place-items: center;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px var(--color-shadow);
}

.thumb-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--color-accent-rgb), 0.5);
}

.thumb-btn.active {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(var(--color-accent-rgb), 0.15), 0 4px 12px var(--color-shadow);
}

.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.22s ease;
}

.thumb-btn:hover img {
  transform: scale(1.05);
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
  background: color-mix(in srgb, var(--color-surface) 68%, transparent);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  color: var(--color-text-muted);
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
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
  background: linear-gradient(135deg, var(--color-heading) 0%, color-mix(in srgb, var(--color-heading) 85%, var(--color-accent)) 100%);
  position: relative;
  overflow: hidden;
}

.inquiry-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--color-background) 1.2px, transparent 1.2px);
  background-size: 24px 24px;
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
}

.inquiry-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.28) 0%, rgba(var(--color-accent-rgb), 0.05) 50%, transparent 70%);
  filter: blur(28px);
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.3s ease;
  animation: vapeSteam 10s ease-in-out infinite;
}

/* Vape 左下角小霓虹发光球 */
.vape-glow-2 {
  position: absolute;
  bottom: -60%;
  left: -10%;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.22) 0%, rgba(var(--color-accent-rgb), 0.04) 50%, transparent 70%);
  filter: blur(24px);
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.3s ease;
  animation: vapeSteamAlt 8s ease-in-out infinite;
}

html.dark .inquiry-card::after {
  background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.5) 0%, rgba(var(--color-accent-rgb), 0.12) 45%, transparent 70%);
  filter: blur(24px);
}

html.dark .vape-glow-2 {
  background: radial-gradient(circle, rgba(var(--color-accent-rgb), 0.4) 0%, rgba(var(--color-accent-rgb), 0.1) 45%, transparent 70%);
  filter: blur(20px);
}

.inquiry-card > div:not(.vape-glow-2),
.inquiry-card a {
  position: relative;
  z-index: 2;
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
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.inquiry-card a:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 20px rgba(var(--color-accent-rgb), 0.4),
    0 0 12px rgba(var(--color-accent-rgb), 0.2);
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
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.related-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-accent);
  box-shadow: 
    0 20px 48px var(--color-shadow-hover),
    0 0 16px color-mix(in srgb, var(--color-accent) 20%, transparent);
}

.related-card img {
  width: 100%;
  aspect-ratio: 1.25 / 1;
  border-radius: 6px;
  background: #ffffff;
  padding: 8px;
  border: 1px solid var(--color-border);
  object-fit: contain;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.04));
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.related-card:hover img {
  transform: scale(1.055) translateY(-1px);
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

/* 全屏大图灯箱 (Lightbox) */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 10, 10, 0.88);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.lightbox-close {
  position: absolute;
  top: 24px;
  right: 30px;
  background: none;
  border: none;
  color: #fff;
  font-size: 3rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s, transform 0.2s;
  z-index: 2010;
}

.lightbox-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

.lightbox-content {
  max-width: min(1200px, 90vw);
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 
    0 30px 90px rgba(0, 0, 0, 0.65),
    0 0 32px rgba(255, 255, 255, 0.05);
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}



/* 渐变动画 */
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

@keyframes scaleIn {
  from {
    transform: scale(0.96);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.image-frame-container {
  position: relative;
}

.gallery-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #111;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  opacity: 0;
  pointer-events: none;
}

.image-frame-container:hover .gallery-nav-btn {
  opacity: 1;
  pointer-events: auto;
}

.gallery-nav-btn:hover {
  background: #ffffff;
  color: var(--color-accent, #10b981);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
  transform: translateY(-50%) scale(1.05);
}

.gallery-nav-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.prev-btn {
  left: 16px;
}

.next-btn {
  right: 16px;
}

@media (hover: none), (max-width: 768px) {
  .gallery-nav-btn {
    width: 38px;
    height: 38px;
    background: rgba(255, 255, 255, 0.6);
    left: 8px;
    opacity: 0.8;
    pointer-events: auto;
  }
  .next-btn {
    right: 8px;
    left: auto;
  }
}
</style>
