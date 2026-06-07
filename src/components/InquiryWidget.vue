<script setup>
import { ref, computed } from 'vue';
import { store, inquiryEmail } from '../store';

const isOpen = ref(false);
const name = ref('');
const email = ref('');
const message = ref('');
const status = ref('idle'); // idle, sending, success, error
const errorMessage = ref('');

const toggleWidget = () => {
  // 如果后台未配置 Web3Forms Key，执行智能降级：复制邮箱并唤起邮件客户端
  if (!store.web3formsKey) {
    store.showToast(store.language === 'zh' ? '在线询盘服务尚未激活，已为您复制邮箱并拉起邮件客户端...' : 'Inquiry form not activated yet, copied email and opening mail client...');
    try {
      navigator.clipboard.writeText(inquiryEmail);
    } catch (err) {
      console.error('Failed to copy email: ', err);
    }
    window.location.href = `mailto:${inquiryEmail}?subject=B2B%20Inquiry`;
    return;
  }

  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    status.value = 'idle';
    errorMessage.value = '';
  }
};

const closeWidget = () => {
  isOpen.value = false;
};

const isFormValid = computed(() => {
  return email.value.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && message.value.trim() !== '';
});

const handleSend = async () => {
  if (!isFormValid.value) return;

  status.value = 'sending';
  errorMessage.value = '';

  const formData = {
    name: name.value,
    email: email.value,
    message: message.value,
    _subject: `New B2B Inquiry from ${name.value || 'Business Buyer'}`,
    _to: inquiryEmail
  };

  const res = await store.submitInquiry(formData);
  if (res.success) {
    status.value = 'success';
    name.value = '';
    email.value = '';
    message.value = '';
  } else {
    status.value = 'error';
    errorMessage.value = res.error || store.t('inquiry.error');
  }
};
</script>

<template>
  <div class="inquiry-widget-container" :class="{ open: isOpen }">
    <!-- 询盘留言小浮窗 -->
    <transition name="widget-fade">
      <div v-if="isOpen" class="inquiry-widget-panel">
        <div class="panel-header">
          <h3>💬 {{ store.t('inquiry.title') }}</h3>
          <button class="close-btn" @click="closeWidget" aria-label="Close form">&times;</button>
        </div>

        <div class="panel-body">
          <!-- 发送成功状态 -->
          <div v-if="status === 'success'" class="status-view success">
            <div class="status-icon">✓</div>
            <p>{{ store.t('inquiry.success') }}</p>
            <button class="btn btn-primary" @click="closeWidget">{{ store.t('inquiry.close') }}</button>
          </div>

          <!-- 表单主内容 -->
          <form v-else @submit.prevent="handleSend" class="inquiry-form">
            <div class="form-group">
              <label for="inquiry-name">{{ store.t('inquiry.name') }}</label>
              <input 
                id="inquiry-name" 
                v-model="name" 
                type="text" 
                :placeholder="store.t('inquiry.placeholderName')"
                :disabled="status === 'sending'"
              />
            </div>
            
            <div class="form-group">
              <label for="inquiry-email">{{ store.t('inquiry.email') }} <span class="required">*</span></label>
              <input 
                id="inquiry-email" 
                v-model="email" 
                type="email" 
                required
                :placeholder="store.t('inquiry.placeholderEmail')"
                :disabled="status === 'sending'"
              />
            </div>

            <div class="form-group">
              <label for="inquiry-message">{{ store.t('inquiry.message') }} <span class="required">*</span></label>
              <textarea 
                id="inquiry-message" 
                v-model="message" 
                rows="4"
                required
                :placeholder="store.t('inquiry.placeholderMessage')"
                :disabled="status === 'sending'"
              ></textarea>
            </div>

            <div v-if="status === 'error'" class="error-banner">
              ⚠️ {{ errorMessage }}
            </div>

            <button 
              type="submit" 
              class="btn btn-submit" 
              :disabled="status === 'sending' || !isFormValid"
            >
              <span v-if="status === 'sending'">{{ store.t('inquiry.sending') }}</span>
              <span v-else>{{ store.t('inquiry.send') }}</span>
            </button>
          </form>
        </div>
      </div>
    </transition>

    <!-- 悬浮唤起按钮 (药丸状) -->
    <button class="inquiry-trigger-btn" @click="toggleWidget" :aria-label="store.t('inquiry.button')">
      <span class="icon">✉</span>
      <span class="text">{{ store.t('inquiry.button') }}</span>
    </button>
  </div>
