<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store';

const route = useRoute();

// Ensure all data derived from the route or store is computed
const productId = computed(() => parseInt(route.params.id));
const product = computed(() => store.getProduct(productId.value));
</script>

<template>
    <div class="page-content">
        <div class="container">
            <div v-if="product" class="product-detail">
                <div class="product-image">
                    <img :src="product.image" :alt="product.name">
                </div>
                <div class="product-info card">
                    <h1>{{ product.name }}</h1>
                    <p>{{ product.description }}</p>
                    <p><strong>分类:</strong> {{ store.categories.find(c => c.id === product.category)?.name }}</p>
                    <router-link to="/about" class="add-to-cart-btn">联系我们</router-link>
                </div>
            </div>
            <div v-else>
                <h2 class="card" style="text-align: center; padding: 2rem;">商品未找到</h2>
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
