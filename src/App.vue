<script setup>
import { store } from './store';
</script>

<template>
    <header>
        <div class="container">
            <div class="logo">
                <router-link to="/">BestLinksz.com</router-link>
            </div>
            <nav>
                <ul>
                    <li><router-link to="/">Home</router-link></li>
                    <li class="dropdown">
                        <a href="#">Products</a>
                        <ul class="dropdown-menu">
                            <li v-for="category in store.categories" :key="category.id" class="nested-dropdown">
                                <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
                                <ul class="nested-dropdown-menu">
                                    <li v-for="product in store.getProductsByCategory(category.id)" :key="product.id">
                                        <router-link :to="`/product/${product.id}`">{{ product.name }}</router-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li><router-link to="/about">About</router-link></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- 路由匹配到的组件将在这里渲染 -->
    <router-view :key="$route.path"/>

    <footer>
        <div class="container">
            <p>&copy; 2025 BestLinksz.com. All Rights Reserved.</p>
        </div>
    </footer>
</template>

<style scoped>
    /* Basic styles from the original App.vue */
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

    nav > ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
    }

    nav > ul > li {
        margin-left: 20px;
    }

    nav ul li a {
        font-size: 16px;
        padding: 10px;
        transition: color 0.3s ease;
    }

    nav ul li a:hover, .router-link-exact-active {
        color: #007bff;
    }

    .dropdown {
        position: relative;
    }

    @keyframes growDown {
        from {
            transform: scaleY(0);
        }
        to {
            transform: scaleY(1);
        }
    }

    .dropdown-menu {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        list-style: none;
        padding: 10px 0;
        margin: 0;
        min-width: 150px;
        transform-origin: top;
        transition: opacity 0.2s ease;
    }

    .dropdown:hover .dropdown-menu {
        opacity: 1;
        visibility: visible;
        animation: growDown 0.2s ease-out;
    }

    .dropdown-menu li a {
        display: block;
        padding: 10px 20px;
        white-space: nowrap;
    }

    /* --- New styles for nested dropdown --- */
    .nested-dropdown {
        position: relative;
    }

    .nested-dropdown-menu {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        top: -10px; /* Align with the top of the parent li's padding */
        left: 100%;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        list-style: none;
        padding: 5px 0; /* Reduced panel padding */
        margin: 0;
        min-width: 130px; /* Made panel smaller */
        transform-origin: top;
        transition: opacity 0.2s ease;
    }

    .nested-dropdown-menu li a {
        padding: 8px 15px; /* Reduced link padding */
        font-size: 14px; /* Smaller font */
    }

    .nested-dropdown-menu li:hover {
        background-color: #f8f9fa; /* Added subtle hover background */
    }

    .nested-dropdown:hover .nested-dropdown-menu {
        opacity: 1;
        visibility: visible;
        animation: growDown 0.2s ease-out;
    }
    /* --- End of new styles --- */

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

    /* Page transition animation */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>