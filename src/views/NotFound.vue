<script setup>
import { store } from '../store';
</script>

<template>
  <main class="not-found">
    <div class="container">
      <p class="eyebrow">404</p>
      <h1>{{ store.t('notFound.title') }}</h1>
      <p>{{ store.t('notFound.text') }}</p>
      <div class="actions">
        <router-link to="/">{{ store.t('common.backHome') }}</router-link>
        <router-link to="/category/pod-systems">{{ store.t('common.viewProducts') }}</router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 90px 0;
}

.container {
  width: min(820px, calc(100% - 40px));
  margin: 0 auto;
  text-align: center;
}

.eyebrow {
  margin-bottom: 12px;
  color: var(--color-link);
  font-size: 0.82rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  color: var(--color-heading);
  font-size: clamp(3rem, 12vw, 7rem);
  line-height: 0.94;
  font-weight: 900;
}

p:not(.eyebrow) {
  max-width: 560px;
  margin: 18px auto 0;
  color: var(--color-text-muted);
  font-size: 1.05rem;
}

.actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.actions a {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0 18px;
  font-weight: 900;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.actions a:hover {
  transform: translateY(-2px);
}

.actions a:first-child {
  background: var(--color-heading);
  color: var(--color-background);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.actions a:first-child:hover {
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.actions a:last-child {
  border: 1px solid var(--color-border-strong);
  color: var(--color-heading);
}

.actions a:last-child:hover {
  background: var(--color-surface-elevated);
}

html.dark .actions a:first-child {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  box-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 10%, transparent);
}

html.dark .actions a:first-child:hover {
  background: color-mix(in srgb, var(--color-accent) 88%, #fff);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 40%, transparent);
}

@media (max-width: 560px) {
  .actions {
    flex-direction: column;
  }

  .actions a {
    width: 100%;
  }
}
</style>
