import { reactive } from 'vue';
import settings from '../data/settings.json';
import categoriesData from '../data/categories.json';
import translations from '../data/translations.json';

// Dynamically import all products inside src/data/products/ folder using Vite glob import
const productModules = import.meta.glob('../data/products/*.json', { eager: true });
const products = Object.values(productModules).map((mod) => mod.default || mod);

export const inquiryEmail = settings.inquiryEmail;
export const heroSlides = settings.heroSlides;

export const store = reactive({
  language: localStorage.getItem('language') || 'en',
  theme: localStorage.getItem('theme') || 'system',
  colorScheme: localStorage.getItem('colorScheme') || 'default',
  web3formsKey: settings.web3formsKey || '',
  toastMessage: '',
  toastTimer: null,

  showToast(msg) {
    this.toastMessage = msg;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = '';
      this.toastTimer = null;
    }, 4500);
  },

  async submitInquiry(formData) {
    if (!this.web3formsKey) {
      console.warn("Web3Forms Access Key is not configured.");
      return { success: false, error: 'Key not configured' };
    }
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: this.web3formsKey,
          ...formData
        })
      });
      const result = await response.json();
      return { success: result.success, error: result.message };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  setLanguage(newLanguage) {
    this.language = newLanguage === 'zh' ? 'zh' : 'en';
    localStorage.setItem('language', this.language);
  },

  setTheme(newTheme) {
    this.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  },

  setColorScheme(newScheme) {
    this.colorScheme = newScheme;
    localStorage.setItem('colorScheme', newScheme);
  },

  categoryGroups: categoriesData.categoryGroups,

  get categories() {
    return this.categoryGroups.flatMap((group) => group.children);
  },

  get representativeProducts() {
    return this.categoryGroups
      .map((group) => {
        const categoryIds = group.children.map((category) => category.id);
        const product = this.products.find((item) => categoryIds.includes(item.category));
        return product ? { group, product } : null;
      })
      .filter(Boolean);
  },

  products: products,

  servicePoints: settings.servicePoints,
  servicePointsZh: settings.servicePointsZh,

  translations: translations,

  t(key) {
    return this.translations[this.language]?.[key] || this.translations.en[key] || key;
  },

  text(item, key) {
    if (!item) return '';
    const zhKey = `${key}Zh`;
    return this.language === 'zh' && item[zhKey] ? item[zhKey] : item[key];
  },

  list(item, key) {
    if (!item) return [];
    const zhKey = `${key}Zh`;
    return this.language === 'zh' && item[zhKey] ? item[zhKey] : item[key] || [];
  },

  get localizedServicePoints() {
    return this.language === 'zh' ? this.servicePointsZh : this.servicePoints;
  },

  getProduct(id) {
    return this.products.find((product) => product.id === parseInt(id));
  },

  getProductsByCategory(categoryId) {
    return this.products.filter((product) => product.category === categoryId);
  },

  getCategory(categoryId) {
    return this.categories.find((category) => category.id === categoryId);
  },

  getCategoryGroup(categoryId) {
    return this.categoryGroups.find((group) => group.children.some((child) => child.id === categoryId));
  },
});
