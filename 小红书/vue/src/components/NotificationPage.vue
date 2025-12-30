<script setup>
import { ref } from 'vue'

const activeTab = ref('comments')

const tabs = [
  { id: 'comments', label: '评论和@' },
  { id: 'likes', label: '赞和收藏' },
  { id: 'follows', label: '新增关注' }
]
</script>

<template>
  <div class="notification-container">
    <div class="tabs-header">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="notification-content">
      <!-- Empty content as requested -->
    </div>
  </div>
</template>

<style scoped>
.notification-container {
  padding: 0 40px;
  height: 100%;
}

.tabs-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 0;
  margin-bottom: 16px;
}

.tab-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  transition: all 0.2s;
}

.tab-btn.active {
  background-color: rgba(var(--primary-color-rgb), 0.05);
  color: var(--text-primary);
  font-weight: 600;
}

.tab-btn:hover:not(.active) {
  color: var(--text-primary);
}

.notification-content {
  background-color: var(--white); /* Often notification lists have white bg, but user image shows empty white or light gray area */
  min-height: 400px;
  border-radius: 8px;
}
</style>