</template>

<style scoped>
/* 悬浮按钮及整体容器 */
.inquiry-widget-container {
  position: fixed;
  bottom: 84px; /* 避开 bottom: 24px 的 back-to-top */
  right: 24px;
  z-index: 990;
  font-family: var(--font-body);
}

.inquiry-trigger-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 18px;
  border-radius: 23px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface-elevated) 68%, transparent);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  color: var(--color-heading);
  cursor: pointer;
  box-shadow: 0 8px 24px var(--color-shadow);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.inquiry-trigger-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--color-accent-rgb), 0.8);
  background: rgba(var(--color-accent-rgb), 0.25);
  color: var(--color-link);
  box-shadow: 
    0 12px 30px var(--color-shadow-hover),
    0 0 16px rgba(var(--color-accent-rgb), 0.3);
}

.inquiry-trigger-btn .icon {
  font-size: 1.15rem;
}

.inquiry-trigger-btn .text {
  font-weight: 800;
  font-size: 0.92rem;
  letter-spacing: 0.2px;
}

/* 询盘浮窗面板 */
.inquiry-widget-panel {
  position: absolute;
  bottom: 58px;
  right: 0;
  width: 350px;
  background: color-mix(in srgb, var(--color-surface) 72%, transparent);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border-strong);
  border-radius: 16px;
  box-shadow: 
    0 20px 48px rgba(0, 0, 0, 0.15),
    0 0 24px rgba(var(--color-accent-rgb), 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: color-mix(in srgb, var(--color-background-soft) 40%, transparent);
}

.panel-header h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 900;
  color: var(--color-heading);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--color-heading);
}

.panel-body {
  padding: 20px;
}

/* 表单细节 */
.inquiry-form {
  display: grid;
  gap: 14px;
}

.form-group {
  display: grid;
  gap: 6px;
}

.form-group label {
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.form-group label .required {
  color: #ff4d4f;
}

.form-group input,
.form-group textarea {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 9px 12px;
  font-size: 0.88rem;
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-background) 50%, var(--color-surface));
  transition: all 0.2s;
  width: 100%;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--color-accent);
  background: var(--color-surface);
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--color-accent-rgb), 0.12);
}

.form-group textarea {
  resize: none;
}

.error-banner {
  background: rgba(255, 77, 79, 0.08);
  border-left: 3px solid #ff4d4f;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 0.78rem;
  color: #ff4d4f;
  line-height: 1.4;
}

/* 按钮通用 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-submit {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  margin-top: 6px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--color-accent) 88%, #fff);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 成功状态显示 */
.status-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 10px;
  gap: 16px;
}

.status-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 1.7rem;
  font-weight: 900;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-accent) 15%, transparent);
}

.status-view p {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.5;
}

.status-view .btn-primary {
  width: 100%;
  background: var(--color-heading);
  color: var(--color-background);
}

.status-view .btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-shadow);
}

/* 过渡动画 */
.widget-fade-enter-active,
.widget-fade-leave-active {
  transition: 
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.widget-fade-enter-from,
.widget-fade-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(15px);
}

/* 手机端响应式 */
@media (max-width: 768px) {
  .inquiry-widget-container {
    bottom: 74px; /* 移动端避开回到顶部 */
    right: 20px;
  }
  
  .inquiry-widget-panel {
    position: fixed;
    bottom: 130px;
    left: 16px;
    right: 16px;
    width: auto;
  }
}
</style>
