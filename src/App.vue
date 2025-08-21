<script setup>
import { ref, watchEffect, computed } from 'vue';
import { store } from './store';

// State for mobile menu
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

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
        <div class="overlay" v-if="isMenuOpen" @click="isMenuOpen = false"></div>

        <button @click="toggleMenu" class="hamburger-btn" aria-label="Toggle menu" :class="{ 'is-active': isMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
        </button>

        <div class="nav-wrapper" :class="{ 'is-open': isMenuOpen }">
            <nav>
                <ul>
                    <li @click="isMenuOpen = false"><router-link to="/">Home</router-link></li>
                    <li class="dropdown">
                        <a href="#">Products</a>
                        <ul class="dropdown-menu">
                            <li v-for="category in store.categories" :key="category.id" class="nested-dropdown">
                                <router-link @click="isMenuOpen = false" :to="`/category/${category.id}`">{{ category.name }}</router-link>
                                <ul class="nested-dropdown-menu">
                                    <li v-for="product in store.getProductsByCategory(category.id)" :key="product.id">
                                        <router-link @click="isMenuOpen = false" :to="`/product/${product.id}`">{{ product.name }}</router-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li @click="isMenuOpen = false"><router-link to="/about">About</router-link></li>
                    <li @click="isMenuOpen = false"><router-link to="/blog">Blog</router-link></li>
                </ul>
            </nav>
            <button @click="toggleTheme" class="theme-toggle-btn" aria-label="Toggle theme">
                <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>
        </div>

        <header>
            <div class="container">
                <div class="logo">
                    <router-link to="/">BestLinksz.com<sup>®</sup></router-link>
                </div>
                <!-- Desktop navigation is now here -->
                <div class="nav-wrapper-desktop">
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
                            <li><router-link to="/blog">Blog</router-link></li>
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

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(4px);
        z-index: 1001; /* Below menu, above content */
        transition: opacity 0.3s ease-in-out;
    }

    #main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .nav-wrapper-desktop {
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

    .nav-wrapper-desktop nav > ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
    }

    .nav-wrapper-desktop nav > ul > li {
        margin-left: 20px;
    }

    .nav-wrapper-desktop nav > ul > li > a {
        font-size: 18px;
        padding: 10px;
        transition: color 0.3s ease;
    }

    .nav-wrapper-desktop nav ul li a:hover, .nav-wrapper-desktop .router-link-exact-active {
        color: #007bff;
    }

    .hamburger-btn {
        display: none; /* Hidden on desktop */
    }

    /* --- Desktop Styles (screens wider than 768px) --- */
    @media (min-width: 768px) {
        .overlay { display: none; } /* Hide overlay on desktop */
        .nav-wrapper { display: none; } /* Hide mobile nav wrapper on desktop */

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

        .nested-dropdown {
            position: relative;
        }

        .nested-dropdown-menu {
            opacity: 0;
            visibility: hidden;
            position: absolute;
            top: -10px;
            left: 100%;
            background-color: var(--color-background-soft);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            list-style: none;
            padding: 5px 0;
            margin: 0;
            min-width: 70px;
            transform-origin: top;
            transition: opacity 0.2s ease, background-color 0.5s;
        }

        .nested-dropdown-menu li a {
            padding: 8px 15px;
            font-size: 14px;
        }

        .nested-dropdown-menu li:hover {
            background-color: var(--color-background-mute);
        }

        .nested-dropdown:hover .nested-dropdown-menu {
            opacity: 1;
            visibility: visible;
            animation: growDown 0.2s ease-out;
        }
    }

    /* --- Mobile Styles (screens narrower than 768px) --- */
    @media (max-width: 767px) {
        .nav-wrapper-desktop { display: none; }

        .hamburger-btn {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            width: 2rem;
            height: 2rem;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            z-index: 1003; /* Above overlay and menu */
            position: fixed;
            top: 1.2rem;
            right: 20px;
        }

        .hamburger-btn span {
            width: 2rem;
            height: 0.25rem;
            background: var(--color-text);
            border-radius: 10px;
            transition: all 0.3s linear;
            position: relative;
            transform-origin: 1px;
        }
        
        .hamburger-btn.is-active span:nth-child(1) {
            transform: rotate(45deg);
        }

        .hamburger-btn.is-active span:nth-child(2) {
            opacity: 0;
            transform: translateX(20px);
        }

        .hamburger-btn.is-active span:nth-child(3) {
            transform: rotate(-45deg);
        }

        .nav-wrapper {
            position: fixed;
            top: 0;
            right: 0;
            left: auto;
            width: 65%;
            height: 100vh;
            background-color: var(--color-background);
            color: var(--color-text);
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            padding-top: 5rem;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            z-index: 1002;
            box-shadow: -5px 0px 15px rgba(0,0,0,0.1);
        }

        .nav-wrapper.is-open {
            transform: translateX(0);
        }

        .nav-wrapper .theme-toggle-btn {
            margin-top: 2rem;
            align-self: center;
        }

        .nav-wrapper nav {
            width: 100%;
        }
        
        .nav-wrapper nav > ul {
            flex-direction: column;
            width: 100%;
            text-align: left;
        }

        .nav-wrapper nav > ul > li {
            margin: 0;
            width: 100%;
        }
        
        .nav-wrapper nav > ul > li > a {
            display: flex;
            align-items: center;
            padding: 1rem 2rem;
            font-size: 1.2rem;
            color: var(--color-text);
        }

        .nav-wrapper .dropdown > a {
            cursor: pointer;
        }

        .nav-wrapper .dropdown-menu, .nav-wrapper .nested-dropdown-menu {
            position: static;
            box-shadow: none;
            background-color: transparent;
            padding-left: 2rem;
            min-width: 100%;
            display: block;
            visibility: visible;
            opacity: 1;
            transition: none;
        }
        
        .nav-wrapper .dropdown-menu li a, .nav-wrapper .nested-dropdown-menu li a {
            padding: 0.75rem 0;
            font-size: 1rem;
            white-space: normal;
            display: flex;
            align-items: center;
        }
    }

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


