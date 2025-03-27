<template>
  <div class="app">
    <div class="main-container">
      <ChatInterface 
        :messages="currentMessages"
        @update:messages="updateMessages" 
      />
      <div class="actions">
        <button @click="newChat" class="action-btn">
          <i class="fas fa-plus"></i>
        </button>
        <button 
          v-for="(chat, index) in chatHistory" 
          :key="index"
          @click="loadChat(index)"
          class="action-btn"
          :class="{ 'active': currentChatIndex === index }"
        >
          {{ index + 1 }}
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
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.action-btn:first-child {
  background: #4CAF50;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.active {
  background: #e9ecef;
  color: #4CAF50;
}
</style>