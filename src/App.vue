<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const currentIndex = ref(0);
const intervalId = ref(null);

const carouselImages = ref([
    '/电子烟/微信图片_20250805234550_1208.jpg',
    '/电子烟/微信图片_20250805234550_1209.jpg',
    '/电子烟/微信图片_20250805234550_1210.jpg'
]);

const products = ref([
    { name: '商品 1', image: '/电子烟/微信图片_20250805234550_1211.jpg' },
    { name: '商品 2', image: '/电子烟/微信图片_20250805234550_1212.jpg' },
    { name: '商品 3', image: '/电子烟/微信图片_20250805234550_1213.jpg' },
    { name: '商品 4', image: '/电子烟/微信图片_20250805234550_1214.jpg' },
    { name: '商品 5', image: '/电子烟/微信图片_20250805234550_1215.jpg' },
    { name: '商品 6', image: '/电子烟/微信图片_20250805234550_1216.jpg' },
]);

const stopCarousel = () => {
    clearInterval(intervalId.value);
    intervalId.value = null;
};

const startCarousel = () => {
    stopCarousel(); // Ensure no multiple intervals running
    intervalId.value = setInterval(() => {
        nextItem(false); // Auto-advancing should not reset the timer
    }, 5000);
};

const showItem = (index) => {
    currentIndex.value = index;
    startCarousel(); // Reset timer on manual interaction
};

const nextItem = (manual = true) => {
    if (manual) stopCarousel();
    currentIndex.value = (currentIndex.value + 1) % carouselImages.value.length;
    if (manual) startCarousel();
};

const prevItem = () => {
    stopCarousel();
    currentIndex.value = (currentIndex.value - 1 + carouselImages.value.length) % carouselImages.value.length;
    startCarousel();
};

onMounted(() => {
    startCarousel();
});

onBeforeUnmount(() => {
    stopCarousel();
});
</script>

<template>
    <header>
        <div class="container">
            <div class="logo">
                <a href="#">BestLinksz.com</a>
            </div>
            <nav>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li class="dropdown">
                        <a href="#">Products</a>
                        <ul class="dropdown-menu">
                            <li><a href="#">分类 1</a></li>
                            <li><a href="#">分类 2</a></li>
                            <li><a href="#">分类 3</a></li>
                        </ul>
                    </li>
                    <li><a href="#">About</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <div class="container">
        <section class="carousel" @mouseover="stopCarousel" @mouseout="startCarousel">
            <div class="carousel-inner">
                <div v-for="(image, index) in carouselImages" :key="index" v-show="currentIndex === index" class="carousel-item">
                    <img :src="image" alt="轮播图">
                </div>
            </div>
            <button @click="prevItem" class="carousel-control prev">&#10094;</button>
            <button @click="nextItem()" class="carousel-control next">&#10095;</button>
            <div class="carousel-indicators">
                <span v-for="(_, index) in carouselImages" :key="index" :class="{ active: currentIndex === index }" @click="showItem(index)" class="indicator"></span>
            </div>
        </section>
    </div>

    <main class="container">
        <section class="products">
            <h2>我们的产品</h2>
            <div class="product-grid">
                <div v-for="(product, index) in products" :key="index" class="product-card" :style="{ animationDelay: (index * 0.1) + 's' }">
                    <a href="#">
                        <img :src="product.image" :alt="product.name">
                        <h3>{{ product.name }}</h3>
                    </a>
                </div>
            </div>
        </section>
    </main>

    <section class="contact-section">
        <div class="container">
            <h2>联系我们</h2>
            <a href="mailto:1378554398@qq.com" class="contact-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>1378554398@qq.com</span>
            </a>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2025 BestLinksz.com. All Rights Reserved.</p>
        </div>
    </footer>
</template>

<style scoped>
    /* 基本样式 */
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        margin: 0;
        background-color: #f4f4f4;
        color: #333;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    a {
        text-decoration: none;
        color: #333;
    }

    /* 头部 */
    header {
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 15px 0;
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    header .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo a {
        font-size: 24px;
        font-weight: bold;
    }

    nav ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
    }

    nav ul li {
        margin-left: 20px;
    }

    nav ul li a {
        font-size: 16px;
        padding: 10px;
        transition: color 0.3s ease;
    }

    nav ul li a:hover {
        color: #007bff;
    }

    /* 下拉菜单 */
    .dropdown {
        position: relative;
    }

    .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        list-style: none;
        padding: 10px 0;
        margin: 0;
        min-width: 150px;
    }

    .dropdown:hover .dropdown-menu {
        display: block;
    }

    .dropdown-menu li a {
        display: block;
        padding: 10px 20px;
    }

    /* 轮播图 */
    .carousel {
        position: relative;
        width: 100%;
        padding-bottom: 40px;
    }

    .carousel-inner {
        display: flex;
        overflow: hidden;
        border-radius: 8px;
        position: relative;
        min-height: 300px; 
    }

    .carousel-item {
        min-width: 100%;
        transition: opacity 0.7s ease-in-out;
    }

    .carousel-item img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: contain;
        max-height: 500px;
        margin: 0 auto;
    }

    .carousel-control {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(0,0,0,0.5);
        color: #fff;
        border: none;
        padding: 10px;
        cursor: pointer;
        font-size: 20px;
        z-index: 10;
    }

    .carousel-control.prev {
        left: 10px;
    }

    .carousel-control.next {
        right: 10px;
    }

    .carousel-indicators {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 10px;
        z-index: 10;
    }

    .indicator {
        width: 12px;
        height: 12px;
        background-color: #cccccc;
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .indicator.active {
        background-color: #888888;
    }

    /* 产品 */
    .products {
        padding: 40px 0;
    }

    .products h2 {
        text-align: center;
        margin-bottom: 40px;
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }

    .product-card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.5s forwards;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .product-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .product-card h3 {
        padding: 20px;
        margin: 0;
        text-align: center;
    }

    /* 联系我们 */
    .contact-section {
        background-color: #fff;
        padding: 40px 0;
        text-align: center;
    }

    .contact-section h2 {
        margin-bottom: 20px;
    }

    .contact-link {
        display: inline-flex;
        align-items: center;
        font-size: 18px;
        color: #007bff;
        transition: color 0.3s ease;
    }

    .contact-link:hover {
        color: #0056b3;
    }

    .contact-link svg {
        margin-right: 10px;
    }

    /* 页脚 */
    footer {
        background-color: #333;
        color: #fff;
        text-align: center;
        padding: 20px 0;
        margin-top: 40px;
    }

    footer a {
        color: #fff;
    }

    /* 动画 */
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

</style>