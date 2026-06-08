import { computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { inquiryEmail, store } from '../store';

const siteUrl = 'https://www.bestlinksz.com';

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

export function useSeo() {
  const route = useRoute();

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
      return { title, description, url: routeUrl, image: category?.heroImage || '/电子烟/雾化器主页1.webp' };
    }

    if (route.name === 'Product') {
      const product = store.getProduct(route.params.id);
      const title = product
        ? `${store.text(product, 'name')} | ${store.language === 'zh' ? '批发询盘' : 'Wholesale Inquiry'}`
        : store.t('product.notFound');
      const description = product ? store.text(product, 'description') : store.t('product.notFoundText');
      return { title, description, url: routeUrl, image: product?.image || '/电子烟/雾化器主页1.webp' };
    }

    if (route.name === 'Products') {
      return {
        title: `${store.t('catalog.title')} | BestLinksz`,
        description: store.t('catalog.intro'),
        url: routeUrl,
        image: '/电子烟/Product3_1.webp',
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
        image: '/电子烟/Product9_1.webp',
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
        image: '/电子烟/Product6_2.webp',
      };
    }

    return {
      title: store.t('seo.homeTitle'),
      description: store.t('seo.homeDescription'),
      url: routeUrl,
      image: '/电子烟/Product1_1.webp',
    };
  });

  watchEffect(() => {
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
}
