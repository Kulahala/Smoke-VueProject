<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { inquiryEmail, store } from './store';

const isMenuOpen = ref(false);
const isUtilityOpen = ref(false);
const controlsRef = ref(null);
const systemPrefersDark = ref(false);
const route = useRoute();
const themeOptions = [
  { value: 'system', labelKey: 'theme.system' },
  { value: 'light', labelKey: 'theme.light' },
  { value: 'dark', labelKey: 'theme.dark' },
];
const languageOptions = [
  { value: 'en', labelKey: 'lang.en' },
  { value: 'zh', labelKey: 'lang.zh' },
];

let mediaQuery;
const siteUrl = 'https://www.bestlinksz.com';

const isDark = computed(() => {
  if (store.theme === 'system') return systemPrefersDark.value;
  return store.theme === 'dark';
});

const setTheme = (theme) => {
  store.setTheme(theme);
};

const setLanguage = (language) => {
  store.setLanguage(language);
};

const closeMenu = () => {
  isMenuOpen.value = false;
  isUtilityOpen.value = false;
};

const updateSystemTheme = () => {
  systemPrefersDark.value = Boolean(mediaQuery?.matches);
};

const handleDocumentClick = (event) => {
  if (!isUtilityOpen.value || !controlsRef.value) return;
  if (!controlsRef.value.contains(event.target)) {
    isUtilityOpen.value = false;
  }
};

const activeThemeLabel = computed(() => {
  const option = themeOptions.find((item) => item.value === store.theme) || themeOptions[0];
  return store.t(option.labelKey);
});

const activeLanguageLabel = computed(() => (store.language === 'zh' ? store.t('lang.zh') : store.t('lang.en')));

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  updateSystemTheme();
  mediaQuery.addEventListener?.('change', updateSystemTheme);
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener?.('change', updateSystemTheme);
  document.removeEventListener('click', handleDocumentClick);
});

const setMeta = (selector, attribute, value) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const match = selector.match(/\[(name|property)="(.+)"\]/);
    if (match) element.setAttribute(match[1], match[2]);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
};

