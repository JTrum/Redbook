<script setup>
import { ref } from 'vue'
import TheSidebar from './components/TheSidebar.vue'
import TheHeader from './components/TheHeader.vue'
import CategoryTabs from './components/CategoryTabs.vue'
import MasonryGrid from './components/MasonryGrid.vue'
import CreationPage from './components/CreationPage.vue'
import NotificationPage from './components/NotificationPage.vue'

const currentView = ref('discovery')

const handleNavChange = (id) => {
  currentView.value = id
}

// Mock Data
const generatePosts = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: [
      '领导说，放心夹 没人跟你抢。。。', 
      '如你们所愿，朋友们', 
      '登场率几乎为0的五款皮肤', 
      '❄️💋', 
      '可以给我起一个中文名吗？谢谢！',
      '从孙吧过来的来感受xhs的威力', 
      '中国为什么', 
      '小红书让我重生了'
    ][i % 8],
    image: [
      'https://picsum.photos/400/600?random=' + i,
      'https://picsum.photos/400/500?random=' + i,
      'https://picsum.photos/400/400?random=' + i,
      'https://picsum.photos/400/700?random=' + i
    ][i % 4],
    type: i % 3 === 0 ? 'video' : 'image',
    user: ['周思语', 'Kirill K哥', '王者荣耀边路', 'Ellen', 'erodimx', 'Test Yoke'][i % 6],
    avatar: 'https://i.pravatar.cc/150?u=' + i,
    likes: Math.floor(Math.random() * 50000)
  }))
}

const posts = ref(generatePosts(20))
</script>

<template>
  <div class="app-container">
    <TheSidebar :active-item="currentView" @change="handleNavChange" />
    <div class="main-content">
      <TheHeader v-if="currentView !== 'publish'" />
      
      <template v-if="currentView === 'discovery'">
        <CategoryTabs />
        <main class="content-scroll-area">
          <MasonryGrid :items="posts" />
        </main>
      </template>

      <template v-else-if="currentView === 'notification'">
        <NotificationPage />
      </template>
      
      <CreationPage v-else-if="currentView === 'publish'" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
}

.content-scroll-area {
  padding: 0 40px 40px 40px;
  flex: 1;
}

@media (max-width: 960px) {
  .main-content {
    margin-left: 80px; /* Collapsed sidebar width if we implemented it, or just smaller */
  }
}
</style>
