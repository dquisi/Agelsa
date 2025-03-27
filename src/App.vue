<template>
  <div class="app">
    <div class="main-container">
      <div class="top-bar">
        <button @click="toggleHistory" class="toggle-history-btn">
          <i class="fas fa-history"></i>
        </button>
        <div class="agent-selector">
          <select v-model="currentAgent" class="agent-select">
            <option value="ELSA ANALITICA">ELSA Analítica</option>
            <option value="ELSA CONTENIDO">ELSA Contenido</option>
            <option value="ELSA RECURSOS">ELSA Recursos</option>
          </select>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="sidebar" :class="{ 'hidden': !showHistory }">
          <div class="sidebar-header">
            <h3>Chat History</h3>
          </div>
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
            <i class="fas fa-plus"></i> New Chat
          </button>
        </div>

        <ChatInterface 
          :currentAgent="currentAgent"
          :messages="currentMessages"
          @update:messages="updateMessages" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatInterface from './components/ChatInterface.vue'

const currentAgent = ref('ELSA ANALITICA')
const chatHistory = ref<Array<Array<{text: string, isUser: boolean}>>>([])
const currentChatIndex = ref(0)
const currentMessages = ref<Array<{text: string, isUser: boolean}>>([])
const showHistory = ref(true)

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

// Initialize first chat
if (chatHistory.value.length === 0) {
  newChat()
}
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';

.app {
  height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.agent-selector {
  flex: 1;
  display: flex;
  justify-content: center;
}

.agent-select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
  min-width: 200px;
}

.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 280px;
  background-color: #fff;
  padding: 1.25rem;
  border-right: 1px solid rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.sidebar.hidden {
  transform: translateX(-280px);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  margin: 1rem 0;
}

.chat-item {
  width: 100%;
  padding: 0.75rem 1rem;
  margin: 0.375rem 0;
  border: none;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  color: #2c3e50;
}

.chat-item:hover {
  background-color: #e9ecef;
  transform: translateX(4px);
}

.new-chat-btn {
  padding: 0.875rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.new-chat-btn:hover {
  background-color: #45a049;
}

.toggle-history-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #444;
}

.toggle-history-btn svg {
  width: 16px;
  height: 16px;
}

.toggle-history-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>