const setCanonical = (href) => {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const setStructuredData = (data) => {
  let element = document.head.querySelector('#structured-data');
  if (!element) {
    element = document.createElement('script');
    element.id = 'structured-data';
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
};

const pageSeo = computed(() => {
  const path = route.path;
  const routeUrl = `${siteUrl}${path === '/' ? '/' : path}`;

  if (route.name === 'Category') {
    const category = store.getCategory(route.params.id);
    const title = category
      ? `${store.text(category, 'name')} | ${store.language === 'zh' ? 'BestLinksz B2B 电子烟目录' : 'BestLinksz B2B Vape Catalogue'}`
      : store.t('seo.homeTitle');
    const description = category
      ? `${store.text(category, 'description')} ${store.t('home.contactTitle')}`
      : store.t('seo.homeDescription');
    return { title, description, url: routeUrl, image: category?.heroImage || '/电子烟/雾化器主页1.jpg' };
  }

  if (route.name === 'Product') {
    const product = store.getProduct(route.params.id);
    const title = product
      ? `${store.text(product, 'name')} | ${store.language === 'zh' ? '批发询盘' : 'Wholesale Inquiry'}`
      : store.t('product.notFound');
    const description = product ? store.text(product, 'description') : store.t('product.notFoundText');
    return { title, description, url: routeUrl, image: product?.image || '/电子烟/雾化器主页1.jpg' };
  }

  if (route.name === 'Products') {
    return {
      title: `${store.t('catalog.title')} | BestLinksz`,
      description: store.t('catalog.intro'),
      url: routeUrl,
      image: '/电子烟/placeholders/disposable-max.svg',
    };
  }

  if (route.name === 'About') {
    return {
      title: `${store.t('nav.company')} | BestLinksz`,
      description:
        store.language === 'zh'
          ? 'BestLinksz 面向海外商业买家提供电子烟批发目录、OEM 包装、样品和邮箱询盘支持。'
          : 'BestLinksz provides a B2B vape catalogue, OEM packaging, sample coordination, and email inquiry support for overseas business buyers.',
      url: routeUrl,
      image: '/电子烟/placeholders/packaging-suite.svg',
    };
  }

  if (route.name === 'Blog') {
    return {
      title: `${store.t('nav.resources')} | BestLinksz`,
      description:
        store.language === 'zh'
          ? '电子烟批发询盘、样品、OEM 包装和目录维护说明。'
          : 'Buyer notes for wholesale vape inquiries, samples, OEM packaging, and catalogue maintenance.',
      url: routeUrl,
      image: '/电子烟/placeholders/sample-board.svg',
    };
  }

  return {
    title: store.t('seo.homeTitle'),
    description: store.t('seo.homeDescription'),
    url: routeUrl,
    image: '/电子烟/placeholders/pod-slim.svg',
  };
});

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value);
  document.documentElement.lang = store.language === 'zh' ? 'zh-CN' : 'en';

  const seo = pageSeo.value;
  const absoluteImage = seo.image.startsWith('http') ? seo.image : `${siteUrl}${seo.image}`;
  document.title = seo.title;
  setMeta('meta[name="description"]', 'content', seo.description);
  setMeta('meta[property="og:title"]', 'content', seo.title);
  setMeta('meta[property="og:description"]', 'content', seo.description);
  setMeta('meta[property="og:url"]', 'content', seo.url);
  setMeta('meta[property="og:image"]', 'content', absoluteImage);
  setMeta('meta[property="og:locale"]', 'content', store.language === 'zh' ? 'zh_CN' : 'en_US');
  setMeta('meta[name="twitter:title"]', 'content', seo.title);
  setMeta('meta[name="twitter:description"]', 'content', seo.description);
  setMeta('meta[name="twitter:image"]', 'content', absoluteImage);
  setCanonical(seo.url);

  const product = route.name === 'Product' ? store.getProduct(route.params.id) : null;
  setStructuredData(
    product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: absoluteImage,
          description: store.text(product, 'description'),
          brand: { '@type': 'Brand', name: 'BestLinksz' },
          category: store.text(store.getCategory(product.category), 'name'),
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            businessFunction: 'https://schema.org/Sell',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              priceCurrency: 'USD',
              description: `${store.t('common.moq')}: ${store.text(product, 'moq')}; ${store.t('common.leadTime')}: ${store.text(product, 'leadTime')}`,
            },
            url: seo.url,
          },
        }
      : route.name === 'Products'
        ? {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: store.t('catalog.title'),
            url: seo.url,
            itemListElement: store.products.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${siteUrl}/product/${item.id}`,
              name: item.name,
            })),
          }
      : {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'BestLinksz',
          url: siteUrl,
          email: inquiryEmail,
          description: store.t('seo.homeDescription'),
        },
  );
});
</script>

<template>
  <div id="app-container">
    <header class="site-header">
      <div class="container header-inner">
        <router-link class="brand" to="/" @click="closeMenu">
          <span class="brand-mark">B</span>
          <span>
            <strong>BestLinksz</strong>
            <small>{{ store.t('brand.subtitle') }}</small>
          </span>
        </router-link>

        <button
          class="hamburger-btn"
          type="button"
          :class="{ 'is-active': isMenuOpen }"
          :aria-expanded="isMenuOpen"
          :aria-label="store.t('nav.open')"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="nav-shell" :class="{ 'is-open': isMenuOpen }">
          <nav class="site-nav" aria-label="Main navigation">
            <router-link to="/" @click="closeMenu">{{ store.t('nav.home') }}</router-link>
            <div class="nav-group">
              <router-link class="nav-group-trigger" to="/products" @click="closeMenu">{{ store.t('nav.products') }}</router-link>
              <div class="nav-menu">
                <section v-for="group in store.categoryGroups" :key="group.id" class="nav-menu-group">
                  <p>{{ store.text(group, 'name') }}</p>
                  <router-link
                    v-for="category in group.children"
                    :key="category.id"
                    :to="`/category/${category.id}`"
                    @click="closeMenu"
                  >
                    <span>{{ store.text(category, 'name') }}</span>
                    <small>{{ store.text(category, 'description') }}</small>
                  </router-link>
                </section>
              </div>
            </div>
            <router-link to="/about" @click="closeMenu">{{ store.t('nav.company') }}</router-link>
            <router-link to="/blog" @click="closeMenu">{{ store.t('nav.resources') }}</router-link>
          </nav>

          <div class="header-actions">
            <div ref="controlsRef" class="utility-menu">
              <button
                class="utility-toggle"
                type="button"
                :class="{ active: isUtilityOpen }"
                :aria-expanded="isUtilityOpen"
                :aria-label="store.t('settings.label')"
                @click.stop="isUtilityOpen = !isUtilityOpen"
              >
                <span>Aa</span>
                <small>{{ activeLanguageLabel }} / {{ activeThemeLabel }}</small>
              </button>

              <div v-if="isUtilityOpen" class="utility-panel" @click.stop>
                <div class="utility-section">
                  <span>{{ store.t('settings.theme') }}</span>
                  <div class="option-grid theme-switch" aria-label="Theme switch">
                    <button
                      v-for="option in themeOptions"
                      :key="option.value"
                      type="button"
                      :class="{ active: store.theme === option.value }"
                      @click="setTheme(option.value)"
                    >
                      {{ store.t(option.labelKey) }}
                    </button>
                  </div>
                </div>

                <div class="utility-section">
                  <span>{{ store.t('settings.language') }}</span>
                  <div class="option-grid language-switch" aria-label="Language switch">
                    <button
                      v-for="option in languageOptions"
                      :key="option.value"
                      type="button"
                      :class="{ active: store.language === option.value }"
                      @click="setLanguage(option.value)"
                    >
                      {{ store.t(option.labelKey) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <a class="inquiry-link" :href="`mailto:${inquiryEmail}`" @click="closeMenu">{{ store.t('nav.emailInquiry') }}</a>
          </div>
        </div>
      </div>
    </header>

    <div v-if="isMenuOpen" class="mobile-overlay" @click="closeMenu"></div>

    <main id="main-content">
      <router-view :key="$route.path" />
    </main>

    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <router-link class="footer-brand" to="/">BestLinksz.com</router-link>
          <p>{{ store.t('footer.description') }}</p>
        </div>
        <div>
          <h2>{{ store.t('footer.productLines') }}</h2>
          <router-link v-for="category in store.categories" :key="category.id" :to="`/category/${category.id}`">
            {{ store.text(category, 'name') }}
          </router-link>
        </div>
        <div>
          <h2>{{ store.t('footer.contact') }}</h2>
          <a :href="`mailto:${inquiryEmail}`">{{ inquiryEmail }}</a>
          <small>{{ store.t('footer.contactNote') }}</small>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>{{ store.t('footer.rights') }}</span>
        <span>{{ store.t('footer.legal') }}</span>
      </div>
    </footer>
  </div>
</template>

<style>
@import './assets/base.css';

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<style scoped>
#app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}

#main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 86%, transparent);
  backdrop-filter: blur(18px);
}

.header-inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--color-heading);
  text-decoration: none;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  background: var(--color-heading);
  color: var(--color-accent);
  font-weight: 900;
}

.brand strong,
.footer-brand {
  display: block;
  color: var(--color-heading);
  font-size: 1.08rem;
  font-weight: 900;
  line-height: 1.1;
}

.brand small {
  display: block;
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.nav-shell {
  display: flex;
  align-items: center;
  gap: 22px;
}

.site-nav,
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.site-nav a,
.nav-group-trigger {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  padding: 0 11px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.site-nav a:hover,
.site-nav a.router-link-exact-active,
.nav-group:hover .nav-group-trigger {
  color: var(--color-link);
  background: var(--color-accent-soft);
}

.nav-group {
  position: relative;
}

.nav-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  width: min(720px, 86vw);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 22px 54px var(--color-shadow-hover);
  padding: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease,
    visibility 0.16s ease;
}

.nav-group:hover .nav-menu,
.nav-group:focus-within .nav-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav-menu-group {
  display: grid;
  align-content: start;
  gap: 4px;
}

.nav-menu-group p {
  padding: 8px 10px 4px;
  color: var(--color-heading);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
}

.nav-menu a {
  height: auto;
  align-items: start;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
}

.nav-menu small {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.35;
}

.utility-menu {
  position: relative;
}

.utility-toggle {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-heading);
  padding: 0 12px 0 10px;
  box-shadow: 0 10px 24px var(--color-shadow);
  cursor: pointer;
}

.utility-toggle span {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--color-heading);
  color: var(--color-background);
  font-size: 0.78rem;
  font-weight: 900;
}

.utility-toggle small {
  color: var(--color-text-muted);
  font-size: 0.76rem;
  font-weight: 800;
}

.utility-toggle.active,
.utility-toggle:hover {
  border-color: var(--color-border-strong);
}

.utility-panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: min(320px, calc(100vw - 32px));
  display: grid;
  gap: 14px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-surface) 94%, transparent);
  box-shadow: 0 24px 70px var(--color-shadow-hover);
  backdrop-filter: blur(18px);
  padding: 14px;
}

.utility-section {
  display: grid;
  gap: 8px;
}

.utility-section > span {
  color: var(--color-text-muted);
  font-size: 0.74rem;
  font-weight: 900;
  text-transform: uppercase;
}

.option-grid {
  display: inline-grid;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-background-soft);
  padding: 3px;
}

.theme-switch {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.language-switch {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.option-grid button {
  min-width: 58px;
  min-height: 32px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
}

.option-grid button.active {
  background: var(--color-surface);
  color: var(--color-heading);
  box-shadow: 0 8px 18px var(--color-shadow);
}

.inquiry-link {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--color-heading);
  color: var(--color-background);
  padding: 0 14px;
  font-weight: 900;
  text-decoration: none;
}

html.dark .inquiry-link {
  background: var(--color-accent);
  color: var(--color-accent-ink);
}

.hamburger-btn {
  display: none;
}

.mobile-overlay {
  display: none;
}

.site-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text-muted);
  padding: 52px 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) repeat(2, minmax(180px, 0.45fr));
  gap: 36px;
}

.site-footer h2 {
  margin-bottom: 12px;
  color: var(--color-heading);
  font-size: 0.82rem;
  font-weight: 900;
  text-transform: uppercase;
}

.site-footer p {
  max-width: 420px;
  margin-top: 12px;
}

.site-footer a {
  display: block;
  color: var(--color-text);
  text-decoration: none;
  margin-top: 8px;
}

.site-footer small {
  display: block;
  max-width: 300px;
  margin-top: 10px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  border-top: 1px solid var(--color-border);
  margin-top: 40px;
  padding-top: 18px;
  font-size: 0.82rem;
}

@media (max-width: 940px) {
  .hamburger-btn {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background: var(--color-surface);
    padding: 9px;
    cursor: pointer;
  }

  .hamburger-btn span {
    width: 20px;
    height: 2px;
    display: block;
    border-radius: 99px;
    background: var(--color-heading);
    transition:
      transform 0.18s ease,
      opacity 0.18s ease;
  }

  .hamburger-btn span + span {
    margin-top: 5px;
  }

  .hamburger-btn.is-active span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .hamburger-btn.is-active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger-btn.is-active span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  .nav-shell {
    position: fixed;
    top: 72px;
    right: 12px;
    left: 12px;
    z-index: 1100;
    width: auto;
    max-height: calc(100vh - 88px);
    display: grid;
    align-items: stretch;
    gap: 16px;
    overflow: auto;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    box-shadow: 0 22px 60px var(--color-shadow-hover);
    padding: 16px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition:
      opacity 0.18s ease,
      transform 0.18s ease,
      visibility 0.18s ease;
  }

  .nav-shell.is-open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .nav-shell.is-open,
  .nav-shell.is-open * {
    visibility: visible;
  }

  .site-nav,
  .header-actions {
    display: grid;
    align-items: stretch;
  }

  .header-actions {
    order: -1;
  }

  .site-nav a,
  .nav-group-trigger {
    justify-content: flex-start;
    width: 100%;
  }

  .nav-menu {
    position: static;
    width: 100%;
    grid-template-columns: 1fr;
    margin-top: 6px;
    box-shadow: none;
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  .utility-toggle,
  .utility-menu,
  .option-grid {
    width: 100%;
  }

  .utility-toggle {
    justify-content: space-between;
  }

  .utility-panel {
    position: static;
    width: 100%;
    margin-top: 10px;
    box-shadow: none;
  }

  .inquiry-link {
    width: 100%;
  }

  .mobile-overlay {
    position: fixed;
    inset: 72px 0 0;
    z-index: 900;
    display: block;
    background: rgba(2, 8, 12, 0.38);
    backdrop-filter: blur(4px);
  }

  .footer-grid,
  .footer-bottom {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}

@media (max-width: 560px) {
  .container {
    width: min(100% - 28px, 1180px);
  }

  .brand small {
    display: none;
  }

  .site-header {
    background: var(--color-background);
  }
}
</style>
