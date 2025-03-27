<template>
  <div class="app">
    <button class="toggle-history" @click="showHistory = !showHistory">
      <i class="fas" :class="showHistory ? 'fa-times' : 'fa-bars'"></i>
    </button>
    <div class="sidebar" :class="{ 'hidden': !showHistory }">
      <ChatHistory 
        :chats="chats"
        :current-index="currentChatIndex"
        @select="selectChat"
        @delete="deleteChat"
        @new="createNewChat"
      />
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
import ChatHistory from './components/ChatHistory.vue'

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

.chat-container {
  flex: 1;
  height: 100%;
}
</style>