
<template>
  <div class="app">
    <div class="main-container">
      <div class="top-bar">
        <button @click="toggleConfig" class="icon-btn">
          <i class="fas fa-cog"></i>
        </button>
      </div>
      <ChatInterface 
        :messages="currentMessages"
        @update:messages="updateMessages" 
      />
      <div class="actions" :class="{ 'hidden': hideButtons }">
        <button @click="toggleButtons" class="icon-btn toggle-btn">
          <i :class="hideButtons ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </button>
        <button @click="newChat" class="icon-btn primary">
          <i class="fas fa-plus"></i>
        </button>
        <button 
          v-for="(chat, index) in chatHistory" 
          :key="index"
          @click="loadChat(index)"
          class="icon-btn"
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
const hideButtons = ref(false)

const toggleButtons = () => {
  hideButtons.value = !hideButtons.value
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
  background-color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  transition: transform 0.3s ease;
}

.actions.hidden {
  transform: translateY(100%);
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.icon-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.icon-btn.primary {
  background: #4CAF50;
  color: white;
}

.icon-btn.active {
  background: #e9ecef;
  color: #4CAF50;
}

.toggle-btn {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #eee;
  width: 30px;
  height: 30px;
}
</style>
