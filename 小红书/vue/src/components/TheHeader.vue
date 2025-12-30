<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-dark-mode'])

const handleToggleDarkMode = () => {
  emit('toggle-dark-mode')
}

const placeholderText = computed(() => {
  return props.currentUser ? '搜索趣生活' : '登录探索更多内容'
})
</script>

<template>
  <header class="header">
    <div class="search-container">
      <div class="search-input-wrapper">
        <input type="text" :placeholder="placeholderText" class="search-input" />
        <button class="search-btn">
          <svg class="icon" viewBox="0 0 24 24" :fill="isDarkMode ? 'var(--text-secondary)' : '#666'">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="right-actions">
      <a href="#" class="action-link">创作中心</a>
      <a href="#" class="action-link">业务合作</a>
      <button class="dark-mode-toggle" @click="handleToggleDarkMode" :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'">
        <svg v-if="!isDarkMode" class="icon" viewBox="0 0 24 24" fill="var(--text-secondary)">
          <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"/>
        </svg>
        <svg v-else class="icon" viewBox="0 0 24 24" fill="var(--text-primary)">
          <path d="M9.37 5.51C9.19 6.15 9.1 6.82 9.1 7.5c0 4.08 3.32 7.4 7.4 7.4 .68 0 1.35-.09 1.99-.27.65-.19 1.23-.45 1.74-.78-.15-.24-.29-.49-.41-.75-.11-.26-.2-.53-.27-.81-.08-.28-.12-.57-.12-.87 0-1.98.82-3.73 2.11-4.99-1.18-.31-2.43-.48-3.71-.48-4.08 0-7.4 3.32-7.4 7.4 0 .29.04.58.12.86-.33.08-.66.18-1 .29-.71-.71-1.66-1.17-2.72-1.17-1.22 0-2.37.38-3.35 1.03.91-1.49 2.43-2.57 4.21-2.98z"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center; /* Changed from space-between to center */
  padding: 0 40px;
  background-color: var(--white);
  position: sticky;
  top: 0;
  z-index: 90;
}

.search-container {
  /* flex: 1; Removed flexible width */
  width: 100%;
  max-width: 600px;
  margin: 0; /* Auto margin handled by flex justify-center */
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--bg-color);
  border-radius: var(--radius-full);
  height: 48px;
  padding: 0 16px;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.search-input-wrapper:focus-within {
  background-color: var(--white);
  border-color: var(--border-color);
  box-shadow: var(--shadow-sm);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  margin-right: 8px;
  color: var(--text-primary);
  text-align: center; /* Optional: Center text inside input if desired, but user asked for search BAR to move to middle */
}
/* Reverting text-align center as it's usually weird for search inputs unless specified. */
.search-input {
  text-align: left;
}


.search-btn {
  padding: 4px;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  position: absolute; /* Take out of flow to keep search strictly centered */
  right: 40px;
  height: 100%;
}

.action-link {
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
}

.action-link:hover {
  color: var(--text-primary);
}

.dark-mode-toggle {
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.dark-mode-toggle:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .dark-mode-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.login-btn {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 24px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 15px;
  transition: opacity 0.2s;
}

.login-btn:hover {
  opacity: 0.9;
}
</style>
