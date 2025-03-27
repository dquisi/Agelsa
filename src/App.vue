
<template>
  <div class="app">
    <div class="sidebar" :class="{ 'collapsed': !showSidebar }">
      <button class="toggle-sidebar" @click="showSidebar = !showSidebar">
        <i class="fas" :class="showSidebar ? 'fa-times' : 'fa-bars'"></i>
      </button>
      <div class="chat-list" v-if="showSidebar">
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

const showSidebar = ref(true)
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

.sidebar {
  width: 250px;
  background: #f0f0f0;
  border-right: 1px solid #ddd;
  position: relative;
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 50px;
}

.toggle-sidebar {
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
}

.chat-list {
  padding: 1rem;
  padding-top: 3rem;
}

.new-chat {
  width: 100%;
  padding: 0.8rem;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.chat-item {
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.chat-item:hover {
  background: #e0e0e0;
}

.chat-item.active {
  background: #e6f2ff;
  color: #007AFF;
}

.chat-item i {
  opacity: 0;
  transition: opacity 0.2s;
}

.chat-item:hover i {
  opacity: 1;
}

.chat-container {
  flex: 1;
  height: 100%;
}
</style>
