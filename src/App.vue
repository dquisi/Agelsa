
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

      <div class="chat-controls">
        <button class="icon-btn" title="Voice">
          <i class="fas fa-microphone"></i>
        </button>
        <button @click="toggleConfig" class="icon-btn" title="Settings">
          <i class="fas fa-cog"></i>
        </button>
      </div>

      <ChatInterface 
        :messages="currentMessages"
        @update:messages="updateMessages" 
      />
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
  currentMessages.value = [...messages]
  if (!chatHistory.value[currentChatIndex.value]) {
    chatHistory.value[currentChatIndex.value] = []
  }
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
  background-color: #fafafa;
  font-family: 'Inter', sans-serif;
}

.chat-history {
  width: 250px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.chat-history.hidden {
  transform: translateX(-100%);
}

.history-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
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
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  margin-bottom: 0.5rem;
  color: #333;
}

.history-item::before {
  content: '\f15c';
  font-family: 'Font Awesome 5 Free';
  font-weight: 400;
}

.history-item:hover {
  background: #f0f7ff;
}

.history-item.active {
  background: #e6f2ff;
  color: #0066cc;
}

.chat-controls {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  justify-content: flex-end;
  background: #fff;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  padding: 0.75rem;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  gap: 1rem;
}

.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #f0f7ff;
  color: #0066cc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: #e6f2ff;
  transform: translateY(-1px);
}

.icon-btn:active {
  transform: translateY(0);
}
</style>
