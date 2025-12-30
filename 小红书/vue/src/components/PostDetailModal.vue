<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'interaction'])

const videoRef = ref(null)
const commentInputRef = ref(null)
const isPlaying = ref(false)
const isLiked = ref(props.post.likeStatus || false)
const isCollected = ref(props.post.collectionStatus || false)
const likeCount = ref(props.post.likeCount || props.post.likes || 0)
const collectCount = ref(props.post.collectionCount || 0)
const comments = ref([])
const newComment = ref('')
const isLoadingComments = ref(false)

const formattedLikes = computed(() => {
  const num = likeCount.value
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num
})

const formattedCollects = computed(() => {
  const num = collectCount.value
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num
})

const commentCount = computed(() => comments.value.length)

const formattedCommentCount = computed(() => {
  const num = commentCount.value
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

const fetchComments = async () => {
  if (!props.post.id) return
  
  isLoadingComments.value = true
  try {
    const response = await fetch(`http://localhost:3000/posts/${props.post.id}/comments`)
    const data = await response.json()
    comments.value = data.map(c => ({
      id: c.id,
      post_id: c.post_id,
      user_id: c.user_id,
      content: c.content,
      createdAt: c.created_at,
      user: c.user
    }))
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  } finally {
    isLoadingComments.value = false
  }
}

const handleLike = async () => {
  if (!props.currentUser) {
    alert('请先登录')
    return
  }
  
  try {
    if (isLiked.value) {
      await fetch(`http://localhost:3000/posts/${props.post.id}/unlike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: props.currentUser.id })
      })
      likeCount.value = Math.max(0, likeCount.value - 1)
    } else {
      await fetch(`http://localhost:3000/posts/${props.post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: props.currentUser.id })
      })
      likeCount.value++
    }
    isLiked.value = !isLiked.value
    emit('interaction')
  } catch (error) {
    console.error('Failed to toggle like:', error)
  }
}

const handleCollect = async () => {
  if (!props.currentUser) {
    alert('请先登录')
    return
  }
  
  try {
    if (isCollected.value) {
      await fetch(`http://localhost:3000/posts/${props.post.id}/uncollect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: props.currentUser.id })
      })
      collectCount.value = Math.max(0, collectCount.value - 1)
    } else {
      await fetch(`http://localhost:3000/posts/${props.post.id}/collect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: props.currentUser.id })
      })
      collectCount.value++
    }
    isCollected.value = !isCollected.value
    emit('interaction')
  } catch (error) {
    console.error('Failed to toggle collect:', error)
  }
}

const handleSubmitComment = async () => {
  if (!props.currentUser) {
    alert('请先登录')
    return
  }
  
  const content = newComment.value.trim()
  if (!content) return
  
  try {
    const response = await fetch(`http://localhost:3000/posts/${props.post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: props.currentUser.id,
        content: content
      })
    })
    
    const newC = await response.json()
    comments.value.unshift({
      id: newC.id,
      post_id: newC.post_id,
      user_id: newC.user_id,
      content: newC.content,
      createdAt: newC.created_at,
      user: newC.user
    })
    newComment.value = ''
    emit('interaction')
  } catch (error) {
    console.error('Failed to post comment:', error)
  }
}

const handleDeleteComment = async (commentId) => {
  if (!props.currentUser) return
  
  try {
    await fetch('http://localhost:3000/posts/comments/' + commentId, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: props.currentUser.id })
    })
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch (error) {
    console.error('Failed to delete comment:', error)
  }
}

const focusCommentInput = () => {
  if (commentInputRef.value) {
    commentInputRef.value.focus()
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前'
  
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  fetchComments()
})

watch(() => props.post.id, () => {
  fetchComments()
})
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
          <h3 class="comments-title">共 {{ formattedCommentCount }} 条评论</h3>
          <div v-if="isLoadingComments" class="loading-comments">
            <p>加载中...</p>
          </div>
          <div v-else class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <img :src="comment.user.avatar" :alt="comment.user.nickname" class="comment-avatar" />
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-username">{{ comment.user.nickname }}</span>
                  <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <button 
                  v-if="currentUser && comment.user_id === currentUser.id" 
                  @click="handleDeleteComment(comment.id)" 
                  class="delete-comment-btn"
                >
                  删除
                </button>
              </div>
            </div>
            <p v-if="comments.length === 0" class="no-comments">暂无评论，快来发表你的看法吧~</p>
          </div>
        </div>
        
        <!-- Bottom actions -->
        <div class="actions-bar">
          <div class="comment-input-wrapper">
            <input 
              ref="commentInputRef"
              type="text" 
              placeholder="说点什么..." 
              class="comment-input" 
              v-model="newComment"
              @keyup.enter="handleSubmitComment"
            />
          </div>
          <div class="action-buttons">
            <div 
              class="action-item" 
              :class="{ active: isLiked }" 
              @click="handleLike"
            >
              <svg viewBox="0 0 24 24" :fill="isLiked ? '#ff2442' : 'none'" :stroke="isLiked ? '#ff2442' : 'currentColor'" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>{{ formattedLikes }}</span>
            </div>
            <div 
              class="action-item" 
              :class="{ active: isCollected }" 
              @click="handleCollect"
            >
              <svg viewBox="0 0 24 24" :fill="isCollected ? '#ff2442' : 'none'" :stroke="isCollected ? '#ff2442' : 'currentColor'" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>{{ formattedCollects }}</span>
            </div>
            <div class="action-item" @click="focusCommentInput">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <span>{{ formattedCommentCount }}</span>
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

.loading-comments {
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 40px 0;
}

.comment-item {
  display: flex;
  margin-bottom: 16px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-right: 12px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.comment-username {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-right: 8px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.delete-comment-btn {
  font-size: 12px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 4px;
  padding: 0;
}

.delete-comment-btn:hover {
  color: #ff2442;
}

.action-item.active {
  color: #ff2442;
}

.action-item.active svg {
  color: #ff2442;
}

.action-item:hover {
  color: #ff2442;
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
