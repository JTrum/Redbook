<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-user', 'back'])

// Edit modal state
const showEditModal = ref(false)
const editNickname = ref('')
const editGender = ref('')
const editBio = ref('')
const editAvatar = ref('')
const avatarInputRef = ref(null)

const genderOptions = ['男', '女', '保密']
const activeTab = ref('notes')

const tabs = [
  { id: 'notes', label: '笔记' },
  { id: 'favorites', label: '收藏' },
  { id: 'likes', label: '点赞' }
]

// Mock stats (in a real app, these would come from the backend)
const stats = computed(() => ({
  following: Math.floor(Math.random() * 10),
  followers: Math.floor(Math.random() * 100),
  likes: Math.floor(Math.random() * 500)
}))

const openEditModal = () => {
  editNickname.value = props.currentUser?.nickname || ''
  editGender.value = props.currentUser?.gender || '保密'
  editBio.value = props.currentUser?.bio || ''
  editAvatar.value = props.currentUser?.avatar || ''
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const triggerAvatarUpload = () => {
  avatarInputRef.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editAvatar.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  try {
    const response = await fetch('http://localhost:3000/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: props.currentUser.id,
        nickname: editNickname.value,
        gender: editGender.value,
        avatar: editAvatar.value,
        bio: editBio.value
      })
    })

    if (response.ok) {
      const updatedUser = await response.json()
      emit('update-user', updatedUser)
      showEditModal.value = false
    } else {
      alert('保存失败，请重试')
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
    alert('网络错误，请重试')
  }
}

// Format user ID
const formattedUserId = computed(() => {
  const id = props.currentUser?.id || 0
  return String(id).padStart(8, '0')
})
</script>

<template>
  <div class="profile-page">
    <!-- Profile Header Section -->
    <div class="profile-header">
      <div class="avatar-section">
        <img :src="currentUser.avatar" alt="头像" class="profile-avatar" />
      </div>
      
      <div class="info-section">
        <div class="name-row">
          <h1 class="nickname">{{ currentUser.nickname }}</h1>
          <button class="edit-btn" @click="openEditModal">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="19" cy="12" r="2"/>
            </svg>
          </button>
        </div>
        
        <p class="user-id">趣生活号：{{ formattedUserId }}</p>
        
        <p class="bio">{{ currentUser.bio || '还没有简介' }}</p>
        
        <div class="gender-tag" v-if="currentUser.gender && currentUser.gender !== '保密'">
          <svg v-if="currentUser.gender === '女'" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C9.24 2 7 4.24 7 7c0 2.52 1.86 4.59 4.28 4.94V14H9v2h2.28v3h1.43v-3H15v-2h-2.28v-2.06C15.14 11.59 17 9.52 17 7c0-2.76-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C9.24 2 7 4.24 7 7c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm4 4h-2.06c-.48 1.72-1.25 3.3-2.25 4.57-.55.7-.88 1.16-.88 1.16L12 21l1.19-1.27s0 0-.02-.02c-.2-.25-.37-.5-.55-.76.99-1.26 1.76-2.84 2.25-4.55H17v-1.4h-3V13h-2v.4H9v1.4z"/>
          </svg>
        </div>
        
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-number">{{ stats.following }}</span>
            <span class="stat-label">关注</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats.followers }}</span>
            <span class="stat-label">粉丝</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ stats.likes }}</span>
            <span class="stat-label">获赞与收藏</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs-container">
      <div class="tabs">
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
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="35" r="20" stroke="#ddd" stroke-width="2"/>
            <path d="M25 60 Q40 75 55 60" stroke="#ddd" stroke-width="2" fill="none"/>
          </svg>
        </div>
        <p class="empty-text">
          <template v-if="activeTab === 'notes'">TA 还没有发布任何内容哦</template>
          <template v-else-if="activeTab === 'favorites'">TA 还没有收藏任何内容</template>
          <template v-else>TA 还没有点赞任何内容</template>
        </p>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="edit-modal">
        <div class="modal-header">
          <button class="modal-close" @click="closeEditModal">取消</button>
          <h2>编辑资料</h2>
          <button class="modal-save" @click="saveProfile">保存</button>
        </div>
        
        <div class="modal-content">
          <!-- Avatar Edit -->
          <div class="avatar-edit-section">
            <div class="avatar-preview" @click="triggerAvatarUpload">
              <img :src="editAvatar" alt="头像" />
              <div class="avatar-overlay">
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M21 6h-4l-2-2H9L7 6H3v14h18V6zm-9 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                </svg>
                <span>更换头像</span>
              </div>
            </div>
            <input 
              ref="avatarInputRef"
              type="file" 
              accept="image/*" 
              @change="handleAvatarChange" 
              hidden 
            />
          </div>

          <div class="form-group">
            <label>昵称</label>
            <input v-model="editNickname" type="text" placeholder="请输入昵称" maxlength="20" />
          </div>
          
          <div class="form-group">
            <label>性别</label>
            <div class="gender-select">
              <button 
                v-for="opt in genderOptions" 
                :key="opt"
                class="gender-option"
                :class="{ selected: editGender === opt }"
                @click="editGender = opt"
              >
                {{ opt }}
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label>简介</label>
            <textarea v-model="editBio" placeholder="介绍一下自己吧" maxlength="100"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  background: #fff;
  min-height: 100vh;
}

/* Profile Header */
.profile-header {
  display: flex;
  gap: 32px;
  padding: 40px 60px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-section {
  flex-shrink: 0;
}

.profile-avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
}

.info-section {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.nickname {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.edit-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  border-radius: 50%;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #f5f5f5;
}

.edit-btn svg {
  width: 20px;
  height: 20px;
}

.user-id {
  font-size: 13px;
  color: #999;
  margin: 0 0 12px 0;
}

.bio {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.gender-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #f0f0f0;
  border-radius: 50%;
  margin-bottom: 16px;
}

.gender-tag svg {
  width: 12px;
  height: 12px;
  color: #999;
}

.stats-row {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.stat-number {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.stat-label {
  font-size: 13px;
  color: #999;
}

/* Tabs */
.tabs-container {
  border-bottom: 1px solid #f0f0f0;
  padding: 0 60px;
}

.tabs {
  display: flex;
  gap: 32px;
}

.tab-btn {
  padding: 16px 8px;
  font-size: 15px;
  color: #666;
  position: relative;
  transition: color 0.2s;
}

.tab-btn:hover {
  color: #333;
}

.tab-btn.active {
  color: #333;
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: #333;
  border-radius: 2px;
}

/* Content Area */
.content-area {
  padding: 60px;
  display: flex;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* Edit Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-modal {
  background: white;
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
}

.modal-close,
.modal-save {
  font-size: 15px;
  padding: 4px 8px;
}

.modal-close {
  color: #666;
}

.modal-save {
  color: #ff2442;
  font-weight: 500;
}

.modal-save:hover {
  opacity: 0.8;
}

.modal-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff2442;
}

.form-group textarea {
  height: 80px;
  resize: none;
}

.gender-select {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.gender-option:hover {
  border-color: #ff2442;
  color: #ff2442;
}

.gender-option.selected {
  background: #ff2442;
  border-color: #ff2442;
  color: white;
}

/* Avatar Edit Section */
.avatar-edit-section {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.avatar-preview {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-preview:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay svg {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.avatar-overlay span {
  font-size: 11px;
  color: white;
}
</style>
