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
/* Styles are copied from App.vue for consistency */
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
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s, transform 0.5s, box-shadow 0.3s ease;
}
.ready .product-card {
    opacity: 1;
    transform: translateY(0);
}
.product-card a {
    text-decoration: none;
    color: #333;
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

.category-view.ready .product-card:hover {
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}
</style>