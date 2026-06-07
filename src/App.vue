<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { inquiryEmail, store } from './store';
import InquiryWidget from './components/InquiryWidget.vue';

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

const showBackToTop = ref(false);
const isScrollingToTop = ref(false);

const cancelScrollToTop = () => {
  if (!isScrollingToTop.value) return;
  isScrollingToTop.value = false;
  window.scrollTo({
    top: window.scrollY,
    behavior: 'auto',
  });
  removeInterruptionListeners();
};

const handleInterruption = () => {
  cancelScrollToTop();
};

const handleKeyDownInterruption = (e) => {
  const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'];
  if (scrollKeys.includes(e.code) || scrollKeys.includes(e.key)) {
    cancelScrollToTop();
  }
};

const addInterruptionListeners = () => {
  window.addEventListener('wheel', handleInterruption, { passive: true });
  window.addEventListener('touchmove', handleInterruption, { passive: true });
  window.addEventListener('keydown', handleKeyDownInterruption, { passive: true });
  window.addEventListener('mousedown', handleInterruption, { passive: true });
};

const removeInterruptionListeners = () => {
  window.removeEventListener('wheel', handleInterruption);
  window.removeEventListener('touchmove', handleInterruption);
  window.removeEventListener('keydown', handleKeyDownInterruption);
  window.removeEventListener('mousedown', handleInterruption);
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
  if (isScrollingToTop.value && window.scrollY === 0) {
    isScrollingToTop.value = false;
    removeInterruptionListeners();
  }
};

