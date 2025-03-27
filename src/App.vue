
<template>
  <div class="app">
    <div class="chat-container" :class="{ 'full-width': !showHistory }">
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

        <div class="chat-content">
          <ChatInterface 
            :messages="currentMessages"
            @update:messages="updateMessages" 
          />
        </div>

        
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
const showHistory = ref(true)
const newMessage = ref('')

const toggleHistory = () => {
  showHistory.value = !showHistory.value
}

const sendMessage = () => {
  if (newMessage.value.trim()) {
    currentMessages.value.push({
      text: newMessage.value,
      isUser: true
    })
    newMessage.value = ''
  }
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
  background-color: #fafafa;
  font-family: 'Inter', sans-serif;
}

.chat-container {
  display: flex;
  height: 100%;
}

.chat-container.full-width {
  width: 100%;
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
  transform: translateX(-250px);
  position: absolute;
  height: 100%;
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
  width: 100%;
  padding: 0.75rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}

.history-item:hover {
  background: #f0f7ff;
}

.history-item.active {
  background: #e6f2ff;
  color: #0066cc;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.top-bar {
  padding: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message-controls {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.5rem;
}

.input-container input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f0f7ff;
  color: #0066cc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: #e6f2ff;
}
</style>
