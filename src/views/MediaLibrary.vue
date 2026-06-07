<script setup>
import { ref } from 'vue';
import { store } from '../store';

const imageModules = import.meta.glob('/public/电子烟/*.{jpg,jpeg,png,svg,webp}', { eager: true });
const images = Object.keys(imageModules)
  .map((path) => path.replace('/public/电子烟/', ''))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

const coreProducts = ref([
  { id: 1, name: "Product 1 (Aurora Slim Pod)", mainImage: "/电子烟/微信图片_20250805234550_1239.jpg" },
  { id: 3, name: "Product 3 (Pulse Max Disposable)", mainImage: "/电子烟/disposable_vape_max.png" },
  { id: 4, name: "Product 4 (Edge Mini Disposable)", mainImage: "/电子烟/微信图片_20250805234550_1230.jpg" },
  { id: 7, name: "Product 7 (Metro Open Pod Kit)", mainImage: "/电子烟/微信图片_20250805234550_1216.jpg" }
]);
</script>

<template>
  <div class="media-library-page">
    <div class="container">
      <h1>本地媒体资源库 (Media Library)</h1>
      <p class="subtitle">用于快速对照、预览和管理项目 public/电子烟/ 目录下的所有本地实拍图片资产。</p>

      <section class="core-comparison">
        <h2>核心产品主图参考</h2>
        <div class="comparison-grid">
          <div v-for="prod in coreProducts" :key="prod.id" class="prod-ref-card">
            <div class="img-box">
              <img :src="prod.mainImage" alt="main" />
            </div>
            <h3>{{ prod.name }}</h3>
            <code>{{ prod.mainImage }}</code>
          </div>
        </div>
      </section>

      <section class="all-assets">
        <h2>所有 public/电子烟/ 下的原始图片 (共 {{ images.length }} 张)</h2>
        <div class="assets-grid">
          <div v-for="img in images" :key="img" class="asset-card">
            <div class="img-box">
              <img :src="'/电子烟/' + img" loading="lazy" />
            </div>
            <div class="asset-info">
              <p class="name">{{ img }}</p>
              <code>/电子烟/{{ img }}</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.media-library-page {
  padding: 40px 0;
  background: #111;
  color: #eee;
  min-height: 100vh;
}
.container {
  width: min(1400px, calc(100% - 40px));
  margin: 0 auto;
}
h1 {
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 8px;
  color: #fff;
}
.subtitle {
  color: #aaa;
  margin-bottom: 30px;
}
h2 {
  font-size: 1.5rem;
  border-left: 4px solid var(--color-accent, #10b981);
  padding-left: 12px;
  margin: 40px 0 20px;
  color: #fff;
}
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.prod-ref-card {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}
.prod-ref-card .img-box {
  aspect-ratio: 1;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-bottom: 10px;
}
.prod-ref-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.prod-ref-card h3 {
  font-size: 0.95rem;
  margin-bottom: 6px;
}
.prod-ref-card code, .asset-card code {
  font-size: 0.75rem;
  color: #888;
  background: #000;
  padding: 2px 6px;
  border-radius: 4px;
  word-break: break-all;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.asset-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.asset-card .img-box {
  aspect-ratio: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}
.asset-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.asset-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
  justify-content: space-between;
}
.asset-info .name {
  font-size: 0.88rem;
  font-weight: bold;
  word-break: break-all;
}
</style>
