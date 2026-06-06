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
}

.actions a:first-child {
  background: var(--color-heading);
  color: var(--color-background);
}

.actions a:last-child {
  border: 1px solid var(--color-border-strong);
  color: var(--color-heading);
}

html.dark .actions a:first-child {
  background: var(--color-accent);
  color: var(--color-accent-ink);
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
