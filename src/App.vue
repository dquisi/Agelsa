
<template>
  <div class="app">
    <div class="top-bar">
      <AgentSelector @update:agent="updateAgent" />
      <button @click="toggleHistory" class="toggle-history-btn">
        <i class="fas fa-history"></i>
      </button>
    </div>
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
    <div class="main-content">
      <AgentSelector @update:agent="updateAgent" />
      <ChatInterface 
        :currentAgent="currentAgent"
        :messages="currentMessages"
        @update:messages="updateMessages" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AgentSelector from './components/AgentSelector.vue'
import ChatInterface from './components/ChatInterface.vue'

const currentAgent = ref('ELSA ANALITICA')
const chatHistory = ref<Array<Array<{text: string, isUser: boolean}>>>([])
const currentChatIndex = ref(0)
const currentMessages = ref<Array<{text: string, isUser: boolean}>>([])
const isSoundEnabled = ref(true)
const showHistory = ref(true)

const toggleSound = () => {
  isSoundEnabled.value = !isSoundEnabled.value
}

const toggleHistory = () => {
  showHistory.value = !showHistory.value
}

const updateAgent = (agent: string) => {
  currentAgent.value = `ELSA ${agent.toUpperCase()}`
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
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  z-index: 100;
}

.app > div:not(.top-bar) {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 280px;
  background-color: #fff;
  padding: 1.25rem;
  border-right: 1px solid rgba(0,0,0,0.1);
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.sidebar.hidden {
  transform: translateX(-250px);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
}

.icon-btn:hover {
  color: #333;
}

.main-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
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
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.new-chat-btn:hover {
  background-color: #45a049;
}

.toggle-history-btn {
  position: fixed;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 1000;
  background: #fff;
  border: none;
  border-radius: 50%;
  padding: 0.75rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-history-btn:hover {
  background: #f8f9fa;
  transform: scale(1.05);
}

.sidebar-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
