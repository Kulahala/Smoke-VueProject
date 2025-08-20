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
    <div class="container">
        <div v-if="product" class="product-detail">
            <div class="product-image">
                <img :src="product.image" :alt="product.name">
            </div>
            <div class="product-info">
                <h1>{{ product.name }}</h1>
                <p>{{ product.description }}</p>
                <p><strong>分类:</strong> {{ store.categories.find(c => c.id === product.category)?.name }}</p>
                <router-link to="/about" class="add-to-cart-btn">联系我们</router-link>
            </div>
        </div>
        <div v-else>
            <h2>商品未找到</h2>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
}
.product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
}
.product-image img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.product-info h1 {
    margin-top: 0;
    font-size: 2.5em;
}
.product-info p {
    font-size: 1.1em;
    line-height: 1.6;
    color: #555;
}
.add-to-cart-btn {
    display: inline-block; /* Add display property for proper sizing */
    text-decoration: none; /* Remove underline */
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 15px 30px;
    font-size: 1.2em;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 20px;
}
.add-to-cart-btn:hover {
    background-color: #0056b3;
}
</style>