const scrollToTop = () => {
  if (window.scrollY === 0) return;
  isScrollingToTop.value = true;
  addInterruptionListeners();
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const handleBrandClick = (event) => {
  closeMenu();
  if (route.path === '/') {
    event.preventDefault();
    window.location.reload();
  }
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

const schemes = [
  { value: 'white-mint', label: 'Light Mint', labelZh: '白绿', theme: 'light', scheme: 'default', themeColor: '#ffffff', accentColor: '#00e5c9' },
  { value: 'white-blue', label: 'Light Blue', labelZh: '白蓝', theme: 'light', scheme: 'blue', themeColor: '#ffffff', accentColor: '#0066ff' },
  { value: 'white-gold', label: 'Light Gold', labelZh: '白金', theme: 'light', scheme: 'gold', themeColor: '#ffffff', accentColor: '#c29543' },
  { value: 'dark-mint', label: 'Dark Mint', labelZh: '黑绿', theme: 'dark', scheme: 'default', themeColor: '#04090b', accentColor: '#00f5d4' },
  { value: 'cyber-blue', label: 'Cyber Blue', labelZh: '黑蓝', theme: 'dark', scheme: 'blue', themeColor: '#020617', accentColor: '#00d2ff' },
  { value: 'luxury-gold', label: 'Luxury Gold', labelZh: '黑金', theme: 'dark', scheme: 'gold', themeColor: '#09090b', accentColor: '#dfb260' }
];

const setColorScheme = (schemeItem) => {
  store.setTheme(schemeItem.theme);
  store.setColorScheme(schemeItem.scheme);
};

const activeSchemeLabel = computed(() => {
  const active = schemes.find((item) => store.theme === item.theme && store.colorScheme === item.scheme) || schemes[3];
  return store.language === 'zh' ? active.labelZh : active.label;
});

const activeLanguageLabel = computed(() => (store.language === 'zh' ? store.t('lang.zh') : store.t('lang.en')));

const handleMailtoClick = (event) => {
  const anchor = event.target.closest('a');
  if (anchor && anchor.getAttribute('href')?.startsWith('mailto:')) {
    navigator.clipboard.writeText(inquiryEmail).then(() => {
      store.showToast(
        store.language === 'zh'
          ? `已复制询盘邮箱: ${inquiryEmail}，若写信软件未打开，请手动粘贴发送。`
          : `Copied email: ${inquiryEmail}. Please paste manually if mail client did not open.`
      );
    }).catch(() => {
      store.showToast(
        store.language === 'zh'
          ? `询盘邮箱: ${inquiryEmail}，请手动复制发送。`
          : `Inquiry email: ${inquiryEmail}. Please copy and send manually.`
      );
    });
  }
};

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  updateSystemTheme();
  mediaQuery.addEventListener?.('change', updateSystemTheme);
  document.addEventListener('click', handleDocumentClick);
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('click', handleMailtoClick);
});

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener?.('change', updateSystemTheme);
  document.removeEventListener('click', handleDocumentClick);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('click', handleMailtoClick);
  removeInterruptionListeners();
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
      image: '/电子烟/disposable_vape_max.png',
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
      image: '/电子烟/packaging.jpg',
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
      image: '/电子烟/微信图片_20250805234550_1210.jpg',
    };
  }

  return {
    title: store.t('seo.homeTitle'),
    description: store.t('seo.homeDescription'),
    url: routeUrl,
    image: '/电子烟/微信图片_20250805234550_1239.jpg',
  };
});

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value);
  document.documentElement.lang = store.language === 'zh' ? 'zh-CN' : 'en';

  // 动态切换配色类
  document.documentElement.classList.remove('scheme-default', 'scheme-blue', 'scheme-gold');
  document.documentElement.classList.add(`scheme-${store.colorScheme}`);

  // 动态切换最顶部标签页 Favicon 图标以适配系统/浏览器本身的明暗主题（不受网站内部配色切换影响）
  const favEl = document.head.querySelector('link[rel="icon"]');
  if (favEl) {
    favEl.setAttribute('href', systemPrefersDark.value ? '/电子烟/smoke-light.png' : '/电子烟/smoke.png');
  }

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
    <!-- 全局 Toast 提示 -->
    <Transition name="toast-fade">
      <div v-if="store.toastMessage" class="global-toast" role="alert">
        <div class="toast-content">
          <svg class="toast-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>{{ store.toastMessage }}</span>
        </div>
        <button class="toast-close" type="button" @click="store.toastMessage = ''" aria-label="Close">✕</button>
      </div>
    </Transition>

    <header class="site-header">
      <div class="container header-inner">
        <router-link class="brand" to="/" @click="handleBrandClick">
          <div class="brand-mark-wrapper">
            <img class="brand-logo" :src="isDark ? '/电子烟/smoke-light.png' : '/电子烟/smoke.png'" alt="BestLinksz Logo" />
          </div>
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
                <small>{{ activeLanguageLabel }} / {{ activeSchemeLabel }}</small>
              </button>

              <div v-if="isUtilityOpen" class="utility-panel" @click.stop>
                <div class="utility-section">
                  <span>{{ store.language === 'zh' ? '选择配色' : 'Color Scheme' }}</span>
                  <div class="palette-switch" aria-label="Color Palette">
                    <button
                      v-for="scheme in schemes"
                      :key="scheme.value"
                      type="button"
                      :class="['palette-dot', { active: store.theme === scheme.theme && store.colorScheme === scheme.scheme }]"
                      :style="{ '--theme-color': scheme.themeColor, '--accent-color': scheme.accentColor }"
                      :title="store.language === 'zh' ? scheme.labelZh : scheme.label"
                      @click="setColorScheme(scheme)"
                    >
                      <span class="dot-inner"></span>
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

    <!-- 返回顶部按钮 -->
    <button
      type="button"
      :class="['back-to-top', { visible: showBackToTop }]"
      :aria-label="store.language === 'zh' ? '返回顶部' : 'Back to top'"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>

    <!-- 在线询盘留言悬浮窗口 -->
    <InquiryWidget />
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
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  background: color-mix(in srgb, var(--color-surface) 68%, transparent);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
  backdrop-filter: blur(18px) saturate(1.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
}

.header-inner {
  min-height: 68px;
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

.brand-mark-wrapper {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--color-accent) 26%, var(--color-border));
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-accent) 6%, var(--color-surface-elevated));
  box-shadow: 0 4px 14px var(--color-shadow);
  padding: 5px;
  overflow: hidden;
}

.brand-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px color-mix(in srgb, var(--color-accent) 35%, transparent));
}

.brand strong,
.footer-brand {
  display: block;
  color: var(--color-heading);
  font-size: 1.08rem;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: 0;
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
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  padding: 0 12px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.site-nav a:hover,
.site-nav a.router-link-exact-active,
.nav-group:hover .nav-group-trigger {
  color: var(--color-link);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 58%, transparent), transparent),
    var(--color-accent-soft);
}

