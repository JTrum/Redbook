<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import PostCard from './PostCard.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const columnCount = ref(2)
const columns = ref([])

const updateColumnCount = () => {
  const width = window.innerWidth
  if (width >= 1600) {
    columnCount.value = 5
  } else if (width >= 1200) {
    columnCount.value = 4
  } else if (width >= 800) {
    columnCount.value = 3
  } else {
    columnCount.value = 2
  }
}

const distributeItems = () => {
  // Initialize columns
  const newColumns = Array.from({ length: columnCount.value }, () => [])
  
  // Simple distribution: round robin
  props.items.forEach((item, index) => {
    newColumns[index % columnCount.value].push(item)
  })
  
  columns.value = newColumns
}

watch(() => [props.items, columnCount.value], () => {
  distributeItems()
}, { deep: true })

onMounted(() => {
  updateColumnCount()
  distributeItems()
  window.addEventListener('resize', updateColumnCount)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateColumnCount)
})
</script>

<template>
  <div class="masonry-grid">
    <div 
      v-for="(col, index) in columns" 
      :key="index" 
      class="masonry-column"
    >
      <PostCard 
        v-for="item in col" 
        :key="item.id" 
        :post="item" 
      />
    </div>
  </div>
</template>

<style scoped>
.masonry-grid {
  display: flex;
  gap: 20px;
  width: 100%;
}

.masonry-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Important for flex child text overflow */
}
</style>
