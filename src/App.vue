<template>
  <div class="app">
    <div class="chat-container">
      <ChatInterface 
        :messages="currentMessages"
        @update:messages="updateMessages"
        current-agent="default"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatInterface from './components/ChatInterface.vue'

const currentMessages = ref<Array<{text: string, isUser: boolean}>>([])
const newMessage = ref('')

const updateMessages = (messages: Array<{text: string, isUser: boolean}>) => {
  currentMessages.value = messages
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
  width: 100%;
  height: 100%;
}
</style>