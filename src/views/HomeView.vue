<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { store } from '../store';

const currentIndex = ref(0);
const intervalId = ref(null);
const isReady = ref(false);

const carouselImages = ref([
    '/电子烟/雾化器主页1.jpg',
    '/电子烟/雾化器主页2.jpg',
    '/电子烟/packaging.jpg'
]);

const products = computed(() => store.products);

const stopCarousel = () => {
    clearInterval(intervalId.value);
    intervalId.value = null;
};

const startCarousel = () => {
    stopCarousel();
    intervalId.value = setInterval(() => {
        nextItem(false);
    }, 5000);
};

const showItem = (index) => {
    currentIndex.value = index;
    startCarousel();
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
    // Use timeout to ensure animations trigger on navigation
    setTimeout(() => {
        isReady.value = true;
    }, 10);
});

onBeforeUnmount(() => {
    stopCarousel();
});
</script>

<template>
<div class="home-view" :class="{ ready: isReady }">
    <div class="container">
        <section class="carousel" @mouseover="stopCarousel" @mouseout="startCarousel">
            <div class="carousel-inner">
                <Transition name="fade" mode="out-in">
                    <div :key="currentIndex" class="carousel-item">
                        <img :src="carouselImages[currentIndex]" alt="Carousel Image">
                    </div>
                </Transition>
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
            <h2 class="animate-fade-in-up">Our Products</h2>
            <div class="product-grid">
                <div v-for="(product, index) in products" :key="index" class="product-card" :style="{ animationDelay: (index * 0.1) + 's' }">
                    <router-link :to="`/product/${product.id}`">
                        <img :src="product.image" :alt="product.name">
                        <h3>{{ product.name }}</h3>
                    </router-link>
                </div>
            </div>
        </section>
    </main>

    <section class="contact-section">
        <div class="container">
            <h2 class="animate-fade-in-up" style="animation-delay: 0.2s">Contact Us</h2>
            <a href="mailto:1378554398@qq.com" class="contact-link animate-fade-in-up" style="animation-delay: 0.3s">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>1378554398@qq.com</span>
            </a>
        </div>
    </section>
</div>
</template>

<style scoped>
/* Styles are copied from App.vue, but scoped to this component */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
a {
    text-decoration: none;
    color: var(--color-text);
}
.carousel {
    position: relative;
    width: 100%;
    padding-bottom: 40px;
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}
.ready .carousel {
    opacity: 1;
    transform: translateX(0);
}
.carousel-inner {
    display: flex;
    overflow: hidden;
    border-radius: 8px;
    position: relative;
    min-height: 450px;
}
.carousel-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.7s ease-in-out;
    border-radius: 8px;
    overflow: hidden;
}
.carousel-item img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
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
    transition: transform 0.1s ease, background-color 0.1s ease;
}
.carousel-control:active {
    transform: translateY(-50%) scale(0.9);
    background-color: rgba(0,0,0,0.7);
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
    background-color: var(--color-border);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
.indicator.active {
    background-color: var(--color-heading);
}
.products {
    padding: 40px 0;
}
.products h2 {
    text-align: center;
    margin-bottom: 40px;
    color: var(--color-heading);
}
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.product-card {
    background-color: var(--color-background-soft);
    border-radius: 8px;
    box-shadow: 0 4px 8px var(--color-shadow);
    overflow: hidden;
    opacity: 0; /* Start as transparent for the animation */
    max-width: 290px;
    margin: 0 auto;

    /* The hover effects will now use this transition, which has NO DELAY */
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.ready .product-card {
    /* The entrance animation is now handled by 'animation', with a delay */
    animation: fadeInUp 0.5s ease-out forwards;
}

.product-card:hover {
    /* The hover effect is now instantaneous thanks to the separated transition */
    transform: translateY(-5px);
    box-shadow: 0 8px 24px var(--color-shadow-hover);
}

.product-card img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: contain;
}
.product-card h3 {
    padding: 20px;
    margin: 0;
    text-align: center;
    color: var(--color-text);
}
.contact-section {
    background-color: var(--color-background-soft);
    padding: 40px 0;
    text-align: center;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out 0.6s, transform 0.5s ease-out 0.6s;
}
.ready .contact-section {
    opacity: 1;
    transform: translateY(0);
}
.contact-section h2 {
    margin-bottom: 20px;
    color: var(--color-heading);
}
.contact-link {
    display: inline-flex;
    align-items: center;
    font-size: 18px;
    color: var(--color-heading);
    transition: color 0.3s ease;
}
.contact-link:hover {
    opacity: 0.8;
}
.contact-link svg {
    margin-right: 10px;
    stroke: currentColor;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.6s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.home-view.ready .product-card:hover {
    /* This rule is now merged into the main .product-card:hover rule above */
}
</style>

