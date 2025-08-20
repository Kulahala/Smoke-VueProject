import { reactive } from 'vue';

export const store = reactive({
  // Initialize theme from localStorage or default to 'system'
  theme: localStorage.getItem('theme') || 'system',

  setTheme(newTheme) {
    this.theme = newTheme;
    localStorage.setItem('theme', newTheme);
  },

  products: [
    { id: 1, name: '商品 1', image: '/电子烟/微信图片_20250805234550_1211.jpg', category: '1', description: '这里是商品 1 的详细描述。' },
    { id: 2, name: '商品 2', image: '/电子烟/微信图片_20250805234550_1212.jpg', category: '1', description: '这里是商品 2 的详细描述。' },
    { id: 3, name: '商品 3', image: '/电子烟/微信图片_20250805234550_1213.jpg', category: '2', description: '这里是商品 3 的详细描述。' },
    { id: 4, name: '商品 4', image: '/电子烟/微信图片_20250805234550_1214.jpg', category: '2', description: '这里是商品 4 的详细描述。' },
    { id: 5, name: '商品 5', image: '/电子烟/微信图片_20250805234550_1215.jpg', category: '3', description: '这里是商品 5 的详细描述。' },
    { id: 6, name: '商品 6', image: '/电子烟/微信图片_20250805234550_1216.jpg', category: '3', description: '这里是商品 6 的详细描述。' },
  ],

  categories: [
    { id: '1', name: '分类 1' },
    { id: '2', name: '分类 2' },
    { id: '3', name: '分类 3' },
  ],

  getProduct(id) {
    return this.products.find(p => p.id === parseInt(id));
  },

  getProductsByCategory(categoryId) {
    return this.products.filter(p => p.category === categoryId);
  }
});
