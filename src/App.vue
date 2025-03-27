
<template>
  <div class="app">
    <button @click="toggleHistory" class="toggle-history-btn">
      <i class="fas fa-bars"></i>
    </button>
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
  height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 250px;
  background-color: #fff;
  padding: 1rem;
  border-right: 1px solid #eee;
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
  padding: 0.5rem;
  margin: 0.25rem 0;
  border: none;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
}

.chat-item:hover {
  background-color: #eee;
}

.new-chat-btn {
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
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
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  background: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.toggle-history-btn:hover {
  background: #f5f5f5;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
