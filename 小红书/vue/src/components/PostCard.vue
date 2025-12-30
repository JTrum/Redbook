<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-detail'])
const isLiked = ref(props.post.likeStatus || false)
const likeCount = ref(props.post.likeCount || props.post.likes || 0)

const formattedLikes = computed(() => {
  const num = likeCount.value
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num
})

const heartClass = computed(() => {
  return isLiked.value ? 'heart-icon liked' : 'heart-icon'
})

const heartFill = computed(() => {
  return isLiked.value ? '#ff2442' : 'none'
})

const heartColor = computed(() => {
  return isLiked.value ? '#ff2442' : 'currentColor'
})

const handleCardClick = () => {
  emit('open-detail', props.post)
}
</script>

<template>
  <div class="post-card" @click="handleCardClick">
    <div class="media-container">
      <img :src="post.image" :alt="post.title" class="cover-image" loading="lazy" />
      
      <!-- Video play icon in top-right corner -->
      <div v-if="post.type === 'video'" class="video-badge">
        <svg class="play-icon" viewBox="0 0 24 24" fill="white">
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
          <svg :class="heartClass" viewBox="0 0 24 24" :fill="heartFill" :stroke="heartColor" stroke-width="2">
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
  margin-bottom: 20px;
  cursor: pointer;
}

.post-card:hover .media-container {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.media-container {
  position: relative;
  width: 210px;
  height: 280px;
  background: #f5f5f5;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cover-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.video-player {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
  background: #000;
}

/* Small play badge in top-right corner like Xiaohongshu */
.video-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-icon {
  width: 14px;
  height: 14px;
}

/* Text content outside the card */
.card-content {
  padding: 10px 4px 0;
  background: transparent;
}

.post-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0 0 8px 0;
  color: #333;
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
  color: #999;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.username {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
  font-size: 12px;
}

.like-info {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 10px;
}

.heart-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  color: #999;
  transition: all 0.2s ease;
}

.heart-icon.liked {
  color: #ff2442;
}

.heart-icon:hover {
  transform: scale(1.1);
}

.like-count {
  color: #999;
  font-size: 12px;
}
</style>
