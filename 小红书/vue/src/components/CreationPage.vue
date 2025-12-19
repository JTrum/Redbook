<script setup>
import { ref } from 'vue'

// Removed internal navigation logic as we now rely on the global sidebar
</script>

<template>
  <div class="creation-container">
    <header class="creation-header">
      <div class="header-left">
        <!-- Text removed as requested -->
      </div>
      <div class="header-right">
        <div class="user-profile">
          <img src="https://picsum.photos/32/32" alt="Avatar" class="avatar" />
          <span class="username">嘉伟</span>
        </div>
      </div>
    </header>

    <div class="main-body">
      <!-- Internal Sidebar removed -->

      <main class="content-area">
        <div class="tabs">
          <span class="tab active">上传视频</span>
          <span class="tab">上传图文</span>
          <span class="tab">写长文</span>
          <span class="drafts">草稿箱(0)</span>
        </div>

        <div class="warning-banner">
          <span class="warning-icon">!</span>
          你还未绑定手机号，前往APP端「设置」-「账户与安全」-「手机号」绑定手机号后才可发布笔记
          <a href="#" class="link">我了解了</a>
        </div>

        <div class="upload-area">
          <div class="upload-content">
            <div class="cloud-icon">
              <svg viewBox="0 0 24 24" width="64" height="64" fill="#e0e0e0">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
              </svg>
            </div>
            <p class="upload-text">拖拽视频到此或点击上传</p>
            <button class="upload-btn">上传视频</button>
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
            <p>推荐上传720P（1280*720）及以上视频，超过1080P的视频用网页端上传画质更清晰哦</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.creation-container {
  display: flex;
  flex-direction: column;
  height: 100%; /* Changed from 100vh to 100% to fit container */
  background-color: var(--bg-color);
}

.creation-header {
  height: 60px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  color: var(--primary-color);
  font-weight: 900;
  font-size: 20px;
}

.platform-text {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-primary);
}

.avatar {
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.main-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar styles removed */

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
  margin-bottom: 20px;
  padding: 0 8px;
  background: white;
  padding: 16px 24px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #f0f0f0;
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
  display: flex;
  align-items: center;
}

.warning-banner {
  background-color: #fffbf0;
  border: 1px solid #ffe58f;
  padding: 12px 16px;
  font-size: 13px;
  color: #595959;
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 20px;
}

.warning-icon {
  background: #faad14;
  color: white;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 11px;
}

.link {
  color: #1890ff;
  margin-left: 8px;
  text-decoration: none;
}

.upload-area {
  background-color: white;
  border-radius: 4px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d9d9;
  margin-bottom: 32px;
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
  padding: 8px 32px;
  border-radius: 4px;
  border: none;
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
</style>
