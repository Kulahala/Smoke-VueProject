import { reactive } from 'vue';

export const store = reactive({
  // Initialize theme from localStorage or default to 'system'
  theme: localStorage.getItem('theme') || 'system',

  setTheme(newTheme) {
    this.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  },

  products: [
    { id: 1, name: 'Product 1', image: '/电子烟/微信图片_20250805234550_1211.jpg', category: '1', description: 'This is a detailed description for Product 1.' },
    { id: 2, name: 'Product 2', image: '/电子烟/微信图片_20250805234550_1212.jpg', category: '1', description: 'This is a detailed description for Product 2.' },
    { id: 3, name: 'Product 3', image: '/电子烟/微信图片_20250805234550_1213.jpg', category: '2', description: 'This is a detailed description for Product 3.' },
    { id: 4, name: 'Product 4', image: '/电子烟/微信图片_20250805234550_1214.jpg', category: '2', description: 'This is a detailed description for Product 4.' },
    { id: 5, name: 'Product 5', image: '/电子烟/微信图片_20250805234550_1215.jpg', category: '3', description: 'This is a detailed description for Product 5.' },
    { id: 6, name: 'Product 6', image: '/电子烟/微信图片_20250805234550_1216.jpg', category: '3', description: 'This is a detailed description for Product 6.' },
  ],

  categories: [
    { id: '1', name: 'Category 1' },
    { id: '2', name: 'Category 2' },
    { id: '3', name: 'Category 3' },
  ],

  getProduct(id) {
    return this.products.find(p => p.id === parseInt(id));
  },

  getProductsByCategory(categoryId) {
    return this.products.filter(p => p.category === categoryId);
  }
});
