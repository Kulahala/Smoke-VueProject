<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store';

const route = useRoute();
const isReady = ref(false);

// Ensure all data derived from the route or store is computed
const categoryId = computed(() => route.params.id);
const category = computed(() => store.categories.find(c => c.id === categoryId.value));
const products = computed(() => store.getProductsByCategory(categoryId.value));

onMounted(() => {
    // Use timeout to ensure animations trigger on navigation
    setTimeout(() => {
        isReady.value = true;
    }, 10);
});
</script>

<template>
    <div class="category-view" :class="{ ready: isReady }">
        <div class="container">
            <section class="products">
                <h2 v-if="category">{{ category.name }}</h2>
                <div v-if="products.length" class="product-grid">
                    <div v-for="(product, index) in products" :key="index" class="product-card" :style="{ transitionDelay: (index * 0.1) + 's' }">
                        <router-link :to="`/product/${product.id}`">
                            <img :src="product.image" :alt="product.name">
                            <h3>{{ product.name }}</h3>
                        </router-link>
                    </div>
                </div>
                <div v-else>
                    <p>该分类下暂无商品。</p>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    max-width: 400px; /* Constrain the card width */
    margin: 0 auto; /* Center the card in the grid cell */
}

.ready .product-card {
    animation: fadeInUp 0.5s ease-out forwards;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px var(--color-shadow-hover);
}

.product-card a {
    text-decoration: none;
    color: var(--color-text);
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
</style>
