<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const videoRef = ref(null)
const isPlaying = ref(false)

const formattedLikes = computed(() => {
  const num = props.post.likes
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num
})

const togglePlay = () => {
  if (videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause()
    } else {
      videoRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

const handleVideoEnded = () => {
  isPlaying.value = false
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="post-detail-modal">
      <!-- Close button -->
      <button class="close-btn" @click="closeModal">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
      
      <!-- Left: Media -->
      <div class="media-section">
        <div class="media-container" @click="togglePlay">
          <template v-if="post.type === 'video'">
            <video 
              ref="videoRef"
              :src="post.videoUrl"
              :poster="post.image"
              class="media-content"
              @ended="handleVideoEnded"
            />
            <div v-if="!isPlaying" class="play-overlay">
              <svg class="play-icon" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </template>
          <template v-else>
            <img :src="post.image" :alt="post.title" class="media-content" />
          </template>
        </div>
      </div>
      
      <!-- Right: Details -->
      <div class="details-section">
        <!-- Author info -->
        <div class="author-header">
          <img :src="post.avatar" :alt="post.user" class="author-avatar" />
          <span class="author-name">{{ post.user }}</span>
          <button class="follow-btn">关注</button>
        </div>
        
        <!-- Content -->
        <div class="content-area">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-description">{{ post.description || '' }}</p>
          <p class="post-date">{{ new Date(post.createdAt).toLocaleDateString('zh-CN') }}</p>
        </div>
        
        <!-- Comments section -->
        <div class="comments-section">
          <h3 class="comments-title">共 0 条评论</h3>
          <div class="comments-list">
            <p class="no-comments">暂无评论，快来发表你的看法吧~</p>
          </div>
        </div>
        
        <!-- Bottom actions -->
        <div class="actions-bar">
          <div class="comment-input-wrapper">
            <input type="text" placeholder="说点什么..." class="comment-input" />
          </div>
          <div class="action-buttons">
            <div class="action-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>{{ formattedLikes }}</span>
            </div>
            <div class="action-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>收藏</span>
            </div>
            <div class="action-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.post-detail-modal {
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  max-width: 90vw;
  max-height: 90vh;
  width: 1000px;
  height: 680px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.close-btn svg {
  width: 20px;
  height: 20px;
  color: #333;
}

.close-btn:hover {
  background: #fff;
}

/* Left media section */
.media-section {
  flex: 1;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.media-container {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.media-content {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.play-icon {
  width: 80px;
  height: 80px;
  opacity: 0.9;
}

/* Right details section */
.details-section {
  width: 400px;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.author-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  flex: 1;
  margin-left: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.follow-btn {
  padding: 6px 16px;
  background: #ff2442;
  color: #fff;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.follow-btn:hover {
  background: #e0203a;
}

.content-area {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.post-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.post-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
  white-space: pre-wrap;
}

.post-date {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.comments-section {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.comments-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 16px 0;
}

.no-comments {
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 40px 0;
}

.actions-bar {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.comment-input-wrapper {
  flex: 1;
}

.comment-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

.comment-input:focus {
  border-color: #ff2442;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  cursor: pointer;
}

.action-item svg {
  width: 20px;
  height: 20px;
}

.action-item span {
  font-size: 13px;
}

.action-item:hover {
  color: #ff2442;
}
</style>
