<script setup>
import { store } from './store';
import { watchEffect, computed } from 'vue';

// Computed property to determine if the current theme is dark
const isDark = computed(() => {
  if (store.theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return store.theme === 'dark';
});

// Function to toggle theme
const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark';
  store.setTheme(newTheme);
};

// Watch for theme changes and apply the class to the <html> element
watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value);
});
</script>

<template>
    <div id="app-container">
        <header>
            <div class="container">
                <div class="logo">
                    <router-link to="/">BestLinksz.com<sup>®</sup></router-link>
                </div>
                <div class="nav-wrapper">
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
                    <button @click="toggleTheme" class="theme-toggle-btn" aria-label="Toggle theme">
                        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    </button>
                </div>
            </div>
        </header>

        <!-- 路由匹配到的组件将在这里渲染 -->
        <main id="main-content">
            <router-view :key="$route.path"/>
        </main>

        <footer>
            <div class="container">
                <p>&copy; 2025 BestLinksz.com. All Rights Reserved.</p>
            </div>
        </footer>
    </div>
</template>

<style>
  @import './assets/base.css';

  /* 全局加载动画 */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    opacity: 0; /* 动画开始前，元素是透明的 */
  }

  .ready .animate-fade-in-up {
    /* 当父元素有 .ready 类时，启动动画 */
    animation: fadeInUp 0.5s ease-out forwards;
  }
</style>

<style scoped>
    #app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .nav-wrapper {
        display: flex;
        align-items: center;
    }

    .theme-toggle-btn {
        background: none;
        border: none;
        cursor: pointer;
        margin-left: 20px;
        color: var(--color-text);
        padding: 5px;
        border-radius: 50%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    .theme-toggle-btn:hover {
        background-color: var(--color-border);
    }

    .theme-toggle-btn svg {
        width: 20px;
        height: 20px;
    }

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
        color: var(--color-text);
    }

    header {
        background-color: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 15px 0;
        position: sticky;
        top: 0;
        z-index: 1000;
        transition: background-color 0.5s;
    }

    html.dark header {
        background-color: rgba(34, 34, 34, 0.75);
    }

    header .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo a {
        font-size: 24px;
        font-weight: bold;
        color: var(--color-text);
    }

    .logo a.router-link-exact-active {
        color: var(--color-text);
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

        nav > ul > li > a {
        font-size: 18px;
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
        background-color: var(--color-background-soft);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        list-style: none;
        padding: 10px 0;
        margin: 0;
        min-width: 85px;
        transform-origin: top;
        transition: opacity 0.2s ease, background-color 0.5s;
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
        font-size: 16px;
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
        background-color: var(--color-background-soft);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        list-style: none;
        padding: 5px 0; /* Reduced panel padding */
        margin: 0;
        min-width: 70px; /* Made panel smaller */
        transform-origin: top;
        transition: opacity 0.2s ease, background-color 0.5s;
    }

    .nested-dropdown-menu li a {
        padding: 8px 15px; /* Reduced link padding */
        font-size: 14px; /* Smaller font */
    }

    .nested-dropdown-menu li:hover {
        background-color: var(--color-background-mute); /* Added subtle hover background */
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