.nav-group {
  position: relative;
}

.nav-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 260px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface-elevated) 82%, transparent), transparent),
    var(--color-surface);
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

.nav-group:hover .nav-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav-menu-group {
  display: grid;
  align-content: start;
  gap: 2px;
}

.nav-menu-group + .nav-menu-group {
  border-top: 1px solid var(--color-border);
  padding-top: 6px;
  margin-top: 2px;
}

.nav-menu-group p {
  padding: 4px 8px 2px;
  color: var(--color-heading);
  font-size: 0.74rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-menu a {
  height: auto;
  align-items: start;
  flex-direction: column;
  gap: 2px;
  padding: 6px 8px;
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
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface-elevated) 72%, transparent), transparent),
    var(--color-surface);
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
  border-radius: 6px;
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
  left: auto;
  width: min(320px, calc(100vw - 32px));
  display: grid;
  gap: 14px;
  border: 1px solid var(--color-border-strong);
  border-radius: 12px;
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  box-shadow: 0 24px 70px var(--color-shadow-hover);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  padding: 14px;
  z-index: 100;
}

@media (min-width: 1200px) {
  .utility-panel {
    right: auto;
    left: 0;
  }
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
  border-radius: 8px;
  background: var(--color-background-soft);
  padding: 3px;
}

.palette-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 4px 6px;
}

.palette-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background-color: var(--accent-color);
  padding: 0;
  cursor: pointer;
  position: relative;
  display: grid;
  place-items: center;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.palette-dot:hover {
  transform: scale(1.12);
}

.palette-dot.active {
  outline: 2px solid var(--accent-color);
  outline-offset: 3px;
}

.dot-inner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--theme-color);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
  display: block;
}

.language-switch {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.option-grid button {
  min-width: 58px;
  min-height: 32px;
  border: 0;
  border-radius: 6px;
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
  border-radius: 8px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 48%),
    var(--color-heading);
  color: var(--color-background);
  padding: 0 14px;
  font-weight: 900;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.inquiry-link:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-accent) 22%, transparent);
}

html.dark .inquiry-link {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 10%, transparent);
}

html.dark .inquiry-link:hover {
  background: color-mix(in srgb, var(--color-accent) 88%, #fff);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.hamburger-btn {
  display: none;
}

.mobile-overlay {
  display: none;
}

.site-footer {
  border-top: 1px solid var(--color-border);
  background:
    linear-gradient(180deg, var(--color-background-soft), color-mix(in srgb, var(--color-background-mute) 54%, var(--color-background-soft))),
    var(--color-background-soft);
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

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface-elevated) 82%, transparent);
  backdrop-filter: blur(12px);
  color: var(--color-heading);
  display: grid;
  place-items: center;
  cursor: pointer;
  z-index: 850;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  box-shadow: 0 8px 24px var(--color-shadow);
  transition:
    opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.25s,
    background 0.25s,
    color 0.25s,
    box-shadow 0.25s;
}

.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.back-to-top:hover {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  transform: translateY(-3px);
  box-shadow: 
    0 12px 30px var(--color-shadow-hover),
    0 0 16px color-mix(in srgb, var(--color-accent) 40%, transparent);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 42px;
    height: 42px;
  }
}

/* 全局 Toast 提示样式 */
.global-toast {
  position: fixed;
  bottom: 84px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 320px;
  max-width: min(520px, calc(100vw - 32px));
  border: 1px solid var(--color-border-strong);
  border-radius: 10px;
  background: color-mix(in srgb, var(--color-surface-elevated) 85%, transparent);
  backdrop-filter: blur(16px);
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.12),
    0 0 24px color-mix(in srgb, var(--color-accent) 15%, transparent);
  padding: 12px 18px;
  color: var(--color-heading);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.4;
}

.toast-icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.toast-close {
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
}

.toast-close:hover {
  color: var(--color-heading);
}

/* Toast 渐变动画 */
.toast-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-fade-leave-active {
  transition: all 0.25s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, 14px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}
</style>
