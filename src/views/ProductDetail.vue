<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store';

const route = useRoute();
const isReady = ref(false);

// Ensure all data derived from the route or store is computed
const productId = computed(() => parseInt(route.params.id));
const product = computed(() => store.getProduct(productId.value));

onMounted(() => {
  setTimeout(() => {
    isReady.value = true;
  }, 10);
});
</script>

<template>
    <div class="page-content" :class="{ ready: isReady }">
        <div class="container">
            <div v-if="product" class="product-detail">
                <div class="product-image animate-fade-in-up">
                    <img :src="product.image" :alt="product.name">
                </div>
                <div class="product-info card">
                    <h1 class="animate-fade-in-up" style="animation-delay: 0.1s">{{ product.name }}</h1>
                    <p class="animate-fade-in-up" style="animation-delay: 0.2s">{{ product.description }}</p>
                    <p class="animate-fade-in-up" style="animation-delay: 0.3s"><strong>Category:</strong> {{ store.categories.find(c => c.id === product.category)?.name }}</p>
                    <router-link to="/about" class="add-to-cart-btn animate-fade-in-up" style="animation-delay: 0.4s">Contact Us</router-link>
                </div>
            </div>
            <div v-else>
                <h2 class="card animate-fade-in-up" style="text-align: center; padding: 2rem;">Product Not Found</h2>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-detail {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: 40px;
    align-items: start;
}
.product-image img {
    width: 100%;
    border-radius: 8px;
}
.product-info h1 {
    margin-top: 0;
    font-size: 2.5em;
    color: var(--color-heading);
}
.product-info p {
    font-size: 1.1em;
    line-height: 1.6;
    color: var(--color-text);
}
.add-to-cart-btn {
    display: inline-block;
    text-decoration: none;
    background-color: var(--color-heading);
    color: var(--color-background);
    border: none;
    padding: 15px 30px;
    font-size: 1.2em;
    border-radius: 5px;
    cursor: pointer;
    transition: opacity 0.3s ease;
    margin-top: 20px;
}
.add-to-cart-btn:hover {
    opacity: 0.9;
}
</style>
