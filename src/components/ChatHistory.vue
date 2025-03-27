
<template>
  <div class="chat-list">
    <h2 class="history-title">History</h2>
    <div class="chat-items">
      <div 
        v-for="(chat, index) in chats" 
        :key="index"
        class="chat-item"
        :class="{ 'active': currentIndex === index }"
        @click="$emit('select', index)"
      >
        <span>Chat {{ index + 1 }}</span>
        <i 
          class="fas fa-trash" 
          @click.stop="$emit('delete', index)" 
          v-if="chats.length > 1"
        ></i>
      </div>
    </div>
    <button class="new-chat" @click="$emit('new')">
      <i class="fas fa-plus"></i> New Chat
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  chats: Array<{messages: Array<{text: string, isUser: boolean}>}>,
  currentIndex: number
}>()

defineEmits<{
  (e: 'select', index: number): void
  (e: 'delete', index: number): void
  (e: 'new'): void
}>()
</script>

<style scoped>
.chat-list {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.history-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.chat-items {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.2s;
}

.chat-item:hover {
  background: #f5f5f5;
}

.chat-item.active {
  background: #f0f7ff;
  color: #007AFF;
}

.chat-item i {
  color: #999;
  font-size: 0.8rem;
  padding: 0.4rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.chat-item:hover i:hover {
  background: #e6e6e6;
  color: #ff4444;
}

.new-chat {
  width: 100%;
  padding: 0.75rem;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.new-chat:hover {
  background: #0066cc;
}
</style>
