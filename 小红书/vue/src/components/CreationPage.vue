<script setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null
  }
})

const activeTab = ref('video') // 'video', 'image', 'article'
const videoFile = ref(null)
const videoUrl = ref('')
const coverUrl = ref('')
const videoInfo = ref(null)
const images = ref([]) // 存储图片文件和信息
const imageUrls = ref([]) // 存储图片预览URL
const articleCoverUrl = ref('') // 长文封面
const title = ref('')
const content = ref('')
const publishType = ref('immediate') // 'immediate' or 'scheduled'
const scheduledTime = ref('')
const isUploading = ref(false)
const showSettings = ref(false)

const fileInputRef = ref(null)
const coverInputRef = ref(null)
const imageInputRef = ref(null) // 图文类型的图片输入
const coverSource = ref('auto') // 'auto' or 'manual'
const manualCoverUrl = ref('')

const formatFileSize = (bytes) => {
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB'
  }
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}min ${secs}s`
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  processVideoFile(file)
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('video/')) {
    processVideoFile(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
}

const processVideoFile = (file) => {
  isUploading.value = true
  videoFile.value = file
  
  // Create video URL for preview
  videoUrl.value = URL.createObjectURL(file)
  
  // Create video element to extract info and cover
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.src = videoUrl.value
  
  video.onloadedmetadata = () => {
    videoInfo.value = {
      name: file.name,
      size: formatFileSize(file.size),
      duration: formatDuration(video.duration),
      width: video.videoWidth,
      height: video.videoHeight
    }
    
    // Seek to 1 second to get a good cover frame
    video.currentTime = Math.min(1, video.duration * 0.1)
  }
  
  video.onseeked = () => {
    // Extract cover from video frame
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    coverUrl.value = canvas.toDataURL('image/jpeg', 0.8)
    isUploading.value = false
  }
  
  video.onerror = () => {
    console.error('Error loading video')
    isUploading.value = false
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const replaceVideo = () => {
  videoFile.value = null
  videoUrl.value = ''
  coverUrl.value = ''
  manualCoverUrl.value = ''
  coverSource.value = 'auto'
  videoInfo.value = null
  triggerFileInput()
}

const triggerCoverInput = () => {
  coverInputRef.value?.click()
}

const handleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    manualCoverUrl.value = e.target.result
    coverSource.value = 'manual'
  }
  reader.readAsDataURL(file)
}

const selectAutoCover = () => {
  coverSource.value = 'auto'
}

const selectManualCover = () => {
  if (manualCoverUrl.value) {
    coverSource.value = 'manual'
  } else {
    triggerCoverInput()
  }
}

// 图文类型的图片处理函数
const handleImageSelect = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return
  
  processImageFiles(files)
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'))
  if (imageFiles.length > 0) {
    processImageFiles(imageFiles)
  }
}

const processImageFiles = (files) => {
  isUploading.value = true
  
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        images.value.push(file)
        imageUrls.value.push(e.target.result)
        isUploading.value = false
      }
      reader.readAsDataURL(file)
    }
  })
}

const triggerImageInput = () => {
  imageInputRef.value?.click()
}

const removeImage = (index) => {
  images.value.splice(index, 1)
  imageUrls.value.splice(index, 1)
}

// 长文类型的封面上传
const handleArticleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    articleCoverUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const triggerArticleCoverInput = () => {
  document.getElementById('article-cover-input')?.click()
}

// Get the active cover URL based on selection
const activeCoverUrl = computed(() => {
  return coverSource.value === 'manual' && manualCoverUrl.value 
    ? manualCoverUrl.value 
    : coverUrl.value
})

const handlePublish = async () => {
  if (!title.value.trim()) {
    alert('请填写标题')
    return
  }
  
  try {
    let postData = {
      title: title.value,
      content: content.value,
      author_id: props.currentUser?.id || 0
    }
    
    // 根据不同的发布类型处理
    switch (activeTab.value) {
      case 'video':
        if (!videoFile.value) {
          alert('请上传视频')
          return
        }
        
        // 1. Upload video file
        const videoFormData = new FormData()
        videoFormData.append('file', videoFile.value)
        
        const uploadRes = await fetch('/api/posts/upload', {
          method: 'POST',
          body: videoFormData
        })
        const uploadData = await uploadRes.json()
        
        // 2. Upload cover image
        let coverImageUrl = ''
        const coverToUpload = coverSource.value === 'manual' && manualCoverUrl.value 
          ? manualCoverUrl.value 
          : coverUrl.value
        
        if (coverToUpload) {
          const coverBlob = await fetch(coverToUpload).then(r => r.blob())
          const coverFormData = new FormData()
          coverFormData.append('file', coverBlob, 'cover.jpg')
          
          const coverRes = await fetch('/api/posts/upload', {
            method: 'POST',
            body: coverFormData
          })
          const coverData = await coverRes.json()
          coverImageUrl = coverData.url
        }
        
        postData = {
          ...postData,
          type: 'video',
          url: uploadData.url,
          cover_url: coverImageUrl
        }
        break
        
      case 'image':
        if (images.value.length === 0) {
          alert('请上传图片')
          return
        }
        
        // 1. Upload images
        const imageUrls = []
        for (const image of images.value) {
          const imageFormData = new FormData()
          imageFormData.append('file', image)
          
          const uploadRes = await fetch('/api/posts/upload', {
            method: 'POST',
            body: imageFormData
          })
          const uploadData = await uploadRes.json()
          imageUrls.push(uploadData.url)
        }
        
        postData = {
          ...postData,
          type: 'image',
          urls: imageUrls,
          cover_url: imageUrls[0] // 使用第一张图片作为封面
        }
        break
        
      case 'article':
        if (!content.value.trim()) {
          alert('请填写文章内容')
          return
        }
        
        // 1. Upload cover image if exists
        let articleCoverImageUrl = ''
        if (articleCoverUrl.value) {
          const coverBlob = await fetch(articleCoverUrl.value).then(response => response.blob())
          const coverFormData = new FormData()
          coverFormData.append('file', coverBlob, 'article_cover.jpg')
          
          const coverRes = await fetch('/api/posts/upload', {
            method: 'POST',
            body: coverFormData
          })
          const coverData = await coverRes.json()
          articleCoverImageUrl = coverData.url
        }
        
        postData = {
          ...postData,
          type: 'article',
          cover_url: articleCoverImageUrl
        }
        break
    }
    
    // Create post
    const postRes = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    })
    
    if (postRes.ok) {
      alert('发布成功！')
      // Reset form
      resetForm()
    }
  } catch (error) {
    console.error('Publish error:', error)
    alert('发布失败，请重试')
  }
}

// Reset form based on active tab
const resetForm = () => {
  title.value = ''
  content.value = ''
  
  switch (activeTab.value) {
    case 'video':
      videoFile.value = null
      videoUrl.value = ''
      coverUrl.value = ''
      manualCoverUrl.value = ''
      coverSource.value = 'auto'
      videoInfo.value = null
      break
      
    case 'image':
      images.value = []
      imageUrls.value = []
      break
      
    case 'article':
      articleCoverUrl.value = ''
      break
  }
}


const canPublish = computed(() => {
  if (!title.value.trim()) return false
  
  switch (activeTab.value) {
    case 'video':
      return videoFile.value !== null
    case 'image':
      return images.value.length > 0
    case 'article':
      return content.value.trim().length > 0
    default:
      return false
  }
})
</script>

<template>
  <div class="creation-container">
    <!-- Hidden file inputs -->
    <input 
      ref="fileInputRef"
      type="file" 
      accept="video/*" 
      @change="handleFileSelect" 
      style="display: none"
    />
    <input 
      ref="coverInputRef"
      type="file" 
      accept="image/*" 
      @change="handleCoverUpload" 
      style="display: none"
    />
    <input 
      ref="imageInputRef"
      type="file" 
      accept="image/*" 
      multiple
      @change="handleImageSelect" 
      style="display: none"
    />
    <input 
      id="article-cover-input"
      type="file" 
      accept="image/*" 
      @change="handleArticleCoverUpload" 
      style="display: none"
    />
    
    <div class="main-body">
      <main class="content-area">
        <!-- Tabs -->
        <div class="tabs">
          <span 
            class="tab" 
            :class="{ active: activeTab === 'video' }"
            @click="activeTab = 'video'"
          >上传视频</span>
          <span 
            class="tab" 
            :class="{ active: activeTab === 'image' }"
            @click="activeTab = 'image'"
          >上传图文</span>
          <span 
            class="tab" 
            :class="{ active: activeTab === 'article' }"
            @click="activeTab = 'article'"
          >写长文</span>
          <span class="drafts">草稿箱(0)</span>
        </div>

        <!-- Video Upload Section -->
        <template v-if="activeTab === 'video'">
          <!-- Before upload -->
          <template v-if="!videoFile">
            <div 
              class="upload-area"
              @drop="handleDrop"
              @dragover="handleDragOver"
              @click="triggerFileInput"
            >
              <div class="upload-content">
                <div class="cloud-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="#e0e0e0">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                  </svg>
                </div>
                <p class="upload-text">拖拽视频到此或点击上传</p>
                <button class="upload-btn" @click.stop="triggerFileInput">上传视频</button>
              </div>
            </div>

            <div class="specs-grid">
              <div class="spec-item">
                <h3>视频大小</h3>
                <p>支持时长60分钟以内，最大20GB的视频文件</p>
              </div>
              <div class="spec-item">
                <h3>视频格式</h3>
                <p>支持常用视频格式，推荐使用mp4、mov</p>
              </div>
              <div class="spec-item">
                <h3>视频分辨率</h3>
                <p>推荐上传720P（1280*720）及以上视频</p>
              </div>
            </div>
          </template>

          <!-- After upload -->
          <template v-else>
            <div class="edit-form">
              <!-- Video Info -->
              <div class="video-info-section">
                <div class="video-info-header">
                  <span class="file-name">{{ videoInfo?.name }}</span>
                  <button class="replace-btn" @click="replaceVideo">替换视频</button>
                </div>
                <div class="video-meta">
                  <span class="success-badge">✓ 上传成功</span>
                  <span>视频大小：{{ videoInfo?.size }}</span>
                  <span>视频时长：{{ videoInfo?.duration }}</span>
                </div>
              </div>

              <!-- Cover Section -->
              <div class="section">
                <h3 class="section-title">封面设置</h3>
                <div class="cover-options">
                  <!-- Auto-captured cover -->
                  <div 
                    class="cover-option" 
                    :class="{ selected: coverSource === 'auto' }"
                    @click="selectAutoCover"
                  >
                    <img v-if="coverUrl" :src="coverUrl" alt="自动截取" class="cover-image" />
                    <div v-else class="cover-placeholder">截取中...</div>
                    <span class="cover-label">自动截取</span>
                    <div v-if="coverSource === 'auto'" class="cover-check">✓</div>
                  </div>
                  
                  <!-- Manual upload cover -->
                  <div 
                    class="cover-option" 
                    :class="{ selected: coverSource === 'manual' && manualCoverUrl }"
                    @click="selectManualCover"
                  >
                    <img v-if="manualCoverUrl" :src="manualCoverUrl" alt="手动上传" class="cover-image" />
                    <div v-else class="cover-placeholder upload-hint">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="#999">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      <span>上传封面</span>
                    </div>
                    <span class="cover-label">{{ manualCoverUrl ? '手动上传' : '点击上传' }}</span>
                    <div v-if="coverSource === 'manual' && manualCoverUrl" class="cover-check">✓</div>
                  </div>
                </div>
              </div>

              <!-- Title -->
              <div class="section">
                <h3 class="section-title">标题 <span class="char-count">{{ title.length }}/20</span></h3>
                <input 
                  v-model="title"
                  type="text" 
                  class="title-input"
                  placeholder="填写标题会有更多赞哦～"
                  maxlength="20"
                />
              </div>

              <!-- Content -->
              <div class="section">
                <h3 class="section-title">正文内容</h3>
                <textarea 
                  v-model="content"
                  class="content-input"
                  placeholder="输入正文描述，真诚有价值的分享予人温暖"
                  rows="4"
                ></textarea>
              </div>

              <!-- Settings Toggle -->
              <div class="section">
                <button class="settings-toggle" @click="showSettings = !showSettings">
                  更多设置
                  <span :class="{ 'rotate': showSettings }">▼</span>
                </button>
                
                <div v-if="showSettings" class="settings-panel">
                  <div class="setting-row">
                    <span class="setting-label">发布时间</span>
                    <div class="publish-options">
                      <label class="radio-option">
                        <input type="radio" v-model="publishType" value="immediate" />
                        <span>立即发布</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" v-model="publishType" value="scheduled" />
                        <span>定时发布</span>
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="publishType === 'scheduled'" class="setting-row">
                    <span class="setting-label">选择时间</span>
                    <input 
                      type="datetime-local" 
                      v-model="scheduledTime"
                      class="datetime-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Publish Buttons -->
              <div class="publish-actions">
                <button 
                  class="publish-btn" 
                  :disabled="!canPublish"
                  @click="handlePublish"
                >
                  发布
                </button>
                <button class="save-draft-btn">暂存离开</button>
              </div>
            </div>
          </template>
        </template>

        <!-- Image Upload Section -->
        <template v-else-if="activeTab === 'image'">
          <!-- Before upload -->
          <template v-if="images.length === 0">
            <div 
              class="upload-area"
              @drop="handleImageDrop"
              @dragover="handleDragOver"
              @click="triggerImageInput"
            >
              <div class="upload-content">
                <div class="cloud-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="#e0e0e0">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                <p class="upload-text">拖拽图片到此或点击上传（支持多张）</p>
                <button class="upload-btn" @click.stop="triggerImageInput">上传图片</button>
              </div>
            </div>

            <div class="specs-grid">
              <div class="spec-item">
                <h3>图片数量</h3>
                <p>支持1-9张图片，每张不超过10MB</p>
              </div>
              <div class="spec-item">
                <h3>图片格式</h3>
                <p>支持JPG、PNG、GIF等常见图片格式</p>
              </div>
              <div class="spec-item">
                <h3>图片分辨率</h3>
                <p>推荐使用高清图片，提升视觉效果</p>
              </div>
            </div>
          </template>

          <!-- After upload -->
          <template v-else>
            <div class="edit-form">
              <!-- Image Preview Section -->
              <div class="section">
                <h3 class="section-title">图片预览</h3>
                <div class="image-preview-grid">
                  <div v-for="(url, index) in imageUrls" :key="index" class="image-preview-item">
                    <img :src="url" :alt="`图片${index + 1}`" class="preview-image" />
                    <button class="remove-image-btn" @click="removeImage(index)">×</button>
                  </div>
                  <div v-if="images.length < 9" class="image-preview-item add-more" @click="triggerImageInput">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="#999">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>添加更多</span>
                  </div>
                </div>
              </div>

              <!-- Title -->
              <div class="section">
                <h3 class="section-title">标题 <span class="char-count">{{ title.length }}/20</span></h3>
                <input 
                  v-model="title"
                  type="text" 
                  class="title-input"
                  placeholder="填写标题会有更多赞哦～"
                  maxlength="20"
                />
              </div>

              <!-- Content -->
              <div class="section">
                <h3 class="section-title">正文内容</h3>
                <textarea 
                  v-model="content"
                  class="content-input"
                  placeholder="输入正文描述，真诚有价值的分享予人温暖"
                  rows="4"
                ></textarea>
              </div>

              <!-- Settings Toggle -->
              <div class="section">
                <button class="settings-toggle" @click="showSettings = !showSettings">
                  更多设置
                  <span :class="{ 'rotate': showSettings }">▼</span>
                </button>
                
                <div v-if="showSettings" class="settings-panel">
                  <div class="setting-row">
                    <span class="setting-label">发布时间</span>
                    <div class="publish-options">
                      <label class="radio-option">
                        <input type="radio" v-model="publishType" value="immediate" />
                        <span>立即发布</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" v-model="publishType" value="scheduled" />
                        <span>定时发布</span>
                      </label>
                    </div>
                  </div>
                  
                  <div v-if="publishType === 'scheduled'" class="setting-row">
                    <span class="setting-label">选择时间</span>
                    <input 
                      type="datetime-local" 
                      v-model="scheduledTime"
                      class="datetime-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Publish Buttons -->
              <div class="publish-actions">
                <button 
                  class="publish-btn" 
                  :disabled="!canPublish"
                  @click="handlePublish"
                >
                  发布
                </button>
                <button class="save-draft-btn">暂存离开</button>
              </div>
            </div>
          </template>
        </template>

        <!-- Article Section -->
        <template v-else-if="activeTab === 'article'">
          <div class="edit-form">
            <!-- Article Cover Section -->
            <div class="section">
              <h3 class="section-title">文章封面</h3>
              <div class="article-cover-section">
                <div v-if="!articleCoverUrl" class="cover-placeholder upload-hint" @click="triggerArticleCoverInput">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="#999">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <span>点击上传封面</span>
                </div>
                <div v-else class="article-cover-preview">
                  <img :src="articleCoverUrl" alt="文章封面" class="article-cover-image" />
                  <button class="remove-cover-btn" @click="articleCoverUrl = ''">删除封面</button>
                </div>
              </div>
            </div>

            <!-- Title -->
            <div class="section">
              <h3 class="section-title">标题 <span class="char-count">{{ title.length }}/20</span></h3>
              <input 
                v-model="title"
                type="text" 
                class="title-input"
                placeholder="填写标题会有更多赞哦～"
                maxlength="20"
              />
            </div>

            <!-- Content -->
            <div class="section">
              <h3 class="section-title">正文内容</h3>
              <textarea 
                v-model="content"
                class="content-input article-input"
                placeholder="写下你的长文内容..."
                rows="15"
              ></textarea>
            </div>

            <!-- Settings Toggle -->
            <div class="section">
              <button class="settings-toggle" @click="showSettings = !showSettings">
                更多设置
                <span :class="{ 'rotate': showSettings }">▼</span>
              </button>
              
              <div v-if="showSettings" class="settings-panel">
                <div class="setting-row">
                  <span class="setting-label">发布时间</span>
                  <div class="publish-options">
                    <label class="radio-option">
                      <input type="radio" v-model="publishType" value="immediate" />
                      <span>立即发布</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" v-model="publishType" value="scheduled" />
                      <span>定时发布</span>
                    </label>
                  </div>
                </div>
                
                <div v-if="publishType === 'scheduled'" class="setting-row">
                  <span class="setting-label">选择时间</span>
                  <input 
                    type="datetime-local" 
                    v-model="scheduledTime"
                    class="datetime-input"
                  />
                </div>
              </div>
            </div>

            <!-- Publish Buttons -->
            <div class="publish-actions">
              <button 
                class="publish-btn" 
                :disabled="!canPublish"
                @click="handlePublish"
              >
                发布
              </button>
              <button class="save-draft-btn">暂存离开</button>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<style scoped>
.creation-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-color);
}

.main-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f7f9fa;
}

.tabs {
  display: flex;
  align-items: center;
  gap: 32px;
  background: var(--white);
  padding: 16px 24px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.tab {
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  padding-bottom: 4px;
}

.tab.active {
  color: var(--primary-color);
  font-weight: 600;
  border-bottom: 2px solid var(--primary-color);
}

.drafts {
  margin-left: auto;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Upload Area */
.upload-area {
  background-color: var(--white);
  border-radius: 4px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-color);
  margin-bottom: 32px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: var(--primary-color);
}

.upload-content {
  text-align: center;
}

.upload-text {
  margin: 16px 0 24px;
  color: var(--text-secondary);
}

.upload-btn {
  background-color: var(--primary-color);
  color: white;
  padding: 10px 32px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.spec-item h3 {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.spec-item p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Edit Form (Full Width) */
.edit-form {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
}

.video-info-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.video-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.file-name {
  font-weight: 600;
  font-size: 16px;
}

.replace-btn {
  color: var(--primary-color);
  font-size: 14px;
}

.video-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--text-secondary);
}

.success-badge {
  color: #52c41a;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  color: var(--text-secondary);
  font-weight: normal;
}

.cover-options {
  display: flex;
  gap: 16px;
}

.cover-option {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.cover-option.selected {
  box-shadow: 0 0 0 2px var(--primary-color);
}

.cover-image {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: block;
}

.cover-placeholder {
  width: 120px;
  height: 160px;
  background: #f5f5f5;
  border: 1px dashed #d0d0d0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 13px;
}

.cover-placeholder.upload-hint {
  flex-direction: column;
  gap: 8px;
}

.cover-label {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.cover-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.title-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
}

.title-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.content-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
}

.content-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.settings-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.settings-toggle span {
  font-size: 10px;
  transition: transform 0.3s;
}

.settings-toggle span.rotate {
  transform: rotate(180deg);
}

.settings-panel {
  margin-top: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.setting-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.setting-row:last-child {
  margin-bottom: 0;
}

.setting-label {
  width: 80px;
  font-size: 14px;
  color: var(--text-secondary);
}

.publish-options {
  display: flex;
  gap: 24px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.datetime-input {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.publish-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.publish-btn {
  background: var(--primary-color);
  color: white;
  padding: 12px 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
}

.publish-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.save-draft-btn {
  padding: 12px 32px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Preview Section */
.preview-section {
  width: 320px;
  flex-shrink: 0;
}

.preview-tabs {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.preview-tab {
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  padding-bottom: 4px;
}

.preview-tab.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.phone-frame {
  background: #1a1a1a;
  border-radius: 32px;
  padding: 12px;
  position: relative;
}

.phone-notch {
  display: flex;
  justify-content: space-between;
  padding: 8px 20px;
  color: white;
  font-size: 12px;
}

/* New Phone Preview Styles */
.phone-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  color: white;
  font-size: 12px;
}

.status-icons {
  display: flex;
  gap: 4px;
  font-size: 10px;
}

.phone-screen {
  position: relative;
  background: #1a1a1a;
  min-height: 560px;
  display: flex;
  flex-direction: column;
}

.phone-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  color: white;
  font-size: 24px;
  z-index: 10;
}

.nav-back {
  cursor: pointer;
  font-weight: 300;
}

.nav-search {
  font-size: 18px;
}

.phone-video-container {
  background: #000;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.phone-content-area {
  flex: 1;
  background: white;
  padding: 16px;
  border-radius: 0;
}

.phone-post-content {
  margin-bottom: 16px;
}

.phone-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.phone-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.phone-user-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.phone-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.phone-user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.phone-username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.phone-meta {
  font-size: 11px;
  color: #999;
}

.phone-follow-btn {
  background: var(--primary-color);
  color: white;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 12px;
}

/* Right side action bar */
.phone-side-actions {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 10;
}

.side-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 10px;
  gap: 4px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.side-action-label {
  font-size: 11px;
  background: rgba(255,255,255,0.2);
  padding: 4px 8px;
  border-radius: 12px;
}

/* Bottom comment bar */
.phone-comment-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #1a1a1a;
  border-radius: 0 0 20px 20px;
}

.phone-comment-input {
  flex: 1;
  background: #333;
  border: none;
  border-radius: 20px;
  padding: 10px 16px;
  color: #999;
  font-size: 13px;
}

.comment-icons {
  color: white;
  font-size: 18px;
}

/* Image Text Styles */
.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.image-preview-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-preview-item.add-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed #d0d0d0;
}

.image-preview-item.add-more:hover {
  background: #e8f0fe;
  border-color: var(--primary-color);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* Article Styles */
.article-cover-section {
  margin-bottom: 16px;
}

.article-cover-preview {
  position: relative;
  width: 100%;
  max-height: 300px;
  border-radius: 8px;
  overflow: hidden;
}

.article-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-cover-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.remove-cover-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.content-input.article-input {
  min-height: 300px;
}
/* Dark mode styles */
[data-theme="dark"] .content-area {
  background-color: var(--bg-color);
}

[data-theme="dark"] .edit-form {
  background: var(--white);
}

[data-theme="dark"] .video-info-section {
  border-bottom-color: var(--border-color);
}

[data-theme="dark"] .tabs {
  border-bottom-color: var(--border-color);
}

[data-theme="dark"] .cover-image {
  border-color: var(--border-color);
}

[data-theme="dark"] .cover-placeholder {
  border-color: var(--border-color);
  background: var(--bg-color);
}

[data-theme="dark"] .title-input {
  border-color: var(--border-color);
  background: var(--bg-color);
  color: var(--text-primary);
}

[data-theme="dark"] .content-input {
  border-color: var(--border-color);
  background: var(--bg-color);
  color: var(--text-primary);
}

[data-theme="dark"] .datetime-input {
  border-color: var(--border-color);
  background: var(--bg-color);
  color: var(--text-primary);
}

[data-theme="dark"] .save-draft-btn {
  border-color: var(--border-color);
}

[data-theme="dark"] .settings-panel {
  background: var(--bg-color);
}

[data-theme="dark"] .image-preview-item.add-more {
  border-color: var(--border-color);
  background: var(--bg-color);
}

[data-theme="dark"] .image-preview-item.add-more:hover {
  background: rgba(255, 36, 66, 0.1);
}
</style>

