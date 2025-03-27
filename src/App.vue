<template>
  <div class="app">
    <div class="main-container">
      <button @click="toggleHistory" class="toggle-history-btn">
        <i class="fas fa-bars"></i>
      </button>

      <div class="sidebar" :class="{ 'hidden': !showHistory }">
        <div class="chat-list">
          <button 
            v-for="(chat, index) in chatHistory" 
            :key="index"
            @click="loadChat(index)"
            class="chat-item"
          >
            Chat {{ index + 1 }}
          </button>
        </div>
        <button @click="newChat" class="new-chat-btn">
          <i class="fas fa-plus"></i>
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
  position: relative;
}

.toggle-history-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: #ffffff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-history-btn:hover {
  transform: scale(1.05);
  background: #f8f9fa;
}

.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background-color: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 100;
}

.sidebar.hidden {
  transform: translateX(-100%);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.chat-item {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: none;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
  color: #333;
}

.chat-item:hover {
  background-color: #e9ecef;
}

.new-chat-btn {
  margin: 1rem;
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  transition: transform 0.2s;
}

.new-chat-btn:hover {
  transform: scale(1.05);
}
</style>