<script setup>
import { ref, onMounted, computed } from 'vue'
import TheSidebar from './components/TheSidebar.vue'
import TheHeader from './components/TheHeader.vue'
import CategoryTabs from './components/CategoryTabs.vue'
import MasonryGrid from './components/MasonryGrid.vue'
import CreationPage from './components/CreationPage.vue'
import NotificationPage from './components/NotificationPage.vue'
import AuthModal from './components/AuthModal.vue'
import ProfilePage from './components/ProfilePage.vue'
import PostDetailModal from './components/PostDetailModal.vue'

const currentView = ref('discovery')
const showAuthModal = ref(false)
const currentUser = ref(null)
const pendingNavigation = ref(null) // Store intended navigation when login is required
const selectedPost = ref(null)
const showPostDetail = ref(false)
const interactionOccurred = ref(false) // Track if user interacted with post (like/collect/comment)

// Dark mode toggle
const isDarkMode = ref(false)

// Toggle dark mode function
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
}

// Load dark mode preference from localStorage on mount
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode === 'true'
  } else {
    // Check system preference
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
})

const handleOpenDetail = (post) => {
  selectedPost.value = { ...post }
  showPostDetail.value = true
  interactionOccurred.value = false // Reset interaction flag when opening
}

const handleCloseDetail = (shouldRefresh = false) => {
  showPostDetail.value = false
  selectedPost.value = null
  // Only fetch posts if there was an interaction (like/collect/comment)
  if (shouldRefresh || interactionOccurred.value) {
    fetchPosts()
  }
}

const handleInteraction = () => {
  interactionOccurred.value = true
}

const handleNavChange = (id) => {
  // Check if trying to publish without login
  if (id === 'publish' && !currentUser.value) {
    pendingNavigation.value = 'publish'
    showAuthModal.value = true
    return
  }
  
  currentView.value = id
  // Re-fetch posts when navigating to discovery
  if (id === 'discovery') {
    fetchPosts()
  }
}

const handleShowLogin = () => {
  showAuthModal.value = true
}

const handleLoginSuccess = (user) => {
  currentUser.value = user
  showAuthModal.value = false
  
  // Navigate to pending page if there was one
  if (pendingNavigation.value) {
    currentView.value = pendingNavigation.value
    pendingNavigation.value = null
  }
}

const handleLogout = () => {
  currentUser.value = null
  localStorage.removeItem('user')
  currentView.value = 'discovery'
}

const handleUpdateUser = (updatedUser) => {
  currentUser.value = updatedUser
  localStorage.setItem('user', JSON.stringify(updatedUser))
}

const handleBackFromProfile = () => {
  currentView.value = 'discovery'
}

// Check if user is already logged in (from localStorage)
onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser)
    } catch (e) {
      localStorage.removeItem('user')
    }
  }
})

const posts = ref([])

const fetchPosts = async () => {
  try {
    const response = await fetch('/api/posts')
    const data = await response.json()
    
    // Map backend data to frontend structure
    posts.value = await Promise.all(data.map(async post => {
      // Get like status for current user if logged in
      let likeStatus = { liked: false, likeCount: 0 }
      let collectStatus = { collected: false, collectionCount: 0 }
      
      if (currentUser.value) {
        try {
          const likeRes = await fetch(`/api/posts/${post.id}/like/status?userId=${currentUser.value.id}`)
          likeStatus = await likeRes.json()
        } catch (e) {
          console.warn('Failed to fetch like status:', e)
        }
        
        try {
          const collectRes = await fetch(`/api/posts/${post.id}/collect/status?userId=${currentUser.value.id}`)
          collectStatus = await collectRes.json()
        } catch (e) {
          console.warn('Failed to fetch collect status:', e)
        }
      }
      
      return {
        id: post.id,
        title: post.title,
        description: post.description || '',
        // For videos, use cover_url if available, otherwise use a placeholder
        image: post.type === 'video' 
          ? (post.cover_url || '/api/uploads/video_cover_placeholder.svg') 
          : post.url, 
        videoUrl: post.type === 'video' ? post.url : null,
        type: post.type,
        user: post.author,
        avatar: post.author_avatar,
        author_id: post.author_id,
        likes: likeStatus.likeCount,
        likeCount: likeStatus.likeCount,
        likeStatus: likeStatus.liked,
        collectionCount: collectStatus.collectionCount,
        collectionStatus: collectStatus.collected,
        createdAt: post.created_at
      }
    }))
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  }
}

fetchPosts()

</script>

<template>
  <div class="app-container">
    <TheSidebar 
      :active-item="currentView" 
      :current-user="currentUser"
      :is-dark-mode="isDarkMode"
      @change="handleNavChange" 
      @show-login="handleShowLogin"
      @logout="handleLogout"
      @toggle-dark-mode="toggleDarkMode"
    />
    <div class="main-content">
      <TheHeader 
        v-if="currentView !== 'publish' && currentView !== 'profile'" 
        :current-user="currentUser" 
        :is-dark-mode="isDarkMode"
        @toggle-dark-mode="toggleDarkMode"
      />
      
      <template v-if="currentView === 'discovery'">
        <CategoryTabs />
        <main class="content-scroll-area">
          <MasonryGrid :items="posts" :current-user="currentUser" @open-detail="handleOpenDetail" />
        </main>
      </template>

      <template v-else-if="currentView === 'notification'">
        <NotificationPage />
      </template>
      
      <template v-else-if="currentView === 'profile'">
        <ProfilePage 
          :current-user="currentUser"
          @update-user="handleUpdateUser"
          @back="handleBackFromProfile"
          @open-detail="handleOpenDetail"
        />
      </template>
      
      <CreationPage v-else-if="currentView === 'publish'" :current-user="currentUser" />
    </div>
    
    <!-- Auth Modal -->
    <AuthModal 
      v-if="showAuthModal" 
      @close="showAuthModal = false; pendingNavigation = null"
      @login-success="handleLoginSuccess"
    />
    
    <!-- Post Detail Modal -->
    <PostDetailModal 
      v-if="showPostDetail && selectedPost" 
      :post="selectedPost"
      :current-user="currentUser"
      @close="handleCloseDetail"
      @interaction="handleInteraction"
    />
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
