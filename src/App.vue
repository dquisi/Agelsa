
<template>
  <div class="app">
    <div class="chat-history" :class="{ 'hidden': !showHistory }">
      <div class="history-header">
        <h3>History</h3>
        <button @click="newChat" class="icon-btn" title="New Chat">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="history-list">
        <button 
          v-for="(chat, index) in chatHistory" 
          :key="index"
          @click="loadChat(index)"
          class="history-item"
          :class="{ 'active': currentChatIndex === index }"
        >
          Chat {{ index + 1 }}
        </button>
      </div>
    </div>
    
    <div class="main-container">
      <div class="top-bar">
        <button @click="toggleHistory" class="icon-btn">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <ChatInterface 
        :messages="currentMessages"
        @update:messages="updateMessages" 
      />

      <div class="actions">
        <button class="icon-btn" title="Voice">
          <i class="fas fa-microphone"></i>
        </button>
        <button @click="toggleConfig" class="icon-btn" title="Settings">
          <i class="fas fa-cog"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatInterface from './components/ChatInterface.vue'

const chatHistory = ref<Array<Array<{text: string, isUser: boolean}>>>([])
const currentChatIndex = ref(0)
const currentMessages = ref<Array<{text: string, isUser: boolean}>>([])
const showHistory = ref(false)

const toggleHistory = () => {
  showHistory.value = !showHistory.value
}

const toggleConfig = () => {
  // Configuration toggle logic here
}

const newChat = () => {
  chatHistory.value.push([])
  currentChatIndex.value = chatHistory.value.length - 1
  currentMessages.value = []
}

const loadChat = (index: number) => {
  currentChatIndex.value = index
  currentMessages.value = [...chatHistory.value[index]]
}

const updateMessages = (messages: Array<{text: string, isUser: boolean}>) => {
  currentMessages.value = messages
  chatHistory.value[currentChatIndex.value] = [...messages]
}

if (chatHistory.value.length === 0) {
  newChat()
}
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  height: 100vh;
  display: flex;
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.chat-history {
  width: 280px;
  max-width: 100%;
  background: #f8f9fa;
  border-right: 1px solid #eee;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.chat-history.hidden {
  width: 0;
  transform: translateX(-100%);
}

.history-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.history-item {
  width: 100%;
  padding: 0.75rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.history-item:hover {
  background: #eee;
}

.history-item.active {
  background: #e9ecef;
  color: #4CAF50;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.top-bar {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.spacer {
  flex: 1;
}

.actions {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  justify-content: center;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.icon-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  background: #f8f9fa;
}
</style>
