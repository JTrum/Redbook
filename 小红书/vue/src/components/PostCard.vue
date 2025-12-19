<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

// Format numbers like 3.6w
const formattedLikes = computed(() => {
  const num = props.post.likes
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num
})
</script>

<template>
  <div class="post-card">
    <div class="image-container">
      <img :src="post.image" :alt="post.title" loading="lazy" />
      <div v-if="post.type === 'video'" class="video-icon">
        <svg class="icon" viewBox="0 0 24 24" fill="white">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="post-title">{{ post.title }}</h3>
      
      <div class="card-footer">
        <div class="user-info">
          <img :src="post.avatar" :alt="post.user" class="avatar" />
          <span class="username">{{ post.user }}</span>
        </div>
        
        <div class="like-info">
          <svg class="icon heart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="like-count">{{ formattedLikes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  break-inside: avoid;
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  /* Shadow is usually minimal in modern xhs, mostly rely on clean layout */
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: auto; /* Allow natural height */
  background: #f0f0f0;
}

.image-container img {
  width: 100%;
  height: auto;
  display: block;
}

.video-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(0,0,0,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.card-content {
  padding: 12px;
}

.post-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary);
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 6px;
  object-fit: cover;
}

.username {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.like-info {
  display: flex;
  align-items: center;
}

.heart-icon {
  width: 14px;
  height: 14px;
  margin-right: 2px;
}
</style>
