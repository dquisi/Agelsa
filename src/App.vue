
<template>
  <div class="app">
    <button class="toggle-history" @click="showHistory = !showHistory">
      <i class="fas" :class="showHistory ? 'fa-times' : 'fa-bars'"></i>
    </button>
    <div class="sidebar" :class="{ 'hidden': !showHistory }">
      <div class="chat-list">
        <button class="new-chat" @click="createNewChat">
          <i class="fas fa-plus"></i> New Chat
        </button>
        <div 
          v-for="(chat, index) in chats" 
          :key="index"
          class="chat-item"
          :class="{ 'active': currentChatIndex === index }"
          @click="selectChat(index)"
        >
          <span>Chat {{ index + 1 }}</span>
          <i class="fas fa-trash" @click.stop="deleteChat(index)" v-if="chats.length > 1"></i>
        </div>
      </div>
    </div>
    <div class="chat-container">
      <ChatInterface 
        :messages="currentChat.messages"
        @update:messages="updateMessages"
        :current-agent="currentAgent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ChatInterface from './components/ChatInterface.vue'

interface Chat {
  messages: Array<{text: string, isUser: boolean}>
}


const showHistory = ref(false)
const currentAgent = ref('default')
const chats = ref<Chat[]>([{ messages: [] }])
const currentChatIndex = ref(0)

const currentChat = computed(() => chats.value[currentChatIndex.value])

const createNewChat = () => {
  chats.value.push({ messages: [] })
  currentChatIndex.value = chats.value.length - 1
}

const selectChat = (index: number) => {
  currentChatIndex.value = index
}

const deleteChat = (index: number) => {
  chats.value.splice(index, 1)
  if (currentChatIndex.value >= chats.value.length) {
    currentChatIndex.value = chats.value.length - 1
  }
}

const updateMessages = (messages: Array<{text: string, isUser: boolean}>) => {
  chats.value[currentChatIndex.value].messages = messages
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
  display: flex;
}

.toggle-history {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-history:hover {
  background: #f5f5f5;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 50;
}

.sidebar.hidden {
  transform: translateX(-100%);
}

.chat-list {
  padding: 0.75rem;
  flex: 1;
  overflow-y: auto;
}

.new-chat {
  width: 100%;
  padding: 0.75rem;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
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

.chat-container {
  flex: 1;
  height: 100%;
}
</style>
