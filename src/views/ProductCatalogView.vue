<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { inquiryEmail, store } from '../store';

const route = useRoute();
const isReady = ref(false);
const activeGroupId = ref('');
let isScrolling = false;

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

const onScroll = () => {
  if (isScrolling) return;

  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  // 滚动到底部时，直接激活最后一个分类
  if (scrollTop + clientHeight >= scrollHeight - 30) {
    if (groups.value.length > 0) {
      activeGroupId.value = groups.value[groups.value.length - 1].id;
      return;
    }
  }

  // 计算当前滚动线（设在导航栏下方，约 160px）落在哪一个 section
  const scrollPosition = scrollTop + 160;
  let currentActiveId = '';

  for (const group of groups.value) {
    const el = document.getElementById(group.id);
    if (el) {
      if (el.offsetTop <= scrollPosition) {
        currentActiveId = group.id;
      }
    }
  }

  // 默认高亮第一个
  if (!currentActiveId && groups.value.length > 0) {
    currentActiveId = groups.value[0].id;
  }

  activeGroupId.value = currentActiveId;
};

const scrollToGroup = (event, id) => {
  if (event) event.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    isScrolling = true;
    activeGroupId.value = id;
    el.scrollIntoView({ behavior: 'smooth' });
    history.pushState(null, null, `#${id}`);

    setTimeout(() => {
      isScrolling = false;
    }, 800);
  }
};

watch(activeGroupId, (newId) => {
  if (!newId) return;
  setTimeout(() => {
    const activeEl = document.querySelector('.strip-inner a.active');
    const container = document.querySelector('.strip-inner');
    if (activeEl && container) {
      const containerWidth = container.clientWidth;
      const activeWidth = activeEl.clientWidth;
      const activeLeft = activeEl.offsetLeft;
      const targetScrollLeft = activeLeft - (containerWidth / 2) + (activeWidth / 2);
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, 60);
});

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });

  requestAnimationFrame(() => {
    isReady.value = true;
    if (route.hash) {
      const hashId = route.hash.replace('#', '');
      setTimeout(() => {
        scrollToGroup(null, hashId);
      }, 150);
    } else {
      onScroll();
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
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
        <a
          v-for="group in groups"
          :key="group.id"
          :href="`#${group.id}`"
          :class="{ active: activeGroupId === group.id }"
          @click="scrollToGroup($event, group.id)"
        >
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
  background:
    linear-gradient(180deg, var(--color-background), color-mix(in srgb, var(--color-background-soft) 52%, var(--color-background))),
    var(--color-background);
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
    linear-gradient(180deg, color-mix(in srgb, var(--color-background-soft) 82%, transparent), transparent 78%),
    repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-heading) 5%, transparent) 0 1px, transparent 1px 84px),
    repeating-linear-gradient(180deg, color-mix(in srgb, var(--color-heading) 4%, transparent) 0 1px, transparent 1px 84px);
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
  animation: fadeInUp 0.56s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.product-card {
  opacity: 0;
  transform: translateY(18px);
}

.ready .product-card {
  animation: fadeInUp 0.56s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.ready .product-card:nth-child(1) { animation-delay: 0.05s; }
.ready .product-card:nth-child(2) { animation-delay: 0.12s; }
.ready .product-card:nth-child(3) { animation-delay: 0.19s; }
.ready .product-card:nth-child(4) { animation-delay: 0.26s; }
.ready .product-card:nth-child(5) { animation-delay: 0.33s; }
.ready .product-card:nth-child(6) { animation-delay: 0.40s; }

.eyebrow {
  margin-bottom: 12px;
  color: var(--color-link);
  font-family: var(--font-mono);
  font-size: 0.72rem;
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
  border-radius: 8px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 44%),
    var(--color-heading);
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
  top: 68px;
  z-index: 100;
  border-block: 1px solid var(--color-border);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-background) 94%, transparent), color-mix(in srgb, var(--color-background) 86%, transparent)),
    color-mix(in srgb, var(--color-background) 90%, transparent);
  backdrop-filter: blur(20px) saturate(1.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.02);
}

.strip-inner {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}

.strip-inner a {
  flex: 0 0 auto;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--color-text);
  padding: 8px 14px;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.strip-inner a:hover {
  border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
  background: var(--color-accent-soft);
  color: var(--color-link);
}

.strip-inner a.active {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
  color: var(--color-link);
}

.catalog-body {
  display: grid;
}

.group-section {
  scroll-margin-top: 138px;
  padding: 88px 0;
}

.group-section:nth-child(even) {
  background:
    linear-gradient(180deg, var(--color-background-soft), color-mix(in srgb, var(--color-background) 34%, var(--color-background-soft))),
    var(--color-background-soft);
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
  border-left: 2px solid var(--color-accent);
  padding-left: 18px;
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
  border-top: 1px solid var(--color-border);
  padding-top: 18px;
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
  font-family: var(--font-mono);
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
  border-bottom: 1px solid currentColor;
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
  top: 14px;
  left: 14px;
  border-radius: 6px;
  background: rgba(var(--color-accent-rgb), 0.15);
  border: 1px solid rgba(var(--color-accent-rgb), 0.25);
  color: var(--color-link);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(var(--color-accent-rgb), 0.05);
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
  font-family: var(--font-mono);
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
  border-radius: 6px;
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